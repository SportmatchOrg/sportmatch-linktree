import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const page = await readFile(new URL('../leadership/steering.html', import.meta.url), 'utf8');
const script = page.match(/<script>([\s\S]*?)<\/script>/)[1];
// Sólo los datos y el cálculo: lo que sigue a "/* ---- Formato" toca el DOM.
const { STEERINGS, compute } = new Function(script.split('/* ---- Formato')[0] + 'return { STEERINGS, compute };')();

const near = (a, b) => assert.ok(Math.abs(a - b) < 0.01, `${a} ≠ ${b}`);

test('steering v1 keeps the numbers presented on 17/09', () => {
  const m = compute(STEERINGS.v1);
  near(m.bac, 2559.42);
  near(m.PV, 1213.14);
  near(m.EV, 1428.57);
  near(m.AC, 1213.14);
});

test('steering v2 matches outputs/Steering 2.xlsx (leads as level of effort)', () => {
  const m = compute(STEERINGS.v2);
  near(m.bac, 6719.42);
  near(m.bacDev, 2559.42);
  near(m.PV, 5206.28);
  near(m.EV, 5373.63);
  near(m.AC, 5206.28);
  near(m.eac, 6510.16);
  const { done, wip, todo } = STEERINGS.v2.avance;
  near(done[1] + wip[1] + todo[1], STEERINGS.v2.devEffort);
  near(m.evH.at(-1), done[1]);
});
