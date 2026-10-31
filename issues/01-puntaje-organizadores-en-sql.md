# BUG-17 · Mapa y Descubrir tardan ~2 s: el puntaje de los organizadores se calcula en Node

> Creado en Linear: [SPO-306](https://linear.app/sportmatch-dirproy/issue/SPO-306/bug-17-mapa-y-descubrir-tardan-2-s-el-puntaje-de-los-organizadores-se)

**Referencia:** RF-04 · WBS 7.1.3 (+ 5.1.4) · bug de QA BUG-17 · audit de rendimiento con la carga masiva (31/10)

**Descripción**

Con la carga masiva en dev (2.000 usuarios, 10.000 partidos, 325k calificaciones), `GET /matches` tarda **~2,2 s**. Es el endpoint que usan el Mapa y Descubrir. El 75–80 % de ese tiempo es `sortByCompatibility` → `UsersService.getScores(organizerIds)`: en **cada request** trae a Node todas las calificaciones recibidas por los organizadores de los partidos disponibles y las promedia ahí.

Medido contra una base local con la misma carga y el back de `origin/dev` (`f7b2989`):

| Paso | p50 |
| -- | -- |
| `getScores(841 organizadores)`, total | **2,3–2,4 s** |
| ↳ `findReceivedRatings`: **142.635 filas** a Node | 1,8 s |
| ↳ `findConfirmedNoShows({ matchIds })`, con 6.120 ids en el `IN` | 0,2 s |
| `AVG(score) … GROUP BY` en SQL, como referencia | **85 ms** |

[SPO-253](https://linear.app/sportmatch-dirproy/issue/SPO-253) ya pasó el puntaje a consultas por lote y sacó el N+1. Lo que queda es que las calificaciones se siguen trayendo fila por fila para promediarlas en Node, y ese costo crece con cada calificación nueva. Este ticket hace que la base devuelva los totales.

**Pasos**

1. `back/src/users/users.repository.ts`: método nuevo `findScoreTotals(userIds)` con un `$queryRaw` que devuelve, por usuario, `starsSum`, `starsCount`, `noShows` y `lates`. Tiene que aplicar las mismas reglas que hoy aplica Node:

   | Regla (hoy en Node) | En SQL |
   | -- | -- |
   | **Falta confirmada** (`confirmedNoShows`): la marcó el organizador o al menos 2 jugadores distintos | CTE `confirmed(matchId, userId)`: `no_show_reports` unido a `matches`, agrupado por partido y usuario reportado, con `HAVING bool_or("reporterId" = m."organizerId") OR count(*) >= 2` |
   | Una calificación no cuenta si el calificado **o** quien calificó tiene una falta confirmada en ese partido | `ratings` con `NOT EXISTS` contra `confirmed`, por `ratedUserId` y por `raterId` → `starsSum`, `starsCount` |
   | Cada falta confirmada entra como 1 ★ | `count(*)` de `confirmed` por usuario → `noShows` |
   | Cada `late_withdrawals` entra como 2 ★ | `count(*)` por `userId` |
   | Cada partido que el organizador canceló con menos de 2 h de anticipación (`date - "canceledAt" < interval '2 hours'`) entra como 2 ★ | `matches` con `status = 'CANCELED'`, contado por `organizerId`. Se suma al anterior → `lates` |
2. `back/src/users/users.service.ts`: `computeScores` usa `findScoreTotals` y arma el `UserScore` en TypeScript, con las constantes que ya existen (`NO_SHOW_SCORE`, `LATE_WITHDRAWAL_SCORE`): `rating = round((starsSum + noShows·1 + lates·2) / (starsCount + noShows + lates) × 10) / 10`, `ratingCount = starsCount`, y `EMPTY_SCORE` si no hay nada. La firma de `getScores(userIds): Promise<Map<string, UserScore>>` no cambia, así que `matches.service.ts` no se toca. El perfil (`buildProfile`) también pasa por `computeScores`.
3. `getSuspensions`, `findConfirmedNoShows` y `noShowCount90d` **no se tocan**: necesitan la fecha de cada falta y no son lentos (38 ms).
4. Borrar lo que quede sin uso (`findEffectiveScoresBy`, `findReceivedRatings`, `findCanceledMatchDates`, `countLateWithdrawalsBy`, `toScore`, `countByUser`), si no lo usa nadie más.
5. **Paridad, sin commitearla:** un script que corra la implementación vieja y la nueva contra la base con la carga (local según `plan-data.md` §7.1, o dev) para los 2.000 usuarios, y compare `rating` y `ratingCount`. La salida va en el PR.

**Criterios de aceptación**

- [ ] Paridad: 0 diferencias en `rating` y `ratingCount` para los 2.000 usuarios de la carga. La salida del script va en el PR.
- [ ] Mismo orden en Descubrir: con el mismo usuario y los mismos datos, `GET /matches` devuelve los mismos ids en el mismo orden que antes.
- [ ] Con la carga, `getScores` para los organizadores de `GET /matches` tarda **< 150 ms p50** (hoy 2,3 s), y `GET /matches` sin filtros tarda **< 1 s p50** (hoy 2,2 s). Medición antes y después en el PR, con `scripts/perf-bench.e2e-spec.ts` de `sportmatch-linktree`.
- [ ] El perfil propio y el ajeno muestran el mismo puntaje que antes en 3 usuarios de la carga, entre ellos uno con faltas y uno con bajas tarde.
- [ ] El `$queryRaw` vive en el repository; el service no importa `PrismaService`. Ningún archivo `.spec.ts`. `npm run lint` y `npm run build` pasan.

**Notas**

* La regla de falta confirmada queda en dos lugares: en SQL para el puntaje y en `confirmedNoShows` para las fechas. Dejar un comentario en los dos que apunte al otro.
* Alternativa si el SQL se complica: cachear en memoria el `Map` de puntajes con un TTL de 5 min. Baja la mayoría de las requests, pero la primera de cada ventana sigue tardando 2 s y el costo sigue creciendo. Se prefiere SQL.
* Fuera de alcance: guardar el puntaje desnormalizado en `users`, y paginar `GET /matches` (BUG-18).
* Audit completo, con el método y cómo reproducir la medición: `issues/audit-rendimiento.md` en `sportmatch-linktree`.

**Rama:** `feature/SPO-306-puntaje-en-sql`, PR contra `dev`. No usar la rama que sugiere Linear (`usuario/spo-306-…`).

**Bloqueado por:** —
