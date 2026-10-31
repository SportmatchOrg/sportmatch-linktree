// Bench de solo lectura de endpoints de SportMatch contra la base del seed (ver issues/audit-rendimiento.md §2).
// Se copia a back/test/ de una copia descartable del back (git archive origin/dev); no se commitea en la app.
import request from 'supertest';
import { createTestApp, closeTestApp, setAuthUser, type TestContext } from './setup-e2e';
import { UsersService } from '../src/users/users.service';
import { MatchesRepository } from '../src/matches/matches.repository';

const RUNS = 5;
let ctx: TestContext;

const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

async function bench(label: string, path: string) {
  const times: number[] = [];
  let bytes = 0;
  let items = '';
  let status = 0;
  for (let i = 0; i < RUNS + 1; i++) {
    const t0 = performance.now();
    const res = await request(ctx.app.getHttpServer()).get(path);
    const ms = performance.now() - t0;
    if (i > 0) times.push(ms);
    status = res.status;
    bytes = Buffer.byteLength(res.text ?? '');
    const b = res.body;
    items = Array.isArray(b)
      ? String(b.length)
      : b && typeof b === 'object'
        ? Object.entries(b)
            .filter(([, v]) => Array.isArray(v))
            .map(([k, v]) => `${k}=${(v as unknown[]).length}`)
            .join(' ')
        : '';
  }
  console.log(
    `BENCH | ${label} | ${path} | ${status} | p50=${median(times).toFixed(0)}ms max=${Math.max(...times).toFixed(0)}ms | ${(bytes / 1024).toFixed(0)} KB | ${items}`,
  );
}

async function timeIt(label: string, fn: () => Promise<unknown>) {
  const times: number[] = [];
  let size = '';
  for (let i = 0; i < RUNS + 1; i++) {
    const t0 = performance.now();
    const r = await fn();
    if (i > 0) times.push(performance.now() - t0);
    size = Array.isArray(r) ? `${r.length} filas` : r instanceof Map ? `${r.size} claves` : '';
  }
  console.log(`BENCH | ${label} | (interno) | - | p50=${median(times).toFixed(0)}ms | | ${size}`);
}

beforeAll(async () => {
  ctx = await createTestApp();
});
afterAll(() => closeTestApp(ctx));

it('bench', async () => {
  const p = ctx.prisma;
  const [viewer] = await p.$queryRaw<{ id: string; firebaseUid: string; email: string; name: string }[]>`
    SELECT id, "firebaseUid", email, name FROM users WHERE city = 'CABA' AND "firebaseUid" LIKE 'seed\_%' ORDER BY "firebaseUid" LIMIT 1`;
  const [top] = await p.$queryRaw<{ id: string; firebaseUid: string; email: string; name: string; n: bigint }[]>`
    SELECT u.id, u."firebaseUid", u.email, u.name, count(*) n FROM matches m JOIN users u ON u.id = m."organizerId" GROUP BY u.id ORDER BY n DESC LIMIT 1`;
  const sports = await p.sport.findMany({ select: { id: true, name: true } });
  const futbol = sports.find((s) => s.name === 'FUTBOL')!.id;
  console.log(`viewer=${viewer.id} top=${top.id} (organiza ${top.n})`);

  setAuthUser({ uid: viewer.firebaseUid, email: viewer.email, name: viewer.name } as never);
  await bench('Descubrir / Mapa sin filtros', '/matches');
  await bench('Mapa filtro Cerca (CABA, 5 km)', '/matches?lat=-34.6037&lng=-58.3816');
  await bench('Mapa Deporte+Nivel', `/matches?sportId=${futbol}&level=INTERMEDIATE`);
  await bench('Buscar usuario', '/users/search?q=mar');
  await bench('GET /users (sin paginar)', '/users');
  await bench('Perfil ajeno top organizador', `/users/${top.id}`);
  await bench('Partidos jugados del top organizador', `/matches/played-by/${top.id}`);
  await bench('/users/me (viewer)', '/users/me');
  await bench('Mis partidos (viewer)', '/matches/mine');

  setAuthUser({ uid: top.firebaseUid, email: top.email, name: top.name } as never);
  await bench('/users/me (top organizador)', '/users/me');
  await bench('Mis partidos (top organizador)', '/matches/mine');

  // Desglose de /matches: cuánto es la query y cuánto el puntaje de organizadores.
  const repo = ctx.app.get(MatchesRepository);
  const users = ctx.app.get(UsersService);
  const upcoming = await repo.findUpcoming(viewer.id, {} as never);
  const organizerIds = [...new Set(upcoming.map((m) => m.organizerId))];
  await timeIt('  findUpcoming (Prisma, con include)', () => repo.findUpcoming(viewer.id, {} as never));
  await timeIt(`  getScores(${organizerIds.length} organizadores)`, () => users.getScores(organizerIds));
  const [{ n }] = await p.$queryRaw<{ n: bigint }[]>`SELECT count(*) n FROM ratings WHERE "ratedUserId" = ANY(${organizerIds})`;
  console.log(`BENCH | calificaciones recibidas por esos organizadores: ${n}`);
}, 600_000);
