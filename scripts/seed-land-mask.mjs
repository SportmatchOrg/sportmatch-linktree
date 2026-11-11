#!/usr/bin/env node
// Máscara de tierra firme para scripts/seed-load.mjs. Ver plan-data.md §5.
//
//   node scripts/seed-land-mask.mjs          descarga el agua de OSM (Overpass, con cache) y escribe
//                                            scripts/seed-land-mask.json
//   node scripts/seed-land-mask.mjs --check  genera los datos por defecto y verifica cada partido contra
//                                            la geometría vectorial de OSM (no contra la grilla)
//
// Se corre a mano y solo cuando cambia la lista de ciudades o su σ. El generador lee el JSON y no se
// conecta a nada. Agua = costa (natural=coastline, incluye el Río de la Plata), natural=water,
// waterway=riverbank y landuse=reservoir. Una celda es tierra si ni ella ni sus 8 vecinas tocan agua, así que
// todo punto aceptado queda a 200 m o más del agua.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { CITIES, MASK_FILE, MASK_CELL_KM, generate, maskHalfKm } from './seed-load.mjs';

const CACHE = new URL('../outputs/seed-load/osm/', import.meta.url);
const KM_PER_DEG = 111;
const MIN_WATER_DIST_KM = 0.1;

const toKm = (city) => {
  const kx = KM_PER_DEG * Math.cos((city.lat * Math.PI) / 180);
  return ({ lat, lon }) => [(lon - city.lng) * kx, (lat - city.lat) * KM_PER_DEG];
};

async function fetchWater(city) {
  const file = new URL(`${city.name.normalize('NFD').replace(/[^\w]+/g, '_')}.json`, CACHE);
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'));
  const pad = maskHalfKm(city) + 1;
  const dLng = pad / (KM_PER_DEG * Math.cos((city.lat * Math.PI) / 180));
  const b = [city.lat - pad / KM_PER_DEG, city.lng - dLng, city.lat + pad / KM_PER_DEG, city.lng + dLng].join(',');
  const q = `[out:json][timeout:300];(way["natural"="coastline"](${b});way["natural"="water"](${b});
    relation["natural"="water"](${b});way["waterway"="riverbank"](${b});relation["waterway"="riverbank"](${b});
    way["landuse"="reservoir"](${b}););out geom;`;
  for (let attempt = 1; ; attempt++) {
    const host = attempt % 2 ? 'overpass-api.de' : 'overpass.kumi.systems'; // mirror si el principal falla
    const res = await fetch(`https://${host}/api/interpreter`, {
      signal: AbortSignal.timeout(330_000),
      method: 'POST', body: new URLSearchParams({ data: q }), headers: { 'User-Agent': 'seed-land-mask/1.0' },
    }).catch((e) => ({ ok: false, status: e.name }));
    if (res.ok) {
      const json = await res.json();
      mkdirSync(CACHE, { recursive: true });
      writeFileSync(file, JSON.stringify(json));
      return json;
    }
    if (attempt === 10) throw new Error(`Overpass ${res.status} en ${city.name}`);
    await new Promise((r) => setTimeout(r, 15_000 * attempt));
  }
}

/** Polígonos de agua (cada uno, lista plana de segmentos [ax,ay,bx,by,…] en km) y segmentos de costa. */
function waterGeometry(city, osm) {
  const km = toKm(city);
  const segs = (pts) => {
    const out = [];
    for (let i = 1; i < pts.length; i++) out.push(...km(pts[i - 1]), ...km(pts[i]));
    return out;
  };
  const polygons = [];
  const coast = [];
  const mainland = []; // costa abierta (sin lazos cerrados): es la que decide de qué lado está el mar
  const islands = []; // lazos cerrados de costa: islas (y alguno mal cargado tierra adentro)
  const ends = new Map(); // extremos de las ways de costa: los que aparecen una sola vez son abiertos
  for (const el of osm.elements) {
    if (el.type === 'way' && el.tags?.natural === 'coastline') {
      const g = el.geometry;
      coast.push(...segs(g));
      if (g[0].lat === g.at(-1).lat && g[0].lon === g.at(-1).lon) { islands.push(segs(g)); continue; }
      mainland.push(...segs(g));
      for (const p of [el.geometry[0], el.geometry.at(-1)]) ends.set(km(p).join(), (ends.get(km(p).join()) ?? 0) + 1);
    }
    else if (el.type === 'way') {
      const g = el.geometry;
      if (g.length > 3 && g[0].lat === g.at(-1).lat && g[0].lon === g.at(-1).lon) polygons.push(segs(g));
    } else if (el.type === 'relation') {
      // par-impar sobre todos los segmentos outer + inner: no hace falta armar los anillos
      const s = el.members.filter((m) => m.type === 'way' && m.geometry && ['outer', 'inner', ''].includes(m.role))
        .flatMap((m) => segs(m.geometry));
      if (s.length) polygons.push(s);
    }
  }
  const openEnds = new Set([...ends].filter(([, k]) => k === 1).map(([p]) => p));
  return { polygons, coast, mainland, islands, openEnds };
}

function insidePolygon(s, px, py) {
  let inside = false;
  for (let i = 0; i < s.length; i += 4) {
    const [ax, ay, bx, by] = [s[i], s[i + 1], s[i + 2], s[i + 3]];
    if ((ay > py) !== (by > py) && px < ax + ((py - ay) * (bx - ax)) / (by - ay)) inside = !inside;
  }
  return inside;
}

/** Lado de la costa según el segmento más cercano: OSM dibuja la costa con la tierra a la izquierda. */
function coastSide(s, px, py, openEnds) {
  let best = Infinity, cross = 0, bestPerp = -1, nearest = '';
  for (let i = 0; i < s.length; i += 4) {
    const [ax, ay, bx, by] = [s[i], s[i + 1], s[i + 2], s[i + 3]];
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy || 1e-12;
    const t = Math.min(1, Math.max(0, ((px - ax) * dx + (py - ay) * dy) / len2));
    const qx = ax + t * dx - px, qy = ay + t * dy - py, d2 = qx * qx + qy * qy;
    const c = dx * (py - ay) - dy * (px - ax), perp = Math.abs(c) / Math.sqrt(len2);
    // empate en un vértice compartido: decide el segmento respecto del cual el punto está más "afuera"
    if (d2 < best - 1e-12 || (d2 <= best + 1e-12 && perp > bestPerp)) {
      [best, cross, bestPerp] = [d2, c, perp];
      nearest = t === 0 ? [ax, ay].join() : t === 1 ? [bx, by].join() : '';
    }
  }
  // si lo más cercano es un extremo abierto (la costa cortada por el bbox), el signo no dice nada
  return { water: cross < 0, dist: Math.sqrt(best), unknown: openEnds.has(nearest) };
}

function minSegDist(s, px, py) {
  let best = Infinity;
  for (let i = 0; i < s.length; i += 4) {
    const [ax, ay, bx, by] = [s[i], s[i + 1], s[i + 2], s[i + 3]];
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy || 1e-12;
    const t = Math.min(1, Math.max(0, ((px - ax) * dx + (py - ay) * dy) / len2));
    best = Math.min(best, Math.hypot(ax + t * dx - px, ay + t * dy - py));
  }
  return best;
}

/**
 * Marca el mar en la grilla. La costa (abierta, cortada por el bbox) hace de barrera; cada región conexa
 * se decide por votos: un punto a 300 m a la derecha de cada segmento vota agua, uno a la izquierda, tierra.
 * El "segmento más cercano" no sirve acá: cerca de los extremos abiertos de la costa da cualquier signo.
 */
/** Marca en `grid` cada celda por la que pasa algún segmento (lista plana [ax,ay,bx,by,…] en km). */
function traceSegments(s, grid, n, half) {
  const C = MASK_CELL_KM;
  for (let i = 0; i < s.length; i += 4) {
    const [ax, ay, bx, by] = [s[i], s[i + 1], s[i + 2], s[i + 3]];
    const steps = Math.ceil(Math.hypot(bx - ax, by - ay) / (C / 4)) || 1;
    let prev;
    for (let k = 0; k <= steps; k++) {
      const r = Math.floor((ay + ((by - ay) * k) / steps + half) / C);
      const c = Math.floor((ax + ((bx - ax) * k) / steps + half) / C);
      if (r >= 0 && c >= 0 && r < n && c < n) grid[r * n + c] = 1;
      // sin pasos en diagonal: si no, el relleno 4-conexo se filtra entre dos celdas de costa
      if (prev && prev[0] !== r && prev[1] !== c && prev[0] >= 0 && prev[0] < n && c >= 0 && c < n) grid[prev[0] * n + c] = 1;
      prev = [r, c];
    }
  }
}

function markSea(water, n, half, coast) {
  const C = MASK_CELL_KM;
  const cellOf = (x, y) => [Math.floor((y + half) / C), Math.floor((x + half) / C)];
  const inGrid = (r, c) => r >= 0 && c >= 0 && r < n && c < n;
  const barrier = new Uint8Array(n * n);
  traceSegments(coast, barrier, n, half);
  const comp = new Int32Array(n * n).fill(-1);
  let comps = 0;
  for (let start = 0; start < n * n; start++) {
    if (barrier[start] || comp[start] >= 0) continue;
    const stack = [start];
    comp[start] = comps;
    while (stack.length) {
      const i = stack.pop(), r = Math.floor(i / n), c = i % n;
      for (const [rr, cc] of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]) {
        const j = rr * n + cc;
        if (inGrid(rr, cc) && !barrier[j] && comp[j] < 0) { comp[j] = comps; stack.push(j); }
      }
    }
    comps++;
  }
  const votes = new Float64Array(comps);
  for (let i = 0; i < coast.length; i += 4) {
    const [ax, ay, bx, by] = [coast[i], coast[i + 1], coast[i + 2], coast[i + 3]];
    const len = Math.hypot(bx - ax, by - ay);
    if (!len) continue;
    const [mx, my, nx, ny] = [(ax + bx) / 2, (ay + by) / 2, -(by - ay) / len, (bx - ax) / len]; // normal izquierda
    for (const s of [1, -1]) {
      const [r, c] = cellOf(mx + s * nx * 1.5 * C, my + s * ny * 1.5 * C);
      if (inGrid(r, c) && !barrier[r * n + c]) votes[comp[r * n + c]] += s * len;
    }
  }
  for (let i = 0; i < n * n; i++) if (barrier[i] || votes[comp[i]] < 0) water[i] = 1;
}

function buildMask(city, { polygons, coast }) {
  const half = maskHalfKm(city), n = Math.round((2 * half) / MASK_CELL_KM);
  const center = (i) => -half + (i + 0.5) * MASK_CELL_KM;
  const water = new Uint8Array(n * n);
  for (let row = 0; row < n; row++) {
    const y = center(row);
    for (const s of polygons) {
      const xs = [];
      for (let i = 0; i < s.length; i += 4) {
        const [ax, ay, bx, by] = [s[i], s[i + 1], s[i + 2], s[i + 3]];
        if ((ay > y) !== (by > y)) xs.push(ax + ((y - ay) * (bx - ax)) / (by - ay));
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const from = Math.max(0, Math.ceil((xs[k] + half) / MASK_CELL_KM - 0.5));
        const to = Math.min(n - 1, Math.floor((xs[k + 1] + half) / MASK_CELL_KM - 0.5));
        for (let col = from; col <= to; col++) water[row * n + col] = 1;
      }
    }
  }
  // los bordes también: un estanque o un canal más chico que la celda no contiene ningún centro
  for (const s of polygons) traceSegments(s, water, n, half);
  if (coast.length) markSea(water, n, half, coast);
  const bits = Buffer.alloc(Math.ceil((n * n) / 8));
  let land = 0;
  for (let row = 0; row < n; row++) for (let col = 0; col < n; col++) {
    let ok = true;
    for (let dr = -1; dr <= 1 && ok; dr++) for (let dc = -1; dc <= 1 && ok; dc++) {
      const r = row + dr, c = col + dc;
      if (r >= 0 && c >= 0 && r < n && c < n && water[r * n + c]) ok = false;
    }
    if (ok) { bits[(row * n + col) >> 3] |= 1 << ((row * n + col) & 7); land++; }
  }
  return { half, n, landPct: +((100 * land) / (n * n)).toFixed(1), land: bits.toString('base64') };
}

async function build() {
  const cities = {};
  for (const city of CITIES) {
    const osm = await fetchWater(city);
    const geo = waterGeometry(city, osm);
    cities[city.name] = buildMask(city, geo);
    console.log(`${city.name.padEnd(24)} ${String(geo.polygons.length).padStart(4)} polígonos  ${
      String(geo.coast.length / 4).padStart(6)} seg. costa  ${cities[city.name].landPct}% tierra`);
  }
  const out = { cellKm: MASK_CELL_KM, source: 'OpenStreetMap vía Overpass', builtAt: new Date().toISOString().slice(0, 10), cities };
  writeFileSync(MASK_FILE, JSON.stringify(out));
  console.log(`\n${MASK_FILE.pathname} (${(readFileSync(MASK_FILE).length / 1024).toFixed(0)} KB)`);
}

async function check() {
  const data = generate();
  const byCity = Map.groupBy(data.matches, (m) => m.cityName);
  let bad = 0, unknown = 0, nearest = Infinity;
  for (const city of CITIES) {
    const { polygons, coast, mainland, islands, openEnds } = waterGeometry(city, await fetchWater(city));
    const kx = KM_PER_DEG * Math.cos((city.lat * Math.PI) / 180);
    for (const m of byCity.get(city.name) ?? []) {
      const x = (m.longitude - city.lng) * kx, y = (m.latitude - city.lat) * KM_PER_DEG;
      const c = mainland.length ? coastSide(mainland, x, y, openEnds) : { water: false, unknown: false };
      if (islands.some((s) => insidePolygon(s, x, y))) c.water = false;
      if (c.unknown) unknown++;
      const dist = Math.min(coast.length ? minSegDist(coast, x, y) : Infinity, ...polygons.map((s) => minSegDist(s, x, y)));
      nearest = Math.min(nearest, dist);
      if ((c.water && !c.unknown) || polygons.some((s) => insidePolygon(s, x, y)) || dist < MIN_WATER_DIST_KM) {
        bad++;
        console.log(`AGUA ${city.name} ${m.latitude},${m.longitude} (a ${(dist * 1000).toFixed(0)} m del borde)`);
      }
    }
  }
  console.log(`${data.matches.length} partidos, ${bad} en agua o a menos de ${MIN_WATER_DIST_KM * 1000} m. ` +
    `Distancia mínima al agua: ${(nearest * 1000).toFixed(0)} m. Lado de la costa indeterminado (lejos de ella): ${unknown}.`);
  if (bad) process.exitCode = 1;
}

await (process.argv.includes('--check') ? check() : build());
