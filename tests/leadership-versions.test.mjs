// Guards the v1/v2 merge of the leadership views: the merged pages must carry
// exactly the data the two separate pages carried before, and the level-2
// aggregation each view does at runtime must stay consistent between versions.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

// The baseline is the commit *before* the v1/v2 merge (879f0fe), because that
// merge is what deleted the -v2 pages and rewrote the survivors. Reading the
// baseline from HEAD instead would compare the merged pages against themselves,
// which is why these two checks never passed once the merge landed.
const BASELINE = "f46d415f52d99f9e781a46f9e35369b8ff697600";

const fromBaseline = (p) => {
  try {
    return execFileSync("git", ["show", `${BASELINE}:${p}`], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch {
    assert.fail(`cannot read ${p} at baseline ${BASELINE.slice(0, 7)} - was the history rewritten?`);
  }
};

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

test("PERT: merged page keeps both versions' data verbatim", () => {
  const DATA = constant(read("leadership/pert.html"), "DATA");

  for (const [ver, legacy] of [["v1", "leadership/pert.html"], ["v2", "leadership/pert-v2.html"]]) {
    const old = fromBaseline(legacy);
    const oldTasks = constant(old, "TASKS3");
    const oldDeps = constant(old, "DEPS3");
    const oldGroups = constant(old, "GROUP_NAMES");

    assert.deepEqual(Object.keys(DATA[ver].tasks), Object.keys(oldTasks), `${ver} task ids`);
    assert.deepEqual(DATA[ver].tasks, oldTasks, `${ver} task values`);
    assert.deepEqual(DATA[ver].deps, oldDeps, `${ver} deps`);
    assert.deepEqual(DATA[ver].groups, oldGroups, `${ver} group names`);
  }
});

test("PERT: every dependency and every group name resolves", () => {
  const DATA = constant(read("leadership/pert.html"), "DATA");

  for (const ver of ["v1", "v2"]) {
    const { tasks, deps, groups } = DATA[ver];
    for (const [succ, preds] of Object.entries(deps)) {
      assert.ok(tasks[succ], `${ver}: dep declared for unknown task ${succ}`);
      for (const p of preds) assert.ok(tasks[p], `${ver}: ${succ} depends on unknown task ${p}`);
    }
    // Aggregation renders one node per level-2 group; each needs a readable name.
    for (const g of new Set(Object.keys(tasks).map(l2))) {
      assert.ok(groups[g], `${ver}: level-2 group ${g} has no name`);
    }
  }
});

test("PERT: derived toolbar stats are computable and v2 is the larger scope", () => {
  const DATA = constant(read("leadership/pert.html"), "DATA");
  const stats = (ver) => {
    const t = Object.values(DATA[ver].tasks);
    return {
      groups: new Set(Object.keys(DATA[ver].tasks).map(l2)).size,
      effort: t.reduce((s, x) => s + x.dur, 0),
      finish: Math.max(...t.map((x) => x.ef)),
    };
  };
  const v1 = stats("v1"), v2 = stats("v2");
  for (const s of [v1, v2]) {
    assert.ok(s.groups > 0 && Number.isFinite(s.effort) && Number.isFinite(s.finish));
  }
  assert.ok(v2.groups > v1.groups, "v2 should add level-2 groups");
  assert.ok(v2.effort > v1.effort, "v2 should add effort");
});

// Scope deliberately cut from the merged pages after the split-file versions were
// written. Listed here so the "verbatim" check below stays strict: anything else
// that disappears is a mistake, not a decision.
const DROPPED = { v1: [], v2: ["12.2.1", "12.2.2", "12.2.3"] };

// Tareas del bloque ya trabajado cuya fecha de Linear venía colapsada al día de
// cierre (7.7 h en un solo día, etc.). Se estiró sólo el inicio hacia atrás, así
// el fin no se mueve y ningún sucesor se ve afectado. { id: [inicio viejo, nuevo] }
const REDATED = {
  v1: {},
  v2: {
    "3.1.2":  ["2026-08-15", "2026-08-13"],
    "3.2.3":  ["2026-08-21", "2026-08-19"],
    "9.1.1":  ["2026-08-28", "2026-08-24"],
    "10.2.1": ["2026-08-27", "2026-08-26"],
  },
};

test("Gantt: merged page keeps both versions' tasks verbatim, minus declared removals", () => {
  const DATA = constant(read("leadership/gantt.html"), "DATA");

  for (const [ver, legacy] of [["v1", "leadership/gantt.html"], ["v2", "leadership/gantt-v2.html"]]) {
    const dropped = new Set(DROPPED[ver]);
    const oldTasks = constant(fromBaseline(legacy), "TASKS_L3", "[", "];").filter((t) => !dropped.has(t.id));

    assert.equal(DATA[ver].tasks.length, oldTasks.length, `${ver} task count`);
    assert.deepEqual(
      DATA[ver].tasks.map((t) => t.id),
      oldTasks.map((t) => t.id),
      `${ver} task ids`,
    );
    for (let i = 0; i < oldTasks.length; i++) {
      const a = DATA[ver].tasks[i], b = oldTasks[i];
      const redate = REDATED[ver][b.id];
      if (redate) {
        assert.equal(b.start, redate[0], `${ver} ${b.id}: declared old start no longer matches`);
        assert.equal(a.start, redate[1], `${ver} ${b.id}: declared new start not applied`);
      }
      assert.deepEqual(
        { id: a.id, mod: a.mod, name: a.name, start: redate ? redate[0] : a.start, end: a.end, hours: a.hours, deps: a.deps },
        { id: b.id, mod: b.mod, name: b.name, start: b.start, end: b.end, hours: b.hours, deps: b.deps },
        `${ver} task ${b.id}`,
      );
    }

    // A removal must be complete: nothing may still depend on what was cut.
    for (const t of DATA[ver].tasks) {
      for (const d of t.deps) assert.ok(!dropped.has(d), `${ver}: ${t.id} still depends on removed ${d}`);
    }
  }
});

test("Gantt: the v2 headline numbers match the v2 data", () => {
  const DATA = constant(read("leadership/gantt.html"), "DATA");
  const tasks = DATA.v2.tasks;
  const hours = tasks.reduce((s, t) => s + t.hours, 0);

  // label and sub are hand-written prose; keep them honest about count and effort.
  // sub is optional — a version may carry no subtitle — but if it is there it must be right.
  assert.match(DATA.v2.label, new RegExp(`\\b${tasks.length} tareas\\b`), DATA.v2.label);
  if (DATA.v2.sub) {
    assert.match(DATA.v2.sub, new RegExp(`\\b${tasks.length} tareas\\b`), DATA.v2.sub);
    assert.match(DATA.v2.sub, new RegExp(`\\b${Math.round(hours)} h de desarrollo\\b`), DATA.v2.sub);
  }
});

test("Gantt: every module has a colour and every group a name", () => {
  const DATA = constant(read("leadership/gantt.html"), "DATA");

  for (const ver of ["v1", "v2"]) {
    const { tasks, colors, names } = DATA[ver];
    for (const t of tasks) {
      assert.ok(colors[t.mod], `${ver}: no colour for module ${t.mod}`);
      assert.ok(names[l2(t.id)], `${ver}: no name for group ${l2(t.id)}`);
    }
    // Rows are grouped by module, so a colour with no task would render an empty épica.
    const used = new Set(tasks.map((t) => t.mod));
    for (const mod of Object.keys(colors)) assert.ok(used.has(mod), `${ver}: unused module colour ${mod}`);
  }
});

test("Gantt: bar geometry is valid — no task ends before it starts", () => {
  const DATA = constant(read("leadership/gantt.html"), "DATA");
  for (const ver of ["v1", "v2"]) {
    for (const t of DATA[ver].tasks) {
      assert.ok(Date.parse(t.end) >= Date.parse(t.start), `${ver}: ${t.id} ends before it starts`);
      assert.ok(Date.parse(t.start) >= Date.parse("2026-07-30"), `${ver}: ${t.id} starts before the range`);
      assert.ok(Date.parse(t.end) <= Date.parse(DATA[ver].rangeEnd), `${ver}: ${t.id} ends past the range`);
    }
  }
});

test("WBS: v2 is v1 plus the declared additions, and adds nothing twice", () => {
  const html = read("leadership/wbs.html");
  const V1 = constant(html, "WBS_V1", "[", "];");
  const ADD = constant(html, "V2_ADD", "[", "];");

  // Same shape as buildV2() in the page.
  const v2 = V1.map(([pkg, subs]) => [pkg, subs.map(([s, items]) => [s, items.slice()])]);
  const added = new Set();
  for (const [pkgName, subName, items] of ADD) {
    let pkg = v2.find((p) => p[0] === pkgName);
    if (!pkg) v2.push((pkg = [pkgName, []]));
    let sub = pkg[1].find((s) => s[0] === subName);
    if (!sub) pkg[1].push((sub = [subName, []]));
    for (const it of items) {
      assert.ok(!added.has(it), `duplicate addition: ${it}`);
      added.add(it);
      sub[1].push(it);
    }
  }

  const leaves = (tree) => tree.flatMap(([, subs]) => subs.flatMap(([, items]) => items));
  const l1 = leaves(V1), l2set = leaves(v2);

  // v2 is a strict superset of v1, with no leaf lost or reordered.
  assert.deepEqual(l2set.filter((x) => !added.has(x)).sort(), [...l1].sort(), "v1 leaves must survive in v2");
  assert.equal(l2set.length, l1.length + added.size, "leaf count");
  assert.equal(new Set(l2set).size, l2set.length, "no duplicate leaves in v2");

  // Every addition is numbered under the sub-package it is filed in (6.5.1 under "6.5 ...").
  for (const [, subName, items] of ADD) {
    const prefix = subName.split(" ")[0];
    for (const it of items) {
      assert.ok(it.startsWith(prefix + "."), `${it} does not belong under ${subName}`);
    }
  }
});

test("WBS: the new packages match what the PERT and Gantt v2 data schedule", () => {
  const html = read("leadership/wbs.html");
  const ADD = constant(html, "V2_ADD", "[", "];");
  const wbsNew = new Set(ADD.flatMap(([, , items]) => items.map((i) => i.split(" ")[0])));

  const pert = constant(read("leadership/pert.html"), "DATA");
  const gantt = constant(read("leadership/gantt.html"), "DATA");

  const pertNew = Object.keys(pert.v2.tasks).filter((id) => !pert.v1.tasks[id]);
  const v1GanttIds = new Set(gantt.v1.tasks.map((t) => t.id));
  const ganttNew = gantt.v2.tasks.map((t) => t.id).filter((id) => !v1GanttIds.has(id));

  // Anything the schedules added in v2 must be described in the WBS v2 too.
  for (const id of [...pertNew, ...ganttNew]) {
    assert.ok(wbsNew.has(id), `${id} is new in a v2 schedule but missing from WBS V2_ADD`);
  }
});

// El bloque ya trabajado de v2 trae fechas reales de Linear pegadas sobre un plan
// generado, y en cinco casos la realidad contradice el grafo de dependencias (una
// tarea cerrada que depende de otra sin empezar). No se corrige acá: es una
// decisión de planificación. Se fija la lista para que no crezca en silencio.
const KNOWN_DEP_VIOLATIONS = ["4.1.3<4.1.2", "4.2.1<4.1.2", "5.2.1<5.1.2", "6.3.2<6.2.3", "7.2.1<7.1.1"];

test("Gantt: no new dependency violations creep into the schedule", () => {
  const DATA = constant(read("leadership/gantt.html"), "DATA");
  const day = (d) => Date.parse(d + "T00:00:00Z");

  for (const ver of ["v1", "v2"]) {
    const by = Object.fromEntries(DATA[ver].tasks.map((t) => [t.id, t]));
    const found = [];
    for (const t of DATA[ver].tasks) {
      for (const d of t.deps) {
        if (by[d] && day(t.start) < day(by[d].end)) found.push(`${t.id}<${d}`);
      }
    }
    const expected = ver === "v2" ? KNOWN_DEP_VIOLATIONS : [];
    assert.deepEqual(found.sort(), [...expected].sort(), `${ver}: dependency violations changed`);
  }
});
