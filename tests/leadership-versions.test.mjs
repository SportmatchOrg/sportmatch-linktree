// Guards the data the leadership views carry (WBS, PERT and Gantt, one entry per version).
// The pages hardcode their data as JS literals; these tests pull those literals out and
// check the invariants the runtime aggregation relies on, plus the v4-specific rules
// (Thursday-to-Thursday weeks, no work in the reserve week, one WBS for all three views).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

/** Pull a top-level `const <name> = <literal>;` out of a page and evaluate it. */
function constant(html, name, open = "{", close = "};") {
  const start = html.indexOf(`const ${name} = ${open}`);
  assert.notEqual(start, -1, `${name} not found`);
  const end = html.indexOf(`\n${close}`, start);
  assert.notEqual(end, -1, `end of ${name} not found`);
  const body = html.slice(start + `const ${name} = `.length, end + 1 + close.length - 1);
  return new Function(`return ${body}`)();
}

const l2 = (id) => id.split(".").slice(0, 2).join(".");
const numKey = (id) => id.split(".").map(Number);
const byNum = (a, b) => { const x = numKey(a), y = numKey(b); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i]; return 0; };

/** Package ids declared in the WBS v4 document (the source the v4 data is generated from). */
function wbsV4DocIds() {
  const md = read("docs/planning/WBS-SportMatch-v4.md");
  return [...md.matchAll(/^\*\*(\d+\.\d+\.\d+)\*\*/gm)].map((m) => m[1]).sort(byNum);
}

/** Same shape as applyAdds() in wbs.html. */
function applyAdds(base, adds, renames = {}) {
  const ren = (x) => renames[x] || x;
  const out = base.map(([pkg, subs]) => [ren(pkg), subs.map(([s, items]) => [ren(s), items.map(ren)])]);
  const added = new Set();
  for (const [pkgName, subName, items] of adds) {
    let pkg = out.find((p) => p[0] === pkgName);
    if (!pkg) out.push((pkg = [pkgName, []]));
    let sub = pkg[1].find((s) => s[0] === subName);
    if (!sub) pkg[1].push((sub = [subName, []]));
    for (const it of items) {
      assert.ok(!added.has(it), `duplicate addition: ${it}`);
      added.add(it);
      sub[1].push(it);
    }
  }
  return { tree: out, added };
}
const leaves = (tree) => tree.flatMap(([, subs]) => subs.flatMap(([, items]) => items));
const leafId = (leaf) => leaf.split(" ")[0];

function wbsTrees() {
  const html = read("leadership/wbs.html");
  const V1 = constant(html, "WBS_V1", "[", "];");
  const V2_ADD = constant(html, "V2_ADD", "[", "];");
  const V4_ADD = constant(html, "V4_ADD", "[", "];");
  const V4_RENAME = constant(html, "V4_RENAME");
  const v2 = applyAdds(V1, V2_ADD);
  const v4 = applyAdds(v2.tree, V4_ADD, V4_RENAME);
  return { v1: { tree: V1, added: new Set() }, v2, v4, V2_ADD, V4_ADD, V4_RENAME };
}

// ── PERT ─────────────────────────────────────────────────────────────────────
test("PERT: every dependency and every group name resolves, in every version", () => {
  const DATA = constant(read("leadership/pert.html"), "DATA");
  assert.deepEqual(Object.keys(DATA), ["v1", "v2", "v4"]);
  for (const [ver, { tasks, deps, groups, newIds = [] }] of Object.entries(DATA)) {
    for (const [succ, preds] of Object.entries(deps)) {
      assert.ok(tasks[succ], `${ver}: dep declared for unknown task ${succ}`);
      for (const p of preds) assert.ok(tasks[p], `${ver}: ${succ} depends on unknown task ${p}`);
    }
    for (const id of Object.keys(tasks)) assert.ok(deps[id], `${ver}: ${id} has no deps entry`);
    for (const g of new Set(Object.keys(tasks).map(l2))) assert.ok(groups[g], `${ver}: level-2 group ${g} has no name`);
    for (const id of newIds) assert.ok(tasks[id], `${ver}: newIds lists unknown task ${id}`);
    for (const [id, t] of Object.entries(tasks)) {
      assert.ok(t.ef >= t.es && t.lf >= t.ls && t.tf >= 0, `${ver}: ${id} has inconsistent CPM values`);
      assert.ok(Math.abs(t.ef - t.es - t.dur) < 0.02, `${ver}: ${id} ef - es != dur`);
    }
  }
});

test("PERT: each version keeps every group of the previous one and adds packages", () => {
  const DATA = constant(read("leadership/pert.html"), "DATA");
  const stats = (ver) => {
    const t = Object.values(DATA[ver].tasks);
    return { groups: new Set(Object.keys(DATA[ver].tasks).map(l2)), count: t.length, effort: t.reduce((s, x) => s + x.dur, 0), finish: Math.max(...t.map((x) => x.ef)) };
  };
  const vers = Object.keys(DATA);
  for (let i = 1; i < vers.length; i++) {
    const a = stats(vers[i - 1]), b = stats(vers[i]);
    for (const g of a.groups) assert.ok(b.groups.has(g), `${vers[i]} lost level-2 group ${g}`);
    assert.ok(b.count > a.count, `${vers[i]} should add packages`);
    // Effort is not monotonic: v4 carries the estimates recalibrated to the team's real pace (×0,75).
    assert.ok(Number.isFinite(b.effort) && Number.isFinite(b.finish));
  }
});

test("PERT v4: carries exactly the packages of the WBS v4 document", () => {
  const DATA = constant(read("leadership/pert.html"), "DATA");
  assert.deepEqual(Object.keys(DATA.v4.tasks).sort(byNum), wbsV4DocIds());
});

// ── Gantt ────────────────────────────────────────────────────────────────────
test("Gantt: the headline numbers of each version match its data", () => {
  const DATA = constant(read("leadership/gantt.html"), "DATA");
  // v1's label is historical prose; from v2 on, label and sub must state the real count and effort.
  for (const [ver, d] of Object.entries(DATA)) {
    if (ver === "v1") continue;
    const hours = d.tasks.reduce((s, t) => s + t.hours, 0);
    assert.match(d.label, new RegExp(`\\b${d.tasks.length} tareas\\b`), `${ver}: ${d.label}`);
    if (d.sub) {
      assert.match(d.sub, new RegExp(`\\b${d.tasks.length} tareas\\b`), `${ver}: ${d.sub}`);
      assert.match(d.sub, new RegExp(`\\b${Math.round(hours)} h de desarrollo\\b`), `${ver}: ${d.sub}`);
    }
  }
});

test("Gantt: every module has a colour, every group a name, every dep a task", () => {
  const DATA = constant(read("leadership/gantt.html"), "DATA");
  for (const [ver, { tasks, colors, names, critical = [], newIds = [] }] of Object.entries(DATA)) {
    const ids = new Set(tasks.map((t) => t.id));
    for (const t of tasks) {
      assert.ok(colors[t.mod], `${ver}: no colour for module ${t.mod}`);
      assert.ok(names[l2(t.id)], `${ver}: no name for group ${l2(t.id)}`);
      for (const d of t.deps) assert.ok(ids.has(d), `${ver}: ${t.id} depends on unknown ${d}`);
    }
    const used = new Set(tasks.map((t) => t.mod));
    for (const mod of Object.keys(colors)) assert.ok(used.has(mod), `${ver}: unused module colour ${mod}`);
    for (const id of [...critical, ...newIds]) assert.ok(ids.has(id), `${ver}: ${id} listed but not scheduled`);
  }
});

test("Gantt: bar geometry is valid — no task ends before it starts", () => {
  const DATA = constant(read("leadership/gantt.html"), "DATA");
  for (const [ver, d] of Object.entries(DATA)) {
    for (const t of d.tasks) {
      assert.ok(Date.parse(t.end) >= Date.parse(t.start), `${ver}: ${t.id} ends before it starts`);
      assert.ok(Date.parse(t.start) >= Date.parse("2026-07-30"), `${ver}: ${t.id} starts before the range`);
      assert.ok(Date.parse(t.end) <= Date.parse(d.rangeEnd), `${ver}: ${t.id} ends past the range`);
    }
  }
});

test("Gantt v4: Thursday-to-Thursday weeks, nothing in the reserve week, statuses consistent", () => {
  const DATA = constant(read("leadership/gantt.html"), "DATA");
  const d = DATA.v4;
  assert.equal(d.weekly, true, "v4 must declare weekly dates");
  const isThursday = (iso) => new Date(iso + "T00:00:00Z").getUTCDay() === 4;
  const counts = { done: 0, wip: 0, todo: 0 };
  for (const t of d.tasks) {
    assert.ok(isThursday(t.start), `${t.id} does not start on a Thursday: ${t.start}`);
    assert.ok(isThursday(t.end), `${t.id} does not end on a Thursday: ${t.end}`);
    assert.ok(t.end !== t.start, `${t.id} spans zero weeks`);
    assert.ok(Date.parse(t.end) <= Date.parse("2026-11-05"), `${t.id} ends inside the reserve week (05/11 → 12/11)`);
    assert.ok(t.status in counts, `${t.id}: unknown status ${t.status}`);
    counts[t.status]++;
    if (t.status === "done") assert.ok(Date.parse(t.end) <= Date.parse("2026-09-17"), `${t.id} is done but ends after the 17/09 steering`);
    assert.ok([1, 2, 3].includes(t.dev), `${t.id}: dev must be 1, 2 or 3`);
  }
  // Cronograma-y-PERT-v4.md §5: 43 hechos, 5 parciales, 28 pendientes; más los 2 del Challenge (13.0), en curso.
  assert.deepEqual(counts, { done: 43, wip: 7, todo: 28 });
  assert.equal(d.tasks.length, 78);
  // Sprint bands and milestones must cover the same calendar the tasks use.
  assert.ok(d.sprints.some((s) => s.end === "2026-11-05"), "S3 must close on 05/11");
  assert.ok(d.milestones.some((m) => m.date === "2026-11-12" && m.type === "delivery"), "Entrega 3 on 12/11");
});

// El bloque ya trabajado trae las fechas reales de Linear pegadas sobre un plan generado, y en
// algunos casos la realidad contradice el grafo de dependencias (una tarea cerrada que depende de
// otra sin cerrar). No se corrige acá: es una decisión de planificación. Se fija la lista para que
// no crezca en silencio. En v4 la lista la imprime scripts/generate-v4.py.
const KNOWN_DEP_VIOLATIONS = {
  v1: [],
  v2: ["4.1.3<4.1.2", "4.2.1<4.1.2", "5.2.1<5.1.2", "6.3.2<6.2.3", "7.2.1<7.1.1"],
  v4: ["10.2.1<3.2.3", "4.1.1<3.2.2", "4.1.3<4.1.2", "4.2.1<4.1.2", "5.1.2<5.1.1", "5.1.3<6.3.1",
       "5.1.4<6.4.3", "5.2.1<5.1.2", "5.2.3<5.1.3", "5.2.4<5.1.4", "6.2.1<6.1.2", "6.2.3<6.1.3", "6.2.4<6.3.4",
       "6.3.5<6.3.1", "7.2.1<7.1.1", "7.2.2<6.3.2", "9.1.4<3.2.3",
       // Ejecución real, no plan: SPO-235 cubre 7.3.2 y 7.3.3 a la vez, así que el detalle
       // arrancó en la misma semana que el mapa del que depende.
       "7.3.3<7.3.2"],
};

test("Gantt: no new dependency violations creep into the schedule", () => {
  const DATA = constant(read("leadership/gantt.html"), "DATA");
  const day = (d) => Date.parse(d + "T00:00:00Z");
  for (const [ver, d] of Object.entries(DATA)) {
    const by = Object.fromEntries(d.tasks.map((t) => [t.id, t]));
    const found = [];
    // v4 plans in whole weeks (Thursday to Thursday): a successor may share the week in which its
    // dependency closes (the sprint plan orders the days). A violation is starting *before* that week.
    const slack = ver === "v4" ? 7 * 86400000 : 0;
    for (const t of d.tasks) {
      for (const dep of t.deps) {
        if (by[dep] && day(t.start) < day(by[dep].end) - slack) found.push(`${t.id}<${dep}`);
      }
    }
    assert.deepEqual(found.sort(), [...KNOWN_DEP_VIOLATIONS[ver]].sort(), `${ver}: dependency violations changed`);
    if (ver === "v4") {
      // Lo pendiente se planificó respetando el grafo: toda violación involucra fechas reales de
      // Linear — un sucesor hecho o parcial, una dependencia hecha, o un paquete que todavía figura
      // como pendiente pero cuyo ticket ya arrancó (de ahí le viene la fecha de inicio).
      const LINEAR = constant(read("leadership/gantt.html"), "LINEAR");
      const arrancado = (id) => (LINEAR.byPkg[id] || []).some((k) => ["started", "completed"].includes(LINEAR.issues[k]?.k));
      for (const v of found) {
        const [succ, pred] = v.split("<");
        assert.ok(
          by[succ].status !== "todo" || by[pred].status === "done" || arrancado(succ),
          `${ver}: ${v} is a violation between two unfinished tasks`,
        );
      }
    }
  }
});

// ── WBS ──────────────────────────────────────────────────────────────────────
test("WBS: each version is the previous one plus its declared additions, and adds nothing twice", () => {
  const { v1, v2, v4, V2_ADD, V4_ADD } = wbsTrees();
  const l1 = leaves(v1.tree), l2set = leaves(v2.tree), l4set = leaves(v4.tree);

  assert.deepEqual(l2set.filter((x) => !v2.added.has(x)).sort(), [...l1].sort(), "v1 leaves must survive in v2");
  assert.equal(l2set.length, l1.length + v2.added.size, "v2 leaf count");
  assert.equal(new Set(l2set).size, l2set.length, "no duplicate leaves in v2");

  // v4 renames a few v2 leaves: compare by id, which never changes.
  const ids = (xs) => xs.map(leafId).sort(byNum);
  assert.deepEqual(ids(l4set.filter((x) => !v4.added.has(x))), ids(l2set), "v2 leaves must survive in v4");
  assert.equal(l4set.length, l2set.length + v4.added.size, "v4 leaf count");
  assert.equal(new Set(ids(l4set)).size, l4set.length, "no duplicate leaves in v4");

  for (const ADD of [V2_ADD, V4_ADD]) {
    for (const [, subName, items] of ADD) {
      const prefix = subName.split(" ")[0];
      for (const it of items) assert.ok(it.startsWith(prefix + "."), `${it} does not belong under ${subName}`);
    }
  }
});

test("WBS v4: carries exactly the packages of the WBS v4 document", () => {
  const { v4 } = wbsTrees();
  assert.deepEqual(leaves(v4.tree).map(leafId).sort(byNum), wbsV4DocIds());
  assert.equal(leaves(v4.tree).length, 118);
});

test("WBS: every package the PERT and the Gantt schedule exists in the WBS of that version", () => {
  const trees = wbsTrees();
  const pert = constant(read("leadership/pert.html"), "DATA");
  const gantt = constant(read("leadership/gantt.html"), "DATA");
  for (const ver of ["v1", "v2", "v4"]) {
    const wbsIds = new Set(leaves(trees[ver].tree).map(leafId));
    for (const id of Object.keys(pert[ver].tasks)) assert.ok(wbsIds.has(id), `${ver}: PERT schedules ${id}, which the WBS does not list`);
    for (const t of gantt[ver].tasks) assert.ok(wbsIds.has(t.id), `${ver}: Gantt schedules ${t.id}, which the WBS does not list`);
  }
});

// ── Pages ────────────────────────────────────────────────────────────────────
test("leadership pages: every inline script compiles", () => {
  for (const page of ["leadership/wbs.html", "leadership/pert.html", "leadership/gantt.html", "leadership/changelog.html"]) {
    const html = read(page);
    const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    assert.ok(scripts.length >= (page.includes("changelog") ? 0 : 1), `${page}: no inline script found`);
    for (const [i, src] of scripts.entries()) {
      assert.doesNotThrow(() => new vm.Script(src, { filename: `${page}#${i}` }), `${page}: inline script ${i} does not compile`);
    }
  }
});

test("leadership pages: the selector starts on v4 and the v4 tag text follows the version", () => {
  assert.match(read("leadership/wbs.html"), /render\('v4'\);\s*<\/script>/);
  assert.match(read("leadership/pert.html"), /build\('v4'\);\s*<\/script>/);
  assert.match(read("leadership/gantt.html"), /loadVersion\("v4"\);\s*<\/script>/);
  for (const page of ["leadership/pert.html", "leadership/gantt.html"]) {
    assert.doesNotMatch(read(page), /nuevo en v2/, `${page}: hardcoded 'nuevo en v2' tag`);
  }
});

// ── Runtime smoke (no browser): run the page scripts against a stub DOM ───────
function stubEl() {
  const e = {
    style: {}, dataset: {}, children: [], innerHTML: "", textContent: "", hidden: false, value: "", checked: false,
    classList: { toggle() {}, add() {}, remove() {} },
    appendChild(c) { this.children.push(c); return c; },
    setAttribute() {}, getAttribute() { return "1"; }, removeAttribute() {},
    addEventListener(type, fn) { (this.on ??= {})[type] = fn; }, remove() {}, querySelectorAll() { return []; },
    getBoundingClientRect() { return { width: 0, height: 0 }; },
    getContext() { return { measureText: () => ({ width: 10 }) }; },
  };
  return e;
}
function runPage(page) {
  const html = read(page);
  const src = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join("\n");
  const ctx = vm.createContext({
    document: { getElementById: stubEl, createElement: stubEl, createElementNS: stubEl, querySelectorAll: () => [], addEventListener() {}, head: stubEl() },
    window: { innerWidth: 1200, innerHeight: 800 }, requestAnimationFrame: (f) => f(), alert() {}, console,
  });
  vm.runInContext(src, ctx, { filename: page });
  return (expr) => vm.runInContext(expr, ctx);
}

test("Gantt runtime: both levels build rows for every version", () => {
  const evalIn = runPage("leadership/gantt.html");
  for (const ver of ["v1", "v2", "v4"]) {
    const l2 = evalIn(`state.level = "l2"; loadVersion("${ver}"); ({ rows: visibleRows().length, groups: groups.length, tasks: TASKS.length })`);
    const l3 = evalIn(`state.level = "l3"; rebuildTasks(); render(); ({ rows: visibleRows().length, subs: groups.reduce((n, g) => n + Object.keys(g.subs).length, 0), tasks: TASKS.length, crit: criticalSet.size })`);
    assert.equal(l2.rows, l2.groups + l2.tasks, `${ver}: level X.X rows`);
    assert.equal(l3.rows, l2.groups + l3.subs + l3.tasks, `${ver}: level X.X.X rows`);
    assert.equal(l3.subs, l2.tasks, `${ver}: one sub-package header per X.X group`);
    if (ver === "v4") {
      assert.deepEqual({ groups: l2.groups, subs: l3.subs, tasks: l3.tasks }, { groups: 10, subs: 22, tasks: 78 });
      assert.equal(l3.crit, 9, "v4: the nine critical packages are marked at level X.X.X");
    }
  }
});

// La vista "Avance por bloques" es la lámina del steering: las épicas donde está el grueso del
// trabajo se parten en bloques cronológicos en vez de una sola tira, y el resto queda en
// sub-paquetes. Entra en una diapositiva y se ve qué bloques ya cerraron.
test("Gantt runtime: el nivel por bloques parte las épicas declaradas y deja el resto en X.X", () => {
  const evalIn = runPage("leadership/gantt.html");
  const atLevel = (lvl) => evalIn(`state.level = "${lvl}"; loadVersion("v4"); ({ rows: visibleRows().length,
    blocks: TASKS.filter((t) => t.block).map((t) => [t.id, t.status]),
    hitos: (DATA.v4.charterHitos || []).map((h) => hitoRow(h.pkg)).filter((id) => TASKS.some((t) => t.id === id) || state.level === "l3"),
    orphans: (() => { const ids = new Set(TASKS.map((t) => t.id)); return TASKS.flatMap((t) => t.deps).filter((d) => !ids.has(d)); })() })`);
  // Ojo con los nombres: `l2` a secas es el helper de ids del módulo.
  const vL2 = atLevel("l2"), mix = atLevel("mix"), vL3 = atLevel("l3");

  const { blocks, tasks, charterHitos } = constant(read("leadership/gantt.html"), "DATA").v4;
  const mods = new Set(tasks.map((t) => t.mod));
  const rowsIn = (mod) => blocks[mod] ? blocks[mod].length : new Set(tasks.filter((t) => t.mod === mod).map((t) => l2(t.id))).size;
  assert.equal(mix.rows, mods.size + [...mods].reduce((n, m) => n + rowsIn(m), 0), "una fila por épica más sus bloques o sub-paquetes");

  // Los cuatro hitos del Charter tienen que encontrar fila en los tres niveles: al partir una
  // épica en bloques, el sub-paquete del que cuelga el hito deja de existir como fila.
  for (const [name, v] of [["l2", vL2], ["mix", mix], ["l3", vL3]])
    assert.equal(v.hitos.length, charterHitos.length, `${name}: hitos sin fila donde dibujarse`);

  // Cada épica con bloques los reparte todos, sin repetir ni dejar paquetes sueltos: si no,
  // los huérfanos reaparecerían como filas X.X y la lámina crecería sin que se note.
  for (const [mod, bs] of Object.entries(blocks)) {
    const own = tasks.filter((t) => t.mod === mod).map((t) => t.id).sort(byNum);
    const inBlocks = bs.flatMap((b) => b.pkgs);
    assert.equal(new Set(inBlocks).size, inBlocks.length, `${mod}: un paquete en dos bloques`);
    assert.deepEqual([...inBlocks].sort(byNum), own, `${mod}: los bloques deben cubrir la épica entera`);
  }

  // El estado del bloque se deriva de sus paquetes, no se escribe a mano.
  const statusOf = (pkgs) => {
    const hs = pkgs.map((id) => tasks.find((t) => t.id === id));
    const done = hs.filter((t) => t.status === "done").reduce((s, t) => s + t.hours, 0);
    const total = hs.reduce((s, t) => s + t.hours, 0);
    return done >= total - 1e-9 ? "done" : done > 0 ? "wip" : "todo";
  };
  for (const [id, status] of mix.blocks) {
    const b = Object.values(blocks).flat().find((x) => x.id === id);
    assert.equal(status, statusOf(b.pkgs), `${id}: estado derivado`);
  }

  // Entra en una diapositiva y ninguna dependencia se pierde al mezclar granularidades.
  assert.ok(mix.rows < vL3.rows, `filas: mix ${mix.rows} < l3 ${vL3.rows}`);
  for (const v of [vL2, mix, vL3]) assert.deepEqual([...v.orphans], [], "toda dependencia apunta a una fila visible");

  // v1 no declara bloques: el nivel existe igual y cae en la vista de sub-paquetes.
  assert.deepEqual(
    evalIn(`state.level = "mix"; loadVersion("v1"); [TASKS.filter((t) => t.block).length, visibleRows().length]`),
    evalIn(`state.level = "l2";  loadVersion("v1"); [0, visibleRows().length]`),
  );
});

// El Gantt sabe recalcular el camino crítico, y con eso ofrece dos lecturas: la del plan
// completo (qué fijó la duración del proyecto) y la de lo que queda desde el corte (qué aprieta
// ahora). La primera tiene que reproducir el camino que publican el PERT y el Cronograma v4;
// si alguna vez dejan de coincidir, es que el dato pegado en la página quedó viejo.
test("Gantt runtime: el CPM de la página reproduce el camino crítico publicado", () => {
  const evalIn = runPage("leadership/gantt.html");
  evalIn(`loadVersion("v4")`);

  const plan = evalIn(`(() => { const c = criticalPath(RAW); return { ids: c.ids.join(","), total: +c.total.toFixed(2) }; })()`);
  const publicado = constant(read("leadership/gantt.html"), "DATA").v4.critical;
  assert.deepEqual(plan.ids.split(",").sort(byNum), [...publicado].sort(byNum), "el CPM no reproduce el camino publicado");
  assert.equal(plan.total, 42.0, "duración del camino crítico de desarrollo (Cronograma v4 §3)");

  // Lo ya cerrado no restringe nada, así que la cadena que manda desde el corte puede ser otra
  // —y lo es: al cierre del S1 pasa a ser moderación, no notificaciones e invitaciones.
  const rest = evalIn(`(() => { const c = criticalPath(RAW.filter((t) => t.status !== "done")); return { ids: c.ids.join(","), total: +c.total.toFixed(2) }; })()`);
  assert.ok(rest.total < plan.total, "lo que queda no puede durar más que el plan entero");
  assert.ok(rest.ids.split(",").every((id) => evalIn(`RAW.find((t) => t.id === "${id}").status`) !== "done"),
    "el camino restante no puede incluir paquetes ya cerrados");

  // El segundo modo SUMA: marca el camino del plan y además el de lo que queda, nunca menos.
  const rojo = (mode, lvl) => evalIn(`CRIT_MODE = "${mode}"; state.level = "${lvl}"; rebuildTasks(); [...criticalSet].sort()`);
  for (const lvl of ["mix", "l2", "l3"]) {
    const soloPlan = [...rojo("plan", lvl)], ambos = [...rojo("restante", lvl)];
    for (const id of soloPlan) assert.ok(ambos.includes(id), `${lvl}: el modo combinado perdió ${id} del camino del plan`);
    assert.ok(ambos.length > soloPlan.length, `${lvl}: el modo combinado debe sumar la cadena restante`);
  }
  assert.deepEqual([...rojo("plan", "l3")].sort(byNum), [...publicado].sort(byNum), "en X.X.X el modo plan marca los paquetes publicados");
  evalIn(`CRIT_MODE = "plan"`);
});

test("WBS runtime: every version renders and v4 has the 118 packages", () => {
  const evalIn = runPage("leadership/wbs.html");
  for (const ver of ["v1", "v2", "v4"]) evalIn(`render("${ver}")`);
  assert.equal(evalIn(`VIEWS.v4.tree.reduce((n, [, s]) => n + s.reduce((m, [, i]) => m + i.length, 0), 0)`), 118);
  assert.equal(evalIn(`VIEWS.v4.newLeaves.size`), 18);
});

// ── Steering ─────────────────────────────────────────────────────────────────
// Cada steering carga datos crudos; la página calcula PV, EV, AC y los índices. Acá se cruza lo
// crudo contra el Cronograma v4, que es la fuente de verdad de avance y calendario.
test("Steering v1: earned hours and progress match the Cronograma v4", () => {
  const { v1: s1 } = constant(read("leadership/steering.html"), "STEERINGS");
  const md = read("docs/planning/Cronograma-y-PERT-v4.md");
  const s1Table = md.split("### S1")[1].split("### S2")[0];
  const done = [...s1Table.matchAll(/^\| ([\d.]+) \| [^|]+ \| ([\d.]+) \|[^|]+\|[^|]+\| \d\d\/\d\d \| (\d\d\/\d\d) \| ✅/gm)];

  assert.equal(s1.weeks.length, 13, "13 semanas de trabajo; la reserva no entra");
  assert.equal(s1.weeks.at(-1), "05/11");
  assert.equal(s1.earned.length, s1.cut);
  assert.equal(s1.actualHours.length, s1.cut);
  s1.earned.forEach((e, i) => {
    const week = done.filter((m) => m[3] === s1.weeks[i]);
    assert.deepEqual(e.pkgs, week.map((m) => m[1]), `semana ${i + 1}: paquetes cerrados`);
    assert.ok(Math.abs(e.h - week.reduce((s, m) => s + Number(m[2]), 0)) < 0.005, `semana ${i + 1}: horas ganadas`);
  });
  const earned = s1.earned.reduce((s, e) => s + e.h, 0);
  assert.ok(Math.abs(earned - s1.avance.done[1]) < 0.005, "horas ganadas = esfuerzo hecho");
  const [dn, dh] = s1.avance.done, [wn, wh] = s1.avance.wip, [tn, th] = s1.avance.todo;
  assert.equal(dn, done.length);
  assert.equal(dn + wn + tn, 76);
  assert.ok(Math.abs(dh + wh + th - s1.devEffort) < 0.005, "el avance suma el esfuerzo de desarrollo");
});

// ── Linear ───────────────────────────────────────────────────────────────────
/** Filas de un CSV del repo. Ninguna de las dos tablas guarda texto libre: no hay comas que escapar. */
function csv(path) {
  const [head, ...lines] = read(path).trim().split("\n");
  const cols = head.split(",");
  return lines.filter(Boolean).map((l) => Object.fromEntries(l.split(",").map((v, i) => [cols[i], v])));
}

test("Linear: el mapa cubre todos los issues y apunta a paquetes que existen", () => {
  const map = csv("docs/planning/linear-wbs-map.csv");
  const issues = csv("docs/planning/linear-issues.csv");
  const wbs = new Set(wbsV4DocIds());

  const pares = new Set();
  for (const r of map) {
    assert.ok(r.wbs_id, `${r.issue}: fila sin paquete — completá el CSV o corré sync-linear.mjs`);
    assert.ok(wbs.has(r.wbs_id), `${r.issue}: ${r.wbs_id} no existe en la WBS v4`);
    assert.ok(["si", "no"].includes(r.fechas), `${r.issue} → ${r.wbs_id}: fechas debe ser si o no`);
    const par = `${r.issue} ${r.wbs_id}`;
    assert.ok(!pares.has(par), `fila duplicada: ${par}`);
    pares.add(par);
  }

  // Lo que evita volver a juntar issues sin mapear: cada issue de Linear tiene paquete.
  const conPaquete = new Set(map.map((r) => r.issue));
  const sinMapear = issues.map((i) => i.issue).filter((id) => !conPaquete.has(id));
  assert.deepEqual(sinMapear, [], `issues sin paquete: ${sinMapear.join(", ")}`);

  const enLinear = new Set(issues.map((i) => i.issue));
  for (const id of conPaquete) assert.ok(enLinear.has(id), `${id} está en el mapa pero ya no en Linear`);
});

test("Gantt: el bloque LINEAR coincide con el mapa y con los paquetes de la v4", () => {
  const html = read("leadership/gantt.html");
  const LINEAR = constant(html, "LINEAR");
  const DATA = constant(html, "DATA");
  const map = csv("docs/planning/linear-wbs-map.csv");
  const cancelados = new Set(
    csv("docs/planning/linear-issues.csv").filter((i) => i.type === "canceled").map((i) => i.issue),
  );

  assert.ok(LINEAR.syncedAt, "el bloque nunca se sincronizó: corré scripts/sync-linear.mjs");
  const wbs = new Set(wbsV4DocIds());
  for (const [pkg, ids] of Object.entries(LINEAR.byPkg)) {
    assert.ok(wbs.has(pkg), `byPkg trae un paquete que no existe en la WBS v4: ${pkg}`);
    for (const id of ids) assert.ok(LINEAR.issues[id], `${pkg}: ${id} no está en issues`);
  }
  // Los cancelados no se muestran (decisión del plan), el resto del mapa sí.
  const esperado = new Set(map.filter((r) => !cancelados.has(r.issue)).map((r) => r.issue));
  assert.deepEqual(new Set(Object.keys(LINEAR.issues)), esperado);
  for (const id of Object.keys(LINEAR.issues)) assert.ok(!cancelados.has(id), `${id} está cancelado y no debería mostrarse`);

  // El panel de una épica junta los paquetes por prefijo: los del Gantt tienen que resolver.
  const v4 = new Set(DATA.v4.tasks.map((t) => t.id));
  const conBarra = Object.keys(LINEAR.byPkg).filter((p) => v4.has(p));
  assert.ok(conBarra.length > 40, `sólo ${conBarra.length} paquetes del Gantt tienen issues`);
});

test("Gantt runtime: el panel de issues abre por épica, paquete y entregable", () => {
  const evalIn = runPage("leadership/gantt.html");
  evalIn('loadVersion("v4")');

  // La épica junta los issues de sus paquetes, sin repetir los que cubren más de uno.
  const epica = evalIn('issuesOf("6").map(i => i.key)');
  const paquete = evalIn('issuesOf("6.2").map(i => i.key)');
  const entregable = evalIn('issuesOf("6.2.3").map(i => i.key)');
  assert.equal(new Set(epica).size, epica.length, "la épica no repite issues");
  assert.ok(epica.length > paquete.length && paquete.length >= entregable.length);
  for (const id of entregable) assert.ok(paquete.includes(id) && epica.includes(id));

  // Abrir, y cerrar con el segundo clic sobre lo mismo.
  const estado = 'openPkg + " · oculto=" + panelEl.hidden';
  assert.equal(evalIn(`openIssues("6.2"); ${estado}`), "6.2 · oculto=false");
  assert.ok(evalIn("panelEl.innerHTML").includes("pts"), "el encabezado muestra los puntos");
  assert.equal(evalIn(`openIssues("6.2"); ${estado}`), "null · oculto=true");

  // Un paquete que el Gantt da por hecho y en Linear tiene tickets abiertos se avisa.
  const aviso = evalIn(`
    (() => {
      const id = Object.keys(LINEAR.byPkg).find(p => {
        const tasks = RAW.filter(t => t.id === p);
        return tasks.length && tasks.every(t => t.status === "done")
          && issuesOf(p).some(i => i.k !== "completed");
      });
      return id ? divergence(id, issuesOf(id)) : "";
    })()`);
  if (aviso) assert.match(aviso, /el Gantt lo da por hecho/);

  // La barra de una épica colapsada abre el panel de la épica, igual que su contador.
  const barra = evalIn(`
    (() => {
      loadVersion("v4");
      const parent = { appendChild: (c) => (parent.last = c) };
      drawEnvelope(parent, "2026-08-06", "2026-10-29", "#10b981", 0, 0.35, "6");
      parent.last.on.click();
      return openPkg + " · " + panelEl.innerHTML.includes("6.0 Gestión de Partidos");
    })()`);
  assert.equal(barra, "6 · true", "la barra colapsada abre los issues de la épica");

  // v1 y v2 tienen otra numeración: ahí el panel no abre.
  assert.equal(evalIn('loadVersion("v1"); openIssues("6.2"); openPkg + " · oculto=" + panelEl.hidden'), "null · oculto=true");
});

// El tablero de actividades clave lo escribe generate-v4.py: un snapshot por jueves de corte.
test("steering: actividades clave consistentes en cada snapshot", () => {
  const hist = constant(read("leadership/steering.html"), "ACTIVIDADES");
  const csv = read("docs/planning/actividades-clave.csv").trim().split(/\r?\n/).length - 1;
  const d = (s) => { const [dd, mm, yy] = s.split("/"); return Date.UTC(2000 + +yy, mm - 1, +dd); };
  for (const [week, rows] of Object.entries(hist)) {
    assert.equal(new Date(week).getUTCDay(), 4, `${week} no es jueves`);
    for (const r of rows) {
      const id = `${week} · ${r.actividad}`;
      assert.ok(["Finaliz.", "En curso", "Pend."].includes(r.estado), id);
      assert.ok(r.avance >= 0 && r.avance <= 100, id);
      if (r.estado === "Finaliz.") assert.equal(r.desvio, (d(r.base) - d(r.real)) / 864e5, `${id}: desvío = base − real`);
      else assert.equal(r.real, "", `${id}: sin fecha real si no terminó`);
      if (r.detalle) {
        const pts = (is) => is.reduce((t, i) => t + i[4], 0), tot = pts(r.detalle);
        assert.equal(tot ? Math.round((100 * pts(r.detalle.filter((i) => i[3] === "completed"))) / tot) : 0, r.calc, `${id}: el desglose da el avance calculado`);
      }
    }
  }
  assert.equal(Object.values(hist).at(-1).length, csv, "el último snapshot tiene todas las actividades del CSV");
});
