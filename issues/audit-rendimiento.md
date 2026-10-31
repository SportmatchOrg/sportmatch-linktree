# Audit de rendimiento con volumen: SportMatch

**Fecha:** 2026-10-31 · **Código auditado:** `origin/dev` @ `f7b2989` (merge de PR #159)
**Datos:** la carga de [`plan-data.md`](../plan-data.md): 2.000 usuarios, 10.000 partidos y 325k calificaciones.
Es la misma semilla que se cargó en dev.

Este documento no es un issue: es la evidencia que respalda los issues 01 a 04 (§4).

---

## 1. Resumen

- **Mapa y Descubrir tardan ~2,2 s por request y bajan 1,2 MB de JSON.** Usan el mismo endpoint
  (`GET /matches`), que devuelve **todos** los partidos disponibles del país (1.677) sin paginar.
- **El 75–80 % de ese tiempo es el puntaje de los organizadores** (`getScores`). Para ordenar por
  compatibilidad, en **cada** request se traen 142.635 calificaciones a Node (~1,8 s).
- El segundo costo es el `include` de relaciones para los 2.783 partidos futuros, aunque después se
  descartan los llenos (0,3–1,0 s).
- **No hay compresión HTTP.** Los 1,27 MB se comprimirían a 159 KB con gzip.
- En el front, el Mapa dibuja 1.677 `AdvancedMarker` sin clustering. Además, `useMatches` no usa TanStack
  Query, así que cada vuelta al Mapa o a Descubrir repite la request de 2 s.
- **Lo que no duele (hipótesis refutadas):** índices, búsqueda de usuarios, perfil ajeno y snapshot de
  KPIs. Todo eso tarda menos de 110 ms (§3).

## 2. Método

1. **Lectura de código** de `origin/dev` con `git archive`, sin checkout ni escritura en el repo de la app.
2. **Base local descartable** (`postgres:18-alpine`) con las migraciones de `origin/dev` y el mismo
   `load.sql` que fue a dev. Verificado: el id de un partido sintético local responde `200` en
   `GET /public/matches/:id` de dev, porque la semilla es la misma.
3. **El back real de `origin/dev`** corriendo in-process contra esa base, con el harness de los e2e
   (`createTestApp()`, que reemplaza el guard de Firebase). Para cada endpoint: 1 corrida en frío más 5
   mediciones; se reporta la mediana (p50). El script está en
   [`scripts/perf-bench.e2e-spec.ts`](../scripts/perf-bench.e2e-spec.ts).
4. **`EXPLAIN ANALYZE`** de las queries sospechadas de faltar índice.

**Límites de la medición:**
- Fue en una laptop, con la base local. No incluye la latencia de red a Azure, que en dev es de ~0,3–0,6 s
  por request (`/health` y `/public/matches/:id` medidos desde acá).
- Los tiempos varían entre corridas según la carga de la máquina; por ejemplo, `findUpcoming` dio entre
  303 y 1.033 ms. Las proporciones se mantuvieron en todas las corridas.
- **El render del front no se midió en navegador**, porque el login en dev está bloqueado (ver plan §7.2).
  Lo del front sale de leer el código y se confirma con el checklist de §7.4.
- Las demoras de §3 son las de la base local. En dev hay que sumarles la red.

### Reproducir

```bash
S=$(mktemp -d); git -C ../sportmatch archive origin/dev back | tar -x -C "$S"
cp scripts/perf-bench.e2e-spec.ts "$S/back/test/bench.e2e-spec.ts"
cd "$S/back" && npm ci && npx prisma generate
# Base local con el seed (plan-data.md §7.1, con -p 5434). Variables mínimas para que valide el env:
export DATABASE_URL=postgresql://postgres:x@localhost:5434/postgres \
  AZURE_STORAGE_CONNECTION_STRING=UseDevelopmentStorage=true AZURE_STORAGE_CONTAINER=x \
  VAPID_SUBJECT=mailto:a@b.co VAPID_PUBLIC_KEY=… VAPID_PRIVATE_KEY=…   # npx web-push generate-vapid-keys
NODE_OPTIONS=--experimental-vm-modules npx jest --config ./test/jest-e2e.json test/bench.e2e-spec.ts
```

## 3. Mediciones

Visor: usuario sintético de CABA. "Top organizador": el usuario con más partidos organizados (75).

| Pantalla | Endpoint | p50 | Respuesta | Ítems |
|---|---|---|---|---|
| **Descubrir / Mapa** | `GET /matches` | **2.203 ms** | **1.246 KB** | 1.677 |
| Mapa, Deporte + Nivel | `GET /matches?sportId&level` | 607 ms | 243 KB | 325 |
| Mapa, Cerca (CABA, 5 km) | `GET /matches?lat&lng` | 464 ms | 48 KB | 65 |
| Mis partidos (top organizador) | `GET /matches/mine` | 101 ms | 83 KB | 26+9+68+1+4 |
| Partidos jugados (perfil ajeno) | `GET /matches/played-by/:id` | 107 ms | 52 KB | 68 |
| Mis partidos (visor) | `GET /matches/mine` | 69 ms | 28 KB | 10+25+2 |
| `/users/me` | `GET /users/me` | 35 ms | 1 KB | – |
| Perfil ajeno | `GET /users/:id` | 26 ms | 1 KB | – |
| Sin consumidor en el front | `GET /users` | 16 ms | 147 KB | 2.000 |
| Buscar usuario | `GET /users/search?q=mar` | 9 ms | 1 KB | 10 |

**Desglose de `GET /matches` sin filtros:**

| Paso | p50 | Filas |
|---|---|---|
| `findUpcoming` solo con `where` (sin `include`) | 116 ms | 2.783 |
| `findUpcoming` con `include` (como hoy) | 303–1.033 ms | 2.783 |
| Descartar los llenos en Node | – | quedan 1.677, de 841 organizadores |
| **`getScores(841)`, total** | **2.261–2.422 ms** | – |
| ↳ `findReceivedRatings` | **1.830 ms** | **142.635** |
| ↳ `findConfirmedNoShows({ matchIds })` | 204 ms | 6.120 partidos |
| ↳ `findConfirmedNoShows({ reportedUserIds })` | 38 ms | – |
| ↳ `findCanceledMatchDates` | 17 ms | 532 |
| *Referencia:* `AVG(score) GROUP BY` en SQL para los mismos 841 | 85 ms | 841 |

**Prueba de la solución propuesta (issue 02):** candidatos livianos (`select` + `_count`) de los 2.783
partidos: **146 ms**. `include` completo solo para una página de 30 ids: **49 ms**.

**Compresión:** `GET /matches` sale sin `Content-Encoding`: son 1.275.398 bytes, y con gzip serían 158.845.
`main.ts` no registra ningún middleware de compresión. Falta verificar si el proxy `/api` de Vercel la agrega
en dev (issue 03).

### Hipótesis del plan (§7.4): resultado

| Hipótesis | Resultado |
|---|---|
| `findUpcoming` sin `take` ni zona trae todo el país | ✅ **Confirmada.** 2.783 partidos con relaciones; se devuelven 1.677 |
| "Cerca" calcula la distancia en Node, después de traer todo | ✅ **Confirmada.** Para devolver 65 tarda 464 ms, porque igual carga los 2.783 |
| ~2,1k markers sin clustering | ✅ **Confirmada por código:** son 1.677 `AdvancedMarker` y la lista lateral de escritorio dibuja 1.677 `MatchRow`. **No medida en navegador** |
| `sortByCompatibility` → `getScores` es el peor | ✅ **Confirmada.** ~1,8–2,4 s; trae 142k calificaciones |
| `GET /users` sin paginar | ✅ Confirmada (2.000 usuarios, 147 KB), pero **el front no la usa**. Se puede borrar |
| Perfil ajeno (`findPlayedBy`) sin límite | ⚠️ Confirmada, pero **hoy no duele**: 68 partidos en 107 ms. Crece con la historia del usuario. **Descartado** (sin issue) |
| Snapshot de KPIs carga todo en memoria | ❌ **No duele:** `createSnapshot` tarda 730 ms y corre una vez por día |
| Faltan índices en `matches.organizerId` y `status` | ❌ **Refutada a este volumen.** `EXPLAIN ANALYZE`: futuros de un organizador, 3 ms; anti-join de disponibles, 6 ms; búsqueda `ILIKE`, 3 ms (seq scan sobre 2k usuarios). Con 10k partidos el planner usa `matches_date_idx` y no hace falta más |

## 4. Issues

| # | Issue | Linear | Prioridad | Ganancia esperada |
|---|---|---|---|---|
| 01 | [Puntaje de organizadores en SQL](01-puntaje-organizadores-en-sql.md) | **BUG-17 · [SPO-306](https://linear.app/sportmatch-dirproy/issue/SPO-306)** (Backlog) | **P1** | `/matches`: −1,8 a −2,3 s |
| 02 | [`GET /matches` paginado, por zona y comprimido](02-matches-paginado-y-por-zona.md) | **BUG-18 · [SPO-307](https://linear.app/sportmatch-dirproy/issue/SPO-307)** (Backlog) | **P1** | 1,2 MB → ~25 KB con `limit=30`; 160 KB comprimido sin `limit` |
| – | Descubrir de a páginas (front) | No creado: va después de SPO-296 y SPO-307 | P2 | Descubrir usa la paginación |
| 03 | [Borrar `GET /users`](03-borrar-get-users.md) | No creado | P3 | Limpieza; no es rendimiento |
| 04 | [Mapa: pedir solo la zona visible](04-mapa-zona-visible.md) | No creado: medir después de SPO-302 | P3 | ≤ 500 partidos por request |

Se cargaron como bugs de QA, sin control de cambios (decisión del 31/10), y quedaron registrados como BUG-17 y BUG-18 en el registro de bugs.

**Orden sugerido:** primero BUG-17 y después BUG-18. El resto se decide después de medir con SPO-296 y SPO-302 hechos.

### Cruce con Linear (team SPO, 170 issues incluidos los archivados, 31/10)

Se buscó en título, descripción y comentarios de todos los issues. **Ninguno de los 5 está cubierto.** Sí hay
dos tickets abiertos que cubren partes del audit, y por eso esas partes **no** están en los issues de arriba:

| Hallazgo del audit | Ticket que ya lo cubre | Qué se hizo |
|---|---|---|
| 1.677 pins sin clustering | **SPO-302** (Todo) "Mapa: agrupar los pines cercanos…" | Se sacó del issue 04, que ahora depende de SPO-302 |
| `useMatches` sin TanStack Query (refetch en cada navegación) | **SPO-296** (Todo) "Deportes y partidos con TanStack Query + precarga" | Se sacó del issue 03. El 02 y el 04 se apoyan en su `matchesQueryOptions` |

**Tickets cerrados que dejaron esto pendiente o anotado** (los issues los citan):

| Ticket | Qué dejó | Issue |
|---|---|---|
| SPO-253 (Done) | `getScores` por lote, pero promediado en Node | 01 |
| SPO-186 (Done) | "Filtro de cupo en memoria… si algún día importa, `$queryRaw`" | 02 |
| SPO-232 (Done) | "Fuera de alcance: … bounding box del mapa" | 02, 04 |
| SPO-209 (Done) | "Paginación… con los volúmenes de hoy no hace falta" | Sigue valiendo: descartado (68 partidos en 107 ms) |
| SPO-185 (Done) | "Los endpoints se quedan (los va a usar el front)", sobre `GET /users` | 03 (fue un supuesto de un ticket de seguridad, no una decisión sobre el endpoint) |

Sobre la compresión HTTP no hay nada en Linear.

**Para coordinar con SPO-296:** su precarga pide `GET /matches` sin filtros en cada login. Hasta que estén el
01 y el 02, es la request de ~2,2 s y 1,2 MB.

**Fuera de alcance:** índices nuevos, optimizar el snapshot de KPIs, la búsqueda con `pg_trgm` y paginar el historial de partidos jugados. Ninguno
duele a este volumen (§3).
