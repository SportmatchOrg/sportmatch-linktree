import assert from 'node:assert/strict';
import test from 'node:test';

import { generate, toSql } from '../scripts/seed-load.mjs';

const HOUR = 3_600_000;
const now = Date.UTC(2026, 9, 31, 15);
const d = generate({ seed: 7, users: 60, matches: 300, now });

test('es determinista con la misma semilla', () => {
  const again = generate({ seed: 7, users: 60, matches: 300, now });
  assert.deepEqual(again.ratings.map((r) => r.id), d.ratings.map((r) => r.id));
});

test('plantel: nunca supera el cupo y el organizador no es participante', () => {
  for (const m of d.matches) {
    const players = d.participants.filter((p) => p.matchId === m.id);
    assert.ok(players.length <= m.capacity, `cupo excedido en ${m.id}`);
    assert.ok(!players.some((p) => p.userId === m.organizerId));
    assert.ok(m.capacity >= 2 && m.capacity <= 30);
  }
});

test('cada participante tiene su JoinRequest ACCEPTED y no hay solicitudes duplicadas', () => {
  const accepted = new Set(d.joinRequests.filter((r) => r.status === 'ACCEPTED').map((r) => `${r.matchId}:${r.userId}`));
  for (const p of d.participants) assert.ok(accepted.has(`${p.matchId}:${p.userId}`));
  const keys = d.joinRequests.map((r) => `${r.matchId}:${r.userId}`);
  assert.equal(new Set(keys).size, keys.length);
});

test('calificaciones y faltas: solo en partidos jugados y dentro de las 48 h', () => {
  const byId = new Map(d.matches.map((m) => [m.id, m]));
  for (const r of [...d.ratings, ...d.noShows]) {
    const m = byId.get(r.matchId);
    assert.equal(m.status, 'ACTIVE');
    assert.ok(r.createdAt > m.date && r.createdAt <= m.date + 48 * HOUR && r.createdAt <= now);
  }
  for (const r of d.ratings) assert.ok(r.raterId !== r.ratedUserId && r.score >= 1 && r.score <= 5);
});

test('quien faltó no da ni recibe calificaciones en ese partido', () => {
  const absent = new Set(d.noShows.map((n) => `${n.matchId}:${n.reportedUserId}`));
  for (const r of d.ratings) {
    assert.ok(!absent.has(`${r.matchId}:${r.raterId}`));
    assert.ok(!absent.has(`${r.matchId}:${r.ratedUserId}`));
  }
});

test('coordenadas dentro de Argentina y nunca nulas', () => {
  for (const m of d.matches) {
    assert.ok(m.latitude > -55.2 && m.latitude < -21.7, `lat ${m.latitude}`);
    assert.ok(m.longitude > -73.6 && m.longitude < -53.5, `lng ${m.longitude}`);
  }
});

test('usuarios: emails únicos con dominios reales, marca seed_ y alta antes de su primera aparición', () => {
  const emails = d.users.map((u) => u.email);
  assert.equal(new Set(emails).size, emails.length);
  for (const u of d.users) {
    assert.match(u.email, /^[a-z.]+\d{2,4}@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com\.ar)$/);
    assert.match(u.firebaseUid, /^seed_\d{6}$/);
    assert.ok(u.createdAt < u.onboardedAt && u.onboardedAt < u.firstSeen);
    assert.ok(u.createdAt >= now - 181 * 24 * HOUR);
  }
});

test('los partidos futuros quedan en el futuro y las bajas tarde a menos de 2 h', () => {
  const byId = new Map(d.matches.map((m) => [m.id, m]));
  for (const l of d.lateWithdrawals) {
    const m = byId.get(l.matchId);
    assert.ok(l.createdAt < m.date && m.date - l.createdAt <= 2 * HOUR && l.createdAt <= now);
  }
  for (const m of d.matches) assert.ok(m.createdAt <= now);
});

test('el SQL trae los guards antes del BEGIN', () => {
  const sql = toSql(d, { seed: 7, now });
  const begin = sql.indexOf('BEGIN;');
  for (const guard of ['expected_db', 'AS clean', 'AS sports_ok']) {
    assert.ok(sql.indexOf(guard) > -1 && sql.indexOf(guard) < begin, guard);
  }
});
