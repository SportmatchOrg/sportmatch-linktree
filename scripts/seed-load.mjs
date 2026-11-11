#!/usr/bin/env node
// Carga masiva de datos sintéticos para SportMatch. Ver plan-data.md.
//
//   node scripts/seed-load.mjs [--seed 42] [--users 2000] [--matches 10000]
//
// Solo genera outputs/seed-load/load.sql e imprime conteos (dry run). No se conecta a ninguna base.
// REGLA DURA: no toca el repo sportmatch. El schema está copiado a mano de origin/dev.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';

/** Última migración de sportmatch (origin/dev) contra la que se escribió este script. */
export const SCHEMA_MIGRATION = '20261101144210_add_moderation_actions';

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const AR_OFFSET = 3 * HOUR; // Argentina = UTC-3, sin horario de verano

// [nombre, lat, lng, peso (miles de hab.), localidades que se muestran en User.city]
export const CITIES = [
  ['CABA', -34.6037, -58.3816, 3100, ['CABA']],
  ['AMBA Norte', -34.4708, -58.5286, 1500, ['San Isidro', 'Vicente López', 'Tigre', 'San Fernando', 'Pilar']],
  ['AMBA Oeste', -34.6534, -58.6198, 2000, ['Morón', 'Ituzaingó', 'Castelar', 'Haedo', 'Merlo', 'Ramos Mejía']],
  ['AMBA Sur', -34.7609, -58.4063, 2000, ['Lomas de Zamora', 'Banfield', 'Lanús', 'Quilmes', 'Adrogué', 'Avellaneda']],
  ['La Plata', -34.9214, -57.9545, 900],
  ['Córdoba', -31.4201, -64.1888, 1600],
  ['Rosario', -32.9442, -60.6505, 1350],
  ['Mendoza', -32.8895, -68.8458, 1100],
  ['San Miguel de Tucumán', -26.8083, -65.2176, 900],
  ['Mar del Plata', -38.0055, -57.5426, 650],
  ['Salta', -24.7821, -65.4232, 620],
  ['Santa Fe', -31.6333, -60.7, 530],
  ['San Juan', -31.5375, -68.5364, 500],
  ['Resistencia', -27.4606, -58.9839, 400],
  ['Santiago del Estero', -27.7951, -64.2615, 400],
  ['Neuquén', -38.9516, -68.0591, 380],
  ['Corrientes', -27.4692, -58.8306, 380],
  ['Posadas', -27.3671, -55.8961, 360],
  ['San Salvador de Jujuy', -24.1858, -65.2995, 330],
  ['Bahía Blanca', -38.7196, -62.2724, 300],
  ['Paraná', -31.7333, -60.5297, 270],
  ['Formosa', -26.1775, -58.1781, 240],
  ['San Luis', -33.3017, -66.3378, 200],
  ['La Rioja', -29.4131, -66.8558, 200],
  ['Catamarca', -28.4696, -65.7795, 200],
  ['Comodoro Rivadavia', -45.8641, -67.4966, 180],
  ['Río Cuarto', -33.1232, -64.3493, 170],
  ['Concordia', -31.3929, -58.0209, 170],
  ['San Carlos de Bariloche', -41.1335, -71.3103, 135],
  ['San Nicolás', -33.3303, -60.2269, 140],
  ['Tandil', -37.3217, -59.1332, 130],
  ['San Rafael', -34.6177, -68.3301, 120],
  ['Santa Rosa', -36.6167, -64.2833, 120],
  ['Puerto Madryn', -42.7692, -65.0385, 100],
  ['Trelew', -43.249, -65.3051, 100],
  ['Río Gallegos', -51.623, -69.2168, 100],
  ['Rafaela', -31.2503, -61.4867, 100],
  ['Pergamino', -33.8895, -60.5736, 100],
  ['Junín', -34.5856, -60.9589, 95],
  ['Villa María', -32.4075, -63.2402, 90],
  ['Olavarría', -36.8927, -60.3225, 90],
  ['Ushuaia', -54.8019, -68.303, 80],
  ['Villa Carlos Paz', -31.4241, -64.4978, 70],
].map(([name, lat, lng, weight, towns]) => ({ name, lat, lng, weight, towns: towns ?? [name] }));

/** σ del jitter en km: 6 en ciudades de más de 1M de habitantes, 3 en el resto. */
export const sigmaKm = (city) => (city.weight >= 1000 ? 6 : 3);

// Máscara de tierra firme por ciudad (grilla de MASK_CELL_KM sobre ±3σ), armada con
// scripts/seed-land-mask.mjs a partir de OSM. Fuera de la ventana cuenta como agua.
export const MASK_FILE = new URL('./seed-land-mask.json', import.meta.url);
export const MASK_CELL_KM = 0.2;
export const maskHalfKm = (city) => 3 * sigmaKm(city);
let landMask;

/** ¿El punto a (x, y) km del centro de la ciudad (x al este, y al norte) es tierra firme? */
export function onLand(city, x, y) {
  landMask ??= JSON.parse(readFileSync(MASK_FILE, 'utf8'));
  const m = landMask.cities[city.name];
  if (!m || m.half !== maskHalfKm(city) || landMask.cellKm !== MASK_CELL_KM) {
    throw new Error(`Máscara desactualizada para ${city.name}: correr node scripts/seed-land-mask.mjs`);
  }
  m.bits ??= Buffer.from(m.land, 'base64');
  const col = Math.floor((x + m.half) / MASK_CELL_KM), row = Math.floor((y + m.half) / MASK_CELL_KM);
  if (col < 0 || row < 0 || col >= m.n || row >= m.n) return false;
  const i = row * m.n + col;
  return (m.bits[i >> 3] >> (i & 7)) & 1;
}

// [nombre en la tabla sports, peso, cupos posibles (el organizador no ocupa cupo)]
const SPORTS = [
  ['FUTBOL', 45, [[9, 60], [13, 25], [21, 15]]],
  ['PADEL', 25, [[3, 1]]],
  ['BASQUET', 12, [[5, 40], [9, 60]]],
  ['TENIS', 10, [[3, 1]]], // sin single: cupo 1 < CAPACITY_MIN
  ['RUNNING', 8, null], // 4-20
].map(([name, weight, capacities]) => ({ name, weight, capacities }));

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

const FIRST = `Agustín Alejandro Alan Alejo Andrés Ariel Axel Benjamín Bruno Camilo Carlos Cristian Damián Daniel Dante
Diego Emiliano Enzo Esteban Ezequiel Facundo Federico Felipe Fernando Franco Gabriel Gastón Gonzalo Guido Gustavo
Hernán Ignacio Iván Javier Joaquín Jorge Juan Julián Leandro Lautaro Leonardo Lorenzo Lucas Luciano Manuel Marcelo
Marcos Martín Mateo Matías Maximiliano Nahuel Nicolás Pablo Patricio Pedro Ramiro Renzo Rodrigo Santiago Santino
Sebastián Sergio Thiago Tobías Tomás Valentín Walter Agustina Abril Ailén Antonella Belén Bianca Brenda Camila Candela
Carolina Catalina Celeste Constanza Daiana Delfina Florencia Gabriela Guadalupe Jazmín Josefina Julieta Lara Laura
Lucía Ludmila Luciana Lourdes Macarena Magalí Malena Manuela María Mariana Martina Micaela Milagros Morena Natalia
Noelia Paula Pilar Rocío Romina Sabrina Sofía Sol Tamara Valentina Victoria Yamila Zoe`.split(/\s+/);

const LAST = `González Rodríguez Gómez Fernández López Díaz Martínez Pérez García Sánchez Romero Sosa Torres Álvarez
Ruiz Ramírez Flores Benítez Acosta Medina Herrera Suárez Aguirre Giménez Gutiérrez Pereyra Rojas Molina Castro Ortiz
Silva Núñez Luna Juárez Cabrera Ríos Morales Godoy Moreno Ferreyra Domínguez Carrizo Peralta Castillo Ledesma Quiroga
Vega Vera Muñoz Ojeda Ponce Villalba Cardozo Navarro Coronel Vázquez Ramos Vargas Cáceres Arias Figueroa Córdoba
Correa Maldonado Paz Rivero Miranda Mansilla Farías Roldán Méndez Guzmán Agüero Hernández Lucero Cruz Páez Escobar
Mendoza Barrios Bustos Ávila Ayala Blanco Soria Maidana Acuña Leiva Duarte Moyano Campos Soto Martín Valdez Bravo
Chávez Velázquez Olivera Toledo Franco Rossi Russo Ferrari Bianchi Romano Colombo Ricci Marino Greco Bruno Gallo
Conti Costa Giordano Mancini Lombardi Moretti Barbieri Fontana Santoro Mariani Rinaldi Caruso Ferrara Galli Martini
Leone Longo Gentile Martinelli Vitale Lombardo Serra Coppola Fabbri Bianco Marchetti Villa Ferri Fiore Parisi
Lorenzo Sala Monti Rizzo Benedetti Cattaneo Testa Morelli Grasso Pellegrini Carbone`.split(/\s+/);

const EMAIL_DOMAINS = [['gmail.com', 60], ['hotmail.com', 20], ['outlook.com', 10], ['yahoo.com.ar', 10]];

const PLACE_WORDS = `San Martín|Belgrano|Independencia|Los Andes|El Ombú|La Terraza|Del Parque|Norte|Sur|Las Acacias
|El Talar|Los Pinos|Del Sol|Social|Unión|Juventud|Estrella|Defensores|Sportivo|Progreso|Los Aromos|El Ceibo
|La Arboleda|Libertad|Huracán|Atenas|Olimpia|Central|Alem|Sarmiento|Rivadavia|Mitre|Las Heras|Pueyrredón`
  .split('|').map((s) => s.trim());

const DESCRIPTIONS = {
  common: ['Falta 1 para completar, nivel tranqui', 'Buena onda ante todo', 'Llegar 10 min antes',
    'Se divide la cancha entre todos', 'Partido semanal, se suman nuevos', 'Traer agua, no hay kiosco',
    'Hay estacionamiento en la puerta', 'Si llueve se suspende'],
  FUTBOL: ['Traer remera blanca y una oscura', 'Cancha de sintético, botines de goma', 'Pelota la llevo yo',
    'Arquero rotativo', 'Picado sin tarjetas, fair play'],
  PADEL: ['Paleta de sobra si alguien necesita', 'Cancha de blindex', 'Se juega al mejor de 3 sets',
    'Pelotas nuevas las pongo yo'],
  BASQUET: ['Media cancha, a 21', 'Cancha techada', 'Traer remera clara y oscura', 'Se juega a 15 por partido'],
  TENIS: ['Dobles, polvo de ladrillo', 'Cancha rápida', 'Pelotas nuevas', 'Peloteo y después partido'],
  RUNNING: ['Ritmo 6 min/km', 'Salimos puntual', '10K por la costanera', 'Fondo largo de domingo',
    'Pasadas en el parque, todos los niveles'],
};

const CANCEL_REASONS = ['Llueve', 'No llegamos a armar', 'Se cayó la reserva de la cancha', 'Me surgió un imprevisto',
  'Cancha inundada', 'Se suspende por tormenta', 'Muchas bajas a último momento', 'Problema con el complejo'];

const SCORES = [[5, 45], [4, 35], [3, 12], [2, 5], [1, 3]];

// ─── utilidades ──────────────────────────────────────────────────────────────

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const deaccent = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');

/** Formato de Prisma para timestamp(3) sin zona: UTC, sin la Z. */
const ts = (ms) => new Date(ms).toISOString().replace('T', ' ').replace('Z', '');

// ─── generador ───────────────────────────────────────────────────────────────

/**
 * Genera todas las filas en memoria. Puro: mismo input → mismo output.
 * @returns {{users, userSports, matches, joinRequests, participants, ratings, noShows, lateWithdrawals}}
 */
export function generate({ seed = 42, users: nUsers = 2000, matches: nMatches = 10000, now = Date.now() } = {}) {
  const rand = mulberry32(seed);
  const int = (a, b) => a + Math.floor(rand() * (b - a + 1));
  const between = (a, b) => a + rand() * (b - a);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const weighted = (pairs) => {
    let r = rand() * pairs.reduce((s, [, w]) => s + w, 0);
    for (const [v, w] of pairs) if ((r -= w) < 0) return v;
    return pairs.at(-1)[0];
  };
  const gauss = () => Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand());

  const ids = new Set();
  const cuid = () => {
    let id;
    do id = 'c' + Array.from({ length: 24 }, () => '0123456789abcdefghijklmnopqrstuvwxyz'[int(0, 35)]).join('');
    while (ids.has(id));
    ids.add(id);
    return id;
  };

  const cityPairs = CITIES.map((c) => [c, c.weight]);
  const sportPairs = SPORTS.map((s) => [s, s.weight]);

  // ── usuarios
  const users = [];
  const emails = new Set();
  const byCity = new Map(CITIES.map((c) => [c.name, []]));
  for (let i = 0; i < nUsers; i++) {
    const city = weighted(cityPairs);
    const first = pick(FIRST);
    const last = pick(LAST);
    let email;
    do {
      const local = rand() < 0.5 ? `${deaccent(first)}.${deaccent(last)}` : deaccent(first) + deaccent(last);
      email = `${local}${int(10, 9999)}@${weighted(EMAIL_DOMAINS)}`;
    } while (emails.has(email));
    emails.add(email);
    const prefs = new Set();
    const nPrefs = weighted([[1, 45], [2, 40], [3, 15]]);
    while (prefs.size < nPrefs) prefs.add(weighted(sportPairs).name);
    const user = {
      id: cuid(),
      firebaseUid: `seed_${String(i + 1).padStart(6, '0')}`,
      email,
      name: `${first} ${last}`,
      cityRef: city,
      city: pick(city.towns),
      level: weighted([['BEGINNER', 30], ['INTERMEDIATE', 50], ['ADVANCED', 20]]),
      prefs,
      orgWeight: Math.min(50, (1 - rand()) ** (-1 / 1.2)), // cola larga: pocos organizan mucho
      busy: new Set(),
      firstSeen: Infinity,
    };
    users.push(user);
    byCity.get(city.name).push(user);
  }
  const orgPairsByCity = new Map([...byCity].map(([name, list]) => [name, list.map((u) => [u, u.orgWeight])]));
  const allOrgPairs = users.map((u) => [u, u.orgWeight]);

  // Ocupa franjas de 1 h: un partido bloquea su hora y la siguiente.
  const slot = (date) => Math.floor(date / HOUR);
  const isFree = (u, date) => !u.busy.has(slot(date)) && !u.busy.has(slot(date) + 1);
  const occupy = (u, date) => { u.busy.add(slot(date)); u.busy.add(slot(date) + 1); };
  const seen = (u, at) => { if (at < u.firstSeen) u.firstSeen = at; };

  // ── partidos y plantel
  const arToday = Math.floor((now - AR_OFFSET) / DAY); // día calendario argentino de `now`
  const matches = [];
  const joinRequests = [];
  const participants = [];
  const lateWithdrawals = [];

  for (let j = 0; j < nMatches; j++) {
    const future = rand() < 0.3;
    const city = weighted(cityPairs);
    const sport = weighted(sportPairs);
    const capacity = sport.capacities ? weighted(sport.capacities) : int(4, 20);

    const day = arToday + (future ? int(0, 59) : -int(1, 90));
    const weekend = [0, 6].includes(new Date(day * DAY).getUTCDay());
    const hour = weekend ? int(9, 21) : rand() < 0.8 ? int(18, 23) : int(8, 17);
    let date = day * DAY + AR_OFFSET + hour * HOUR + (rand() < 0.5 ? 0 : 30 * MIN);
    if (future && date <= now + HOUR) date += DAY; // hoy, pero ya pasó: mañana a la misma hora

    const cityOrgs = orgPairsByCity.get(city.name);
    let organizer;
    for (let t = 0; t < 10 && !(organizer && isFree(organizer, date)); t++) {
      organizer = weighted(cityOrgs.length ? cityOrgs : allOrgPairs);
    }
    occupy(organizer, date);

    const levelIdx = LEVELS.indexOf(organizer.level);
    const level = rand() < 0.7 ? organizer.level
      : LEVELS[Math.min(2, Math.max(0, levelIdx + (rand() < 0.5 ? -1 : 1)))];

    // jitter gaussiano; se vuelve a sortear si cae en agua o a menos de ~200 m (máscara OSM, §5)
    const sigma = sigmaKm(city);
    let x, y, tries = 0;
    do {
      if (++tries > 1000) throw new Error(`No hay tierra firme cerca de ${city.name}`);
      [x, y] = [gauss() * sigma, gauss() * sigma];
    } while (!onLand(city, x, y));
    const dLat = y / 111;
    const dLng = x / (111 * Math.cos((city.lat * Math.PI) / 180));

    let createdAt = date - between(2 * HOUR, 7 * DAY);
    if (createdAt > now) createdAt = now - between(10 * MIN, 3 * DAY);

    const location = {
      FUTBOL: () => pick([`Club Atlético ${pick(PLACE_WORDS)} · Cancha ${int(1, 6)}`, `Complejo ${pick(PLACE_WORDS)} Fútbol 5`]),
      PADEL: () => `${pick(PLACE_WORDS)} Pádel · Cancha ${int(1, 4)}`,
      BASQUET: () => pick([`Club ${pick(PLACE_WORDS)} · Básquet`, `Polideportivo Municipal ${city.towns[0]}`]),
      TENIS: () => `Club de Tenis ${pick(PLACE_WORDS)} · Cancha ${int(1, 8)}`,
      RUNNING: () => `Parque ${pick(PLACE_WORDS)}`,
    }[sport.name]();

    const match = {
      id: cuid(),
      sport: sport.name,
      cityName: city.name,
      level,
      date,
      location,
      latitude: +(city.lat + dLat).toFixed(6),
      longitude: +(city.lng + dLng).toFixed(6),
      capacity,
      description: rand() < 0.5 ? null : pick([...DESCRIPTIONS.common, ...DESCRIPTIONS[sport.name]]),
      organizerId: organizer.id,
      organizer,
      createdAt,
      status: 'ACTIVE',
      cancelReason: null,
      canceledAt: null,
      filledAt: null,
      reminderSentAt: null,
      roster: [],
    };
    seen(organizer, createdAt);

    if (rand() < 0.08) {
      match.status = 'CANCELED';
      match.cancelReason = pick(CANCEL_REASONS);
      const late = rand() < 0.15 && date - 2 * HOUR < now;
      match.canceledAt = late
        ? Math.min(now, date - between(5 * MIN, 2 * HOUR))
        : createdAt + rand() * (Math.min(date - 2 * HOUR, now) - createdAt);
      if (match.canceledAt < createdAt) match.canceledAt = createdAt + MIN;
    } else if (date < now && date - createdAt > DAY) {
      match.reminderSentAt = date - DAY;
    }

    // plantel: cada participante sale de una JoinRequest ACCEPTED
    const joinEnd = match.canceledAt ?? Math.min(date - 10 * MIN, now);
    const target = future
      ? (rand() < 0.25 ? capacity : int(0, capacity - 1))
      : Math.round(capacity * between(0.6, 1));
    const inMatch = new Set([organizer.id]);
    const cityUsers = byCity.get(city.name);
    const roster = [];
    for (let k = 0; k < target; k++) {
      let chosen = null;
      for (let t = 0; t < 40 && !chosen; t++) {
        const pool = rand() < 0.9 && cityUsers.length ? cityUsers : users;
        const u = pick(pool);
        if (inMatch.has(u.id) || !isFree(u, date)) continue;
        if (t < 25 && !u.prefs.has(sport.name)) continue; // primero, gente que juega ese deporte
        chosen = u;
      }
      if (!chosen) break;
      inMatch.add(chosen.id);
      occupy(chosen, date);
      roster.push(chosen);
    }
    const joinTimes = roster.map(() => between(createdAt + MIN, Math.max(createdAt + 2 * MIN, joinEnd))).sort((a, b) => a - b);

    roster.forEach((u, k) => {
      const at = joinTimes[k];
      const requestedAt = Math.max(createdAt, at - between(MIN, 12 * HOUR));
      seen(u, requestedAt);
      // baja tarde: se fue a menos de 2 h; la app borra su Participant y su JoinRequest
      const lwAt = date - between(5 * MIN, 2 * HOUR);
      if (match.status === 'ACTIVE' && rand() < 0.03 && lwAt <= now && lwAt > at) {
        lateWithdrawals.push({ id: cuid(), matchId: match.id, userId: u.id, createdAt: lwAt });
        return;
      }
      const origin = rand() < 0.1 ? 'INVITATION' : 'REQUEST';
      joinRequests.push({ id: cuid(), matchId: match.id, userId: u.id, status: 'ACCEPTED', origin, createdAt: requestedAt, updatedAt: at });
      participants.push({ id: cuid(), matchId: match.id, userId: u.id, createdAt: at });
      match.roster.push(u);
    });
    if (roster.length === capacity) match.filledAt = joinTimes.at(-1); // inmutable aunque después alguien se baje

    // solicitudes que no terminaron en plantel
    const others = (n, origin, status) => {
      for (let k = 0; k < n; k++) {
        const u = pick(cityUsers.length ? cityUsers : users);
        if (inMatch.has(u.id)) continue;
        inMatch.add(u.id);
        const at = between(createdAt, joinEnd);
        seen(u, at);
        joinRequests.push({ id: cuid(), matchId: match.id, userId: u.id, status, origin, createdAt: at,
          updatedAt: status === 'PENDING' ? at : Math.min(now, at + between(10 * MIN, 6 * HOUR)) });
      }
    };
    if (future && match.status === 'ACTIVE') {
      others(int(0, 3), 'REQUEST', 'PENDING');
      if (rand() < 0.15) others(1, 'INVITATION', 'PENDING');
    }
    if (rand() < 0.1) others(1, 'REQUEST', 'REJECTED');

    matches.push(match);
  }

  // ── faltas: ~2 % al azar + ~20 usuarios forzados a 3 en 90 días (suspendidos)
  const played = matches.filter((m) => m.status === 'ACTIVE' && m.date < now && now - m.date > 30 * MIN);
  const noShowsBy = new Map(played.map((m) => [m, new Set()]));
  for (const m of played) for (const u of m.roster) if (rand() < 0.02) noShowsBy.get(m).add(u);

  const playedByUser = new Map();
  for (const m of played) for (const u of m.roster) {
    if (!playedByUser.has(u)) playedByUser.set(u, []);
    playedByUser.get(u).push(m);
  }
  const candidates = [...playedByUser].filter(([, ms]) => ms.length >= 3);
  for (let k = 0; k < Math.min(20, candidates.length); k++) {
    const [u, ms] = candidates.splice(int(0, candidates.length - 1), 1)[0];
    const recent = ms.sort((a, b) => b.date - a.date).slice(0, 6);
    for (let n = 0; n < 3; n++) noShowsBy.get(recent.splice(int(0, recent.length - 1), 1)[0]).add(u);
  }

  // ── calificaciones y marcas de falta: un envío por persona, dentro de las 48 h
  const ratings = [];
  const noShows = [];
  for (const m of played) {
    const windowEnd = Math.min(m.date + 2 * DAY, now);
    const absent = noShowsBy.get(m);
    const present = [m.organizer, ...m.roster.filter((u) => !absent.has(u))];
    const raters = new Set(present.filter(() => rand() < 0.8));

    const marks = [];
    for (const u of absent) {
      const players = m.roster.filter((p) => !absent.has(p));
      const reporters = rand() < 0.6 || players.length < 2
        ? [m.organizer]
        : [...players].sort(() => rand() - 0.5).slice(0, 2);
      for (const r of reporters) { raters.add(r); marks.push([r, u]); }
    }

    const sentAt = new Map([...raters].map((r) => [r, between(m.date + 30 * MIN, windowEnd)]));
    for (const [r, u] of marks) noShows.push({ id: cuid(), matchId: m.id, reporterId: r.id, reportedUserId: u.id, createdAt: sentAt.get(r) });
    for (const r of raters) for (const u of present) {
      if (u === r) continue;
      ratings.push({ id: cuid(), matchId: m.id, raterId: r.id, ratedUserId: u.id, score: weighted(SCORES), createdAt: sentAt.get(r) });
    }
  }

  // ── fechas de alta: siempre antes de su primera aparición, nunca más de 180 días atrás
  for (const u of users) {
    const latest = Math.min(u.firstSeen - HOUR, now - DAY);
    const earliest = Math.min(now - 180 * DAY, latest - DAY);
    u.createdAt = Math.max(earliest, latest - between(0, 60 * DAY));
    u.onboardedAt = u.createdAt + between(2 * MIN, 20 * MIN);
  }
  const userSports = users.flatMap((u) => [...u.prefs].map((sport) => ({ id: cuid(), userId: u.id, sport, createdAt: u.onboardedAt })));

  return { users, userSports, matches, joinRequests, participants, ratings, noShows, lateWithdrawals };
}

// ─── SQL ─────────────────────────────────────────────────────────────────────

const copyValue = (v) => (v === null || v === undefined ? '\\N'
  : String(v).replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\r/g, '\\r'));

function copyBlock(table, columns, rows) {
  const head = `COPY ${table} (${columns.map((c) => `"${c}"`).join(', ')}) FROM stdin;`;
  return [head, ...rows.map((r) => r.map(copyValue).join('\t')), '\\.', ''].join('\n');
}

const SPORT_NAMES_SQL = SPORTS.map((s) => `'${s.name}'`).join(', ');

/** Guards comunes: la base tiene que ser la esperada. */
const DB_GUARD = `\\set ON_ERROR_STOP on
\\if :{?expected_db}
\\else
  \\echo 'ABORT: falta -v expected_db=<nombre de la base>'
  \\quit
\\endif
SELECT current_database() = :'expected_db' AS db_ok, current_database() AS db_name \\gset
\\if :db_ok
\\else
  \\echo 'ABORT: la base es' :'db_name' 'y se esperaba' :'expected_db'
  \\quit
\\endif
`;

export function toSql(d, { seed, now }) {
  const out = [
    `-- Generado por scripts/seed-load.mjs (seed ${seed}, ${new Date(now).toISOString()}).`,
    `-- Schema: sportmatch origin/dev hasta ${SCHEMA_MIGRATION}. Ver plan-data.md.`,
    DB_GUARD,
    `SELECT NOT EXISTS (SELECT 1 FROM users WHERE "firebaseUid" LIKE 'seed\\_%') AS clean \\gset`,
    `\\if :clean\n\\else\n  \\echo 'ABORT: ya hay usuarios seed_. Correr scripts/seed-purge.sql antes de recargar.'\n  \\quit\n\\endif`,
    `SELECT count(*) = ${SPORTS.length} AS sports_ok FROM sports WHERE name IN (${SPORT_NAMES_SQL}) \\gset`,
    `\\if :sports_ok\n\\else\n  \\echo 'ABORT: faltan deportes en la tabla sports (se esperan ${SPORT_NAMES_SQL})'\n  \\quit\n\\endif`,
    '',
    'BEGIN;',
    '',
    copyBlock('users', ['id', 'firebaseUid', 'email', 'name', 'city', 'level', 'role', 'onboardedAt', 'createdAt', 'updatedAt'],
      d.users.map((u) => [u.id, u.firebaseUid, u.email, u.name, u.city, u.level, 'USER', ts(u.onboardedAt), ts(u.createdAt), ts(u.createdAt)])),
    // sportId se resuelve por nombre contra la tabla sports de cada entorno
    'CREATE TEMP TABLE _us (id text, "userId" text, sport text, "createdAt" timestamp(3)) ON COMMIT DROP;',
    copyBlock('_us', ['id', 'userId', 'sport', 'createdAt'], d.userSports.map((s) => [s.id, s.userId, s.sport, ts(s.createdAt)])),
    'INSERT INTO user_sports (id, "userId", "sportId", "createdAt") SELECT _us.id, _us."userId", s.id, _us."createdAt" FROM _us JOIN sports s ON s.name = _us.sport;',
    '',
    `CREATE TEMP TABLE _m (LIKE matches) ON COMMIT DROP;`,
    copyBlock('_m', ['id', 'sportId', 'level', 'date', 'location', 'latitude', 'longitude', 'capacity', 'description', 'organizerId',
      'status', 'cancelReason', 'canceledAt', 'filledAt', 'reminderSentAt', 'createdAt', 'updatedAt'],
    d.matches.map((m) => [m.id, m.sport, m.level, ts(m.date), m.location, m.latitude, m.longitude, m.capacity, m.description,
      m.organizerId, m.status, m.cancelReason, m.canceledAt && ts(m.canceledAt), m.filledAt && ts(m.filledAt),
      m.reminderSentAt && ts(m.reminderSentAt), ts(m.createdAt), ts(m.canceledAt ?? m.createdAt)])),
    'UPDATE _m SET "sportId" = s.id FROM sports s WHERE s.name = _m."sportId";',
    'INSERT INTO matches SELECT * FROM _m;',
    '',
    copyBlock('join_requests', ['id', 'matchId', 'userId', 'status', 'origin', 'createdAt', 'updatedAt'],
      d.joinRequests.map((r) => [r.id, r.matchId, r.userId, r.status, r.origin, ts(r.createdAt), ts(r.updatedAt)])),
    copyBlock('participants', ['id', 'matchId', 'userId', 'createdAt'],
      d.participants.map((p) => [p.id, p.matchId, p.userId, ts(p.createdAt)])),
    copyBlock('ratings', ['id', 'matchId', 'raterId', 'ratedUserId', 'score', 'createdAt'],
      d.ratings.map((r) => [r.id, r.matchId, r.raterId, r.ratedUserId, r.score, ts(r.createdAt)])),
    copyBlock('no_show_reports', ['id', 'matchId', 'reporterId', 'reportedUserId', 'createdAt'],
      d.noShows.map((n) => [n.id, n.matchId, n.reporterId, n.reportedUserId, ts(n.createdAt)])),
    copyBlock('late_withdrawals', ['id', 'matchId', 'userId', 'createdAt'],
      d.lateWithdrawals.map((l) => [l.id, l.matchId, l.userId, ts(l.createdAt)])),
    'COMMIT;',
    `\\echo 'OK: carga completa'`,
    `SELECT (SELECT count(*) FROM users WHERE "firebaseUid" LIKE 'seed\\_%') AS seed_users,`,
    `       (SELECT count(*) FROM matches m JOIN users u ON u.id = m."organizerId" WHERE u."firebaseUid" LIKE 'seed\\_%') AS seed_matches;`,
    '',
  ];
  return out.join('\n');
}

export function summary(d, now) {
  const upcoming = d.matches.filter((m) => m.status === 'ACTIVE' && m.date > now);
  const byCity = {};
  for (const m of d.matches) byCity[m.cityName] = (byCity[m.cityName] ?? 0) + 1;
  return {
    filas: {
      users: d.users.length,
      user_sports: d.userSports.length,
      matches: d.matches.length,
      join_requests: d.joinRequests.length,
      participants: d.participants.length,
      ratings: d.ratings.length,
      no_show_reports: d.noShows.length,
      late_withdrawals: d.lateWithdrawals.length,
    },
    partidos: {
      jugados: d.matches.filter((m) => m.date < now).length,
      futuros_activos: upcoming.length,
      futuros_con_lugar: upcoming.filter((m) => m.roster.length < m.capacity).length,
      cancelados: d.matches.filter((m) => m.status === 'CANCELED').length,
    },
    top_ciudades: Object.entries(byCity).sort((a, b) => b[1] - a[1]).slice(0, 8),
  };
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { values } = parseArgs({
    options: {
      seed: { type: 'string', default: '42' },
      users: { type: 'string', default: '2000' },
      matches: { type: 'string', default: '10000' },
    },
  });
  const now = Date.now();
  const opts = { seed: +values.seed, users: +values.users, matches: +values.matches, now };
  const data = generate(opts);
  const dir = new URL('../outputs/seed-load/', import.meta.url);
  mkdirSync(dir, { recursive: true });
  const sql = toSql(data, opts);
  writeFileSync(new URL('load.sql', dir), sql);
  console.log(JSON.stringify(summary(data, now), null, 2));
  console.log(`\noutputs/seed-load/load.sql (${(sql.length / 1e6).toFixed(1)} MB). Schema hasta ${SCHEMA_MIGRATION}.`);
}
