# Tickets · Semana 8 (Sprint 2) — jueves 24/09 18h al jueves 01/10 18h

> Tickets del PO, cargados en Linear el 24/09 (SPO-226 a SPO-246), en Backlog.
> Reglas de negocio: [`docs/reglas-de-negocio.md`](../../reglas-de-negocio.md) · Glosario:
> [`docs/CONTEXT.md`](../../CONTEXT.md).

**Capacidad:** 18 SP nominales (3 devs × 6 SP). 1 SP = 1 hora. Esta semana se cargan **35 SP**: el contenido
que el cronograma v4 repartía entre las semanas 8 y 9. El PO administra qué entra esta semana y qué pasa a las
siguientes.
**Tamaño:** tickets de 2 a 3 SP (el perfil de la semana 10 tiene uno de 1).
**Lanes del S2 (invertidas):** Nacho (Ignacio Pacheco) → **Back** · Juanchi (Juan Rudolph) → **Front** ·
Juanfra (Juan Francisco Siaba) → **Back y Front**.
**`dueDate`:** 2026-10-01 para todos los tickets de esta semana. Los de la semana 10 van **sin assignee y sin
`dueDate`**.

## Objetivo de la semana

Que el jueves 01/10 **la app abra en un Mapa con los partidos disponibles, filtrables por día, nivel,
deporte y cercanía**, que **cada cosa que le pasa a un partido llegue como notificación a la campanita**, y
que **faltar a un partido tenga consecuencias**: falta visible en el perfil, puntaje penalizado y suspensión
por reincidencia.

## Resumen

| # | Dev | Ticket | SP | Label | WBS | Bloqueado por |
|---|---|---|---:|---|---|---|
| SPO-226 | Nacho | Disparadores de notificaciones: los 6 eventos de partidos y solicitudes | 3 | Backend | 11.1.3 · 6.2.6 | — |
| SPO-228 | Nacho | Faltas: modelo `NoShowReport` y marcarlas en el envío de la calificación | 2 | Backend | 6.4.3 | — |
| SPO-231 | Nacho | Falta confirmada, ventana de cierre de 48 h y descarte de estrellas | 2 | Backend | 6.4.3 | SPO-226, SPO-228 |
| SPO-234 | Nacho | Puntaje con faltas y bajas tarde | 2 | Backend | 5.1.4 | SPO-231 |
| SPO-236 | Nacho | Suspensión por reincidencia: 7 días, 6 meses y 403 | 2 | Backend | 5.1.4 | SPO-231, SPO-234 |
| SPO-238 | Nacho | Descubrir ordenado por compatibilidad | 2 | Backend | 7.1.3 | SPO-234 |
| SPO-230 | Juanchi | Campanita con contador de no leídas | 2 | Frontend | 11.2.1 | SPO-226 (plan B: seed) |
| SPO-233 | Juanchi | Centro de notificaciones: pantalla `/notificaciones` | 2 | Frontend | 11.2.1 | SPO-230 |
| SPO-235 | Juanchi | Mapa (pantalla 03): partidos disponibles como pines | 2 | Frontend | 7.3.2 · 7.3.3 | SPO-227 |
| SPO-237 | Juanchi | El Mapa como inicio: ubicación del jugador, header y tab bar | 2 | Frontend | 7.3.2 | SPO-235, SPO-230 |
| SPO-239 | Juanchi | Filtros del Mapa: chips de día, nivel y "Cerca" | 2 | Frontend | 7.1.2 | SPO-237, SPO-232 |
| SPO-240 | Juanchi | Hoja "Filtros" (deporte y nivel) y "Buscá en esta zona" | 2 | Frontend | 7.1.2 | SPO-239, SPO-229 |
| SPO-227 | Juanfra | Proveedor de mapa (Leaflet + `BaseMap`) y coordenadas en `Match` | 2 | Backend · Frontend | 7.3.1 | — |
| SPO-229 | Juanfra | Paso "Lugar" con autocompletado de direcciones y pin arrastrable | 2 | Frontend | 7.3.1 | SPO-227 |
| SPO-232 | Juanfra | Filtros de búsqueda en `GET /matches` | 3 | Backend | 7.1.1 | SPO-227 |
| SPO-241 | Juanfra | Faltas en la app: "¿Faltó alguien?", suspensión en los CTAs y en el perfil | 3 | Frontend | 6.4.3 · 5.2.4 | SPO-228, SPO-236 |
| | | **Total** | **35** | | | |

Por dev: **Nacho 13 · Juanchi 12 · Juanfra 10**.

## Orden dentro de la semana

| | Nacho (back) | Juanchi (front) | Juanfra (back + front) |
|---|---|---|---|
| **jue 24 – dom 27** | SPO-226 → SPO-228 | SPO-230 → SPO-233 (con las notificaciones del seed) | SPO-227 (PR 1 `BaseMap` primero) → SPO-229 |
| **lun 28 – mar 29** | SPO-231 → SPO-234 | SPO-235 → SPO-237 | SPO-232 |
| **mié 30 – jue 01** | SPO-236 → SPO-238 | SPO-239 → SPO-240 | SPO-241 |

**Qué no se puede correr:**

- **SPO-227 PR 1 va primero de todo.** Es la PR chica que instala `leaflet` y deja `BaseMap`; SPO-235 arranca sobre ella.
- **SPO-227 y SPO-229 se mergean juntas** (o SPO-229 enseguida): con SPO-227 sola, el back exige coordenadas que el wizard
  todavía no manda.
- **SPO-226 agrega los 8 valores del enum `NotificationType`.** SPO-231 y SPO-236 notifican con tipos que crea SPO-226.
- **SPO-228 → SPO-231 → SPO-234 → SPO-236** son del mismo dev y en cadena. SPO-238 necesita el puntaje de SPO-234.
- **SPO-241 depende de SPO-228 y SPO-236** (otra lane). Plan B: arrancar por la UI con datos de prueba.

## Definición de terminado de la semana

Contra `dev`, con dos cuentas (A organiza, B juega) y los datos del seed:

1. Iniciar sesión → la app abre en **`/mapa`**, centrada en tu ubicación (o en el centroide si no das permiso),
   con los partidos disponibles como pines.
2. Filtrar por "Hoy", por un nivel, por un deporte y por "Cerca": los pines cambian. Tocar un pin → detalle.
3. Crear un partido: en "Lugar" escribir una dirección, elegirla del autocompletado, arrastrar el pin. El
   partido aparece en el mapa de la cuenta B.
4. Con B, pedir sumarse → A ve el badge en la campanita. A acepta → B recibe "Solicitud aceptada". A edita la
   hora → B recibe "Partido editado". B se baja → A recibe "Un jugador se bajó". A cancela otro partido → los
   anotados y los que tenían solicitud reciben "Partido cancelado" con el motivo.
5. Un partido jugado (del seed): A marca a B como falta en "¿Faltó alguien?" → B recibe "Te marcaron falta",
   su perfil muestra "Faltas (90 días): 1" y su puntaje baja.
6. Con una cuenta del seed que tiene 2 faltas recientes, sumar la tercera → queda suspendida: "Pedir sumarme"
   y "Crear partido" deshabilitados con el mensaje, y la API responde 403.
7. Calificar un partido jugado hace más de 48 h → no se puede.
8. Descubrir muestra primero los partidos del nivel que más jugás.

## Riesgos

- **Semana cargada a propósito (35 SP sobre 18).** Si no entra todo, lo primero que se corre a la semana 9
  es **SPO-238** (compatibilidad) y después **SPO-240** y **SPO-239** (filtros). Ninguno rompe la demo del Mapa ni de las
  notificaciones.
- **Varios tickets tocan `back/src/matches/`** (SPO-226, SPO-234, SPO-238, SPO-227, SPO-232). Van a tener conflictos chicos en
  `matches.service.ts` y `matches.repository.ts`. Mergear en el orden de la tabla y rebasear.
- **Dependencias externas gratuitas** (tiles de CARTO/OSM y Photon de Komoot). Tienen uso razonable y sin SLA.
  Si Photon falla, no se puede publicar un partido nuevo, porque requiere coordenadas.
- **La campanita no tiene diseño.** SPO-230 y SPO-233 se construyen con los componentes del repo y el ícono en el lugar
  acordado. Si llega el diseño, se ajusta el estilo, no la lógica.

---

# Back — Nacho (Ignacio Pacheco) · 13 SP

## SPO-226 · Disparadores de notificaciones: los 6 eventos de partidos y solicitudes · 3 SP

**Referencia:** RF-05 · WBS 11.1.3 · 6.2.6

**Descripción**

El módulo `notifications` existe (SPO-221) con `NotificationsService.notify()` exportado, pero **nadie lo
llama**: hoy no se crea ninguna notificación fuera del seed. Este ticket conecta los eventos de partidos y
solicitudes con `notify()` y amplía el enum con los tipos que faltan. Así la campanita (SPO-230 y SPO-233) muestra
actividad real. Las reglas de quién recibe qué están en `docs/reglas-de-negocio.md` §6.

**Pasos**

1. `back/prisma/schema.prisma`: sumar al enum los cuatro tipos nuevos (dos se usan acá; SPO-231 y SPO-236 usan los otros
   dos):

```prisma
enum NotificationType {
  JOIN_REQUEST_RECEIVED
  JOIN_REQUEST_ACCEPTED
  JOIN_REQUEST_REJECTED
  MATCH_CANCELED
  PARTICIPANT_LEFT
  MATCH_UPDATED
  NO_SHOW_CONFIRMED
  USER_SUSPENDED

  @@map("notification_type")
}
```

   Migración: `npm run db:migrate -- --name add_notification_types`.

2. Importar `NotificationsModule` en `back/src/join-requests/join-requests.module.ts` y en
   `back/src/matches/matches.module.ts` (hoy solo importan `UsersModule`), e inyectar `NotificationsService`
   en los dos services.

3. Disparadores. En todos, **la notificación se crea después de que la escritura principal salió bien**, y
   nunca al actor (`actorId` = quien hizo la acción):

| Evento | Dónde | `type` | Destinatarios | `payload` |
|---|---|---|---|---|
| Pedir sumarse | `JoinRequestsService.create` | `JOIN_REQUEST_RECEIVED` | organizador | — |
| Aceptar | `JoinRequestsService.update` (rama accept) | `JOIN_REQUEST_ACCEPTED` | el jugador de la solicitud | — |
| Rechazar | `JoinRequestsService.update` (rama reject) | `JOIN_REQUEST_REJECTED` | el jugador | — |
| Cancelar partido | `MatchesService.cancel` | `MATCH_CANCELED` | anotados + solicitudes `PENDING` | `{ reason }` |
| Bajarse | `MatchesService.leave` | `PARTICIPANT_LEFT` | organizador | — |
| Editar | `MatchesService.update` | `MATCH_UPDATED` | anotados + solicitudes `PENDING` | `{ changed: ['date' \| 'location'] }` |

   - `MATCH_UPDATED` se dispara **solo** si cambió `date` o `location` respecto del partido antes de
     editar. Si solo cambió `description` o `capacity`, no se notifica.
   - Para "anotados + solicitudes pendientes", agregar en `MatchesRepository` un método que devuelva los
     `userId` de `participants` y de `joinRequests` con `status: 'PENDING'`. **En `cancel` se leen antes de
     cancelar.**

4. Varias notificaciones de una vez: agregar `notifyMany(inputs: CreateNotificationInput[])` en
   `NotificationsService`, con `createMany` en `back/src/notifications/notifications.repository.ts`.

5. **Una notificación que falla no rompe la acción.** Envolver el `notify` en un `try/catch` que loguea con
   el `Logger` de Nest (`this.logger.warn(...)`) y sigue. La acción del usuario ya se guardó.

6. `back/prisma/seed.ts`: el bloque de notificaciones del usuario `SEED_DEMO_EMAIL` pasa a tener un ejemplo
   de cada uno de los 6 tipos de este ticket (dos leídos), para que SPO-233 tenga datos.

**Criterios de aceptación**

- [ ] Migración nueva y `npm run db:migrate` limpio; el enum tiene los 8 valores.
- [ ] Pedir sumarse → el organizador tiene un `JOIN_REQUEST_RECEIVED` con `actor` = el jugador y `match` embebido (`GET /notifications`).
- [ ] Aceptar y rechazar → el jugador recibe `JOIN_REQUEST_ACCEPTED` o `JOIN_REQUEST_REJECTED`.
- [ ] Cancelar → cada anotado **y** cada jugador con solicitud pendiente recibe `MATCH_CANCELED` con `payload.reason` igual al motivo. El organizador no recibe nada.
- [ ] Bajarse → el organizador recibe `PARTICIPANT_LEFT`.
- [ ] Editar la hora o el lugar → anotados y pendientes reciben `MATCH_UPDATED`. Editar solo la descripción o el cupo → nadie recibe nada.
- [ ] Si la acción principal falla (409, 403, 404…), no se crea ninguna notificación.
- [ ] Si `notify` tira un error, la acción responde igual que antes y el error queda en el log.
- [ ] `NotificationsService` sigue siendo la única vía para crear notificaciones; ningún service importa `PrismaService`.
- [ ] Ningún `.spec.ts` nuevo. `npm run test:e2e` (join-requests) sigue pasando. `npm run lint` y `npm run build` pasan.

**Notas**

* Todo en inglés (QA-10). Los textos visibles de cada tipo los arma el front (SPO-233); el back manda el tipo y los datos.
* Fuera de alcance: mail, push (semana 10), el recordatorio antes del partido (11.1.4) y los tipos `NO_SHOW_CONFIRMED` y `USER_SUSPENDED`, que se agregan acá pero se disparan en SPO-231 y SPO-236.
* Misma estructura de inyección entre módulos que `UsersModule` → `MatchesModule`. No hay dependencia circular: `NotificationsModule` solo importa `UsersModule`.

**Bloqueado por:** —

---

## SPO-228 · Faltas: modelo `NoShowReport` y marcarlas en el envío de la calificación · 2 SP

**Referencia:** RF-06 · WBS 6.4.3

**Descripción**

Primera mitad de la regla de faltas de `docs/reglas-de-negocio.md` §2: guardar **quién marcó a quién**. Las
faltas se marcan **en el mismo envío de la calificación**, que sigue siendo único por jugador y partido.
Cuándo una marca pasa a ser falta, la ventana de 48 h y el descarte de estrellas van en SPO-231.

**Pasos**

1. Modelo nuevo en `back/prisma/schema.prisma`:

```prisma
model NoShowReport {
  id             String   @id @default(cuid())
  matchId        String
  match          Match    @relation(fields: [matchId], references: [id], onDelete: Cascade)
  reporterId     String
  reporter       User     @relation("NoShowReportsGiven", fields: [reporterId], references: [id])
  reportedUserId String
  reportedUser   User     @relation("NoShowReportsReceived", fields: [reportedUserId], references: [id])
  createdAt      DateTime @default(now())

  @@unique([matchId, reporterId, reportedUserId])
  @@index([reportedUserId])
  @@map("no_show_reports")
}
```

   Más las relaciones inversas en `User` y `Match`. Migración: `npm run db:migrate -- --name add_no_show_reports`.

2. `GET /matches/:matchId/ratings/pending` (`back/src/ratings/ratings.service.ts`, `findPending`) suma
   `players`: **todos** los anotados más el organizador, **menos el que pregunta**. Es la lista del paso
   "¿Faltó alguien?". `getAssignment` ya arma esa lista (`players`); solo hay que devolverla sin el usuario.

```ts
return { matchId, targets: alreadySubmitted ? [] : targets, players: alreadySubmitted ? [] : others };
```

3. `POST /matches/:matchId/ratings` acepta `noShowUserIds`. En
   `back/src/ratings/dto/create-ratings.dto.ts` agregar
   `@IsOptional() @IsArray() @ArrayUnique() @IsString({ each: true }) noShowUserIds?: string[]`.
   - Cada id tiene que ser un jugador del partido y distinto del que envía → si no, **400**.
   - `ratings` tiene que cubrir **los targets asignados menos los marcados como falta**. A quien marqué no
     lo califico. Ajustar `assertMatchesAssignment`.
   - "Ya envié" pasa a ser `ratings dados > 0 || reportes dados > 0`. Si todos mis targets faltaron, igual
     cuenta como envío → **409** al repetir.
   - Guardar calificaciones y reportes en **una sola transacción** en `back/src/ratings/ratings.repository.ts`.

4. `back/prisma/seed.ts`: un partido jugado hace un día con el usuario demo y 3 jugadores, sin calificar,
   para probar el flujo entero.

**Criterios de aceptación**

- [ ] Migración nueva y `npm run db:migrate` limpio; `\dt` muestra `no_show_reports`.
- [ ] `GET …/ratings/pending` devuelve `players` con todos los del partido menos yo, organizador incluido.
- [ ] Un envío con `noShowUserIds: [B]` guarda el reporte y las estrellas del resto de mis targets.
- [ ] Marcarse a uno mismo, o marcar a alguien que no está en el partido → **400**.
- [ ] Mandar estrellas a alguien que marqué, o no mandar a un target no marcado → **400**.
- [ ] Segundo envío del mismo jugador → **409**, aunque el primero haya tenido solo reportes.
- [ ] Si falla la escritura, no queda ni la calificación ni el reporte (transacción).
- [ ] Partido cancelado → **400**, como hoy. Sin token → **401**. Jugador ajeno al partido → **403**.
- [ ] Ningún `.spec.ts`, el service no importa `PrismaService`, `npm run lint` y `npm run build` pasan.

**Notas**

* Todo en inglés: "falta" es `noShow` en código y "Falta" en la UI.
* Fuera de alcance: deshacer una marca (no se puede, regla del PO). La UI es de SPO-241: coordinar con Juanfra la
  forma de `players` y de `noShowUserIds` apenas esté el DTO.

**Bloqueado por:** —

---

## SPO-231 · Falta confirmada, ventana de cierre de 48 h y descarte de estrellas · 2 SP

**Referencia:** RF-06 · WBS 6.4.3

**Descripción**

Segunda mitad de la regla de faltas (`docs/reglas-de-negocio.md` §1–2): una marca pasa a ser **falta** cuando
la hizo el organizador o al menos 2 jugadores, el jugador se entera por notificación, calificar y marcar
tienen una **ventana de cierre de 48 h**, y las estrellas de un partido con falta se descartan.

**Pasos**

1. Ventana de cierre en `back/src/ratings/ratings.service.ts` (`getAssignment`): después del chequeo de
   "has not been played yet", agregar:

```ts
const RATING_WINDOW_MS = 48 * 60 * 60 * 1000;

if (Date.now() > match.date.getTime() + RATING_WINDOW_MS) {
  throw new BadRequestException('The rating window is closed');
}
```

   Y en `back/src/matches/matches.service.ts`, `toRatingPending` devuelve `null` fuera de la ventana, para
   que el aviso de "partidos sin calificar" (SPO-218) no lo muestre.

2. **La falta existe** si hay un reporte del organizador del partido, o reportes de al menos 2 jugadores
   distintos. Helper en `RatingsRepository`: `findConfirmedNoShows(matchId): Promise<string[]>`, que devuelve
   los `reportedUserId` con falta.

3. Al terminar un envío (SPO-228): comparar las faltas **antes** y **después** del envío y, para cada jugador que
   **acaba de pasar** a tener falta, `notify({ type: 'NO_SHOW_CONFIRMED', userId, matchId })`, sin `actorId`
   (la marca es anónima). `RatingsModule` importa `NotificationsModule`. Si `notify` falla, se loguea y el
   envío responde igual (mismo criterio que SPO-226).

4. Descarte de estrellas: una consulta que el puntaje (SPO-234) va a usar. Dado un usuario, sus calificaciones
   recibidas **sin** las de los partidos donde (a) él tiene falta, o (b) quien lo calificó tiene falta. Va en
   `back/src/users/users.repository.ts` (`findEffectiveReceivedScores(userId)`), porque el puntaje vive en
   `UsersService` y `UsersModule` no puede importar `RatingsModule` (ciclo: `RatingsModule` ya importa
   `UsersModule`).

5. `back/prisma/seed.ts`: un usuario del seed con **2 faltas recientes ya confirmadas** (reportes del
   organizador en dos partidos jugados), para probar la suspensión en SPO-236.

**Criterios de aceptación**

- [ ] Envío del **organizador** marcando a B → B tiene falta al instante y recibe `NO_SHOW_CONFIRMED`.
- [ ] Mismo envío hecho por **un** jugador → B todavía no tiene falta ni notificación. Cuando un **segundo** jugador lo marca → falta y notificación, **una sola vez**.
- [ ] Calificar pasadas las 48 h → **400** `The rating window is closed`; `ratingPending` es `null` en ese partido.
- [ ] `findEffectiveReceivedScores` no devuelve estrellas de partidos donde el usuario, o quien lo calificó, tiene falta (probado con el seed).
- [ ] Si `notify` falla, el envío responde **201** igual y el error queda en el log.
- [ ] Ningún `.spec.ts`, el service no importa `PrismaService`, `npm run lint` y `npm run build` pasan.

**Notas**

* Todo se calcula al leer; no hay jobs. Lo que no llega al umbral en 48 h se pierde (regla del PO).
* Fuera de alcance: el cálculo del puntaje (SPO-234) y la suspensión (SPO-236).

**Bloqueado por:** SPO-226, SPO-228

---

## SPO-234 · Puntaje con faltas y bajas tarde · 2 SP

**Referencia:** RF-06 · WBS 5.1.4

**Descripción**

Hoy el puntaje es un promedio simple de estrellas (`UsersService.withStats` +
`UsersRepository.aggregateReceivedRatings`). Este ticket lo reemplaza por la fórmula de
`docs/reglas-de-negocio.md` §4: faltas = 1 ★, bajas tarde = 2 ★, estrellas descartadas.

**Pasos**

1. Registrar la baja tarde del jugador. Hoy `leave` borra el `Participant`, así que hace falta guardarla:

```prisma
model LateWithdrawal {
  id        String   @id @default(cuid())
  matchId   String
  match     Match    @relation(fields: [matchId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())

  @@index([userId])
  @@map("late_withdrawals")
}
```

   Migración `add_late_withdrawals`. En `MatchesService.leave`: si faltan **menos de 2 h** para `match.date`,
   crear el registro en la misma transacción que `removeParticipant` (`back/src/matches/matches.repository.ts`).
   La **cancelación tarde del organizador** no necesita tabla: sale de `Match.canceledAt` y `Match.date`
   (menos de 2 h entre las dos).

2. Puntaje en `back/src/users/users.service.ts` (`withStats`). `UsersModule` no puede importar
   `RatingsModule` (ciclo: `RatingsModule` importa `UsersModule`), así que las consultas de estrellas
   efectivas, faltas y bajas tarde van en `back/src/users/users.repository.ts`, reusando la regla de SPO-231:

```ts
const LATE_WITHDRAWAL_SCORE = 2;
const NO_SHOW_SCORE = 1;

const scores = [
  ...effectiveReceivedScores,
  ...Array(noShowCount).fill(NO_SHOW_SCORE),
  ...Array(lateWithdrawalCount + lateCancelCount).fill(LATE_WITHDRAWAL_SCORE),
];
const rating = scores.length === 0 ? null : Math.round(avg(scores) * 10) / 10;
```

   `ratingCount` sigue contando solo calificaciones reales (las estrellas efectivas).

3. Exponer `UsersService.getScores(userIds: string[])`, que calcula el puntaje de varios usuarios en una sola
   pasada. Lo usa SPO-238.

**Criterios de aceptación**

- [ ] Un jugador con estrellas 5 y 4 y una falta → puntaje `(5+4+1)/3 = 3.3`.
- [ ] Bajarse a 1 h 59 min del inicio → se registra la baja tarde y el puntaje suma un 2. A 2 h 01 min → no.
- [ ] El organizador que cancela a menos de 2 h → su puntaje suma un 2.
- [ ] Las estrellas de un partido donde el jugador tuvo falta (dadas y recibidas) no cuentan.
- [ ] Sin datos → `rating: null` (se muestra `—`), no 0.
- [ ] Ningún `.spec.ts`, el service no importa `PrismaService`, `npm run lint` y `npm run build` pasan.

**Notas**

* Todo se calcula al leer: no hay jobs ni columnas denormalizadas.
* Fuera de alcance: la suspensión (SPO-236) y la UI (SPO-241).

**Bloqueado por:** SPO-231

---

## SPO-236 · Suspensión por reincidencia: 7 días, 6 meses y 403 · 2 SP

**Referencia:** RF-06 · WBS 5.1.4

**Descripción**

La suspensión de `docs/reglas-de-negocio.md` §5: 3 faltas en 90 días suspenden 7 días, y 6 meses si reincide
dentro de los 12 meses. Mientras dura, la API rechaza pedir sumarse y crear partidos con **403**. El perfil
expone las faltas recientes y, solo al dueño, la suspensión.

**Pasos**

1. Suspensión como función pura en `back/src/utils/no-shows/suspension.ts`, igual que
   `back/src/utils/time/week-streak.ts`:

```ts
export const suspendedUntil = (noShowDates: Date[], now = new Date()): Date | null
```

   - `noShowDates`: el momento en que cada falta pasó a existir (el `createdAt` del reporte que completó el
     umbral), ordenados.
   - Recorre en orden. Cuando junta 3 faltas dentro de 90 días, dispara una suspensión desde esa fecha: 7 días,
     o **6 meses** si la suspensión anterior empezó hace menos de 12 meses. Las faltas que dispararon una
     suspensión no se vuelven a contar.
   - Devuelve el fin de la suspensión vigente, o `null`.
   - Constantes con nombre: `WINDOW_DAYS = 90`, `THRESHOLD = 3`, `FIRST_DAYS = 7`, `REPEAT_MONTHS = 6`,
     `REPEAT_WINDOW_MONTHS = 12`.

2. `UsersService.getSuspendedUntil(userId)`, y usarlo:
   - en `JoinRequestsService.create` y `MatchesService.create`: si hay suspensión vigente →
     `ForbiddenException('You are suspended until <ISO date>')`;
   - en `stats`: `noShowCount90d` (faltas en los últimos 90 días) en `GET /users/me` y `GET /users/:id`, y
     `suspendedUntil` **solo** en `GET /users/me`.

3. Notificación `USER_SUSPENDED`: en el mismo punto donde SPO-231 notifica `NO_SHOW_CONFIRMED`, si con esa falta
   `suspendedUntil` pasa de `null` a una fecha, `notify({ type: 'USER_SUSPENDED', userId, payload: { until } })`.

**Criterios de aceptación**

- [ ] Usuario del seed con 2 faltas + una tercera → `suspendedUntil` = fecha de la tercera + 7 días, y recibe `USER_SUSPENDED`.
- [ ] Mientras está suspendido: `POST /matches/:id/join-requests` y `POST /matches` → **403** con la fecha. Bajarse, cancelar los suyos y calificar → funcionan.
- [ ] Reincidencia dentro de los 12 meses → 6 meses. Pasados 12 meses sin suspensiones → vuelve a 7 días (probado a mano con fechas fijas en la función pura).
- [ ] `GET /users/:id` de otro jugador trae `noShowCount90d` pero **no** `suspendedUntil`.
- [ ] Ningún `.spec.ts`, el service no importa `PrismaService`, `npm run lint` y `npm run build` pasan.

**Notas**

* Fuera de alcance: levantar una suspensión a mano, apelar y avisar antes de la suspensión.
* La UI (perfil y CTAs deshabilitados) es de SPO-241.

**Bloqueado por:** SPO-231, SPO-234

---

## SPO-238 · Descubrir ordenado por compatibilidad · 2 SP

**Referencia:** RF-04 · WBS 7.1.3

**Descripción**

`GET /matches` (Descubrir) hoy ordena solo por fecha (`MatchesRepository.findUpcoming`, `orderBy: { date:
'asc' }`). Este ticket aplica el orden por **compatibilidad** de `docs/reglas-de-negocio.md` §9. Para la app
es una caja negra: la respuesta tiene la misma forma, solo cambia el orden.

**Pasos**

1. Nivel preferido del jugador: el `level` más frecuente de sus partidos jugados (organizados o anotados,
   `status: 'ACTIVE'`, fecha pasada). Método nuevo en `MatchesRepository`, con `groupBy` por `level`. Si no
   jugó ninguno → `null`.
2. Puntaje de cada organizador del listado: usar `UsersService.getScores` de SPO-234, en **una sola pasada**
   para todos los `organizerId` distintos (no uno por partido).
3. En `MatchesService.findUpcoming`, después del filtro de cupo, ordenar:

```ts
matches.sort((a, b) =>
  Number(b.level === preferredLevel) - Number(a.level === preferredLevel) ||
  (scoreOf(b.organizerId) ?? 0) - (scoreOf(a.organizerId) ?? 0) ||
  a.date.getTime() - b.date.getTime(),
);
```

4. Si llegan filtros (SPO-232), el orden se aplica igual sobre el resultado filtrado.

**Criterios de aceptación**

- [ ] Un jugador que jugó sobre todo partidos "Intermedio" ve primero los "Intermedio" en `GET /matches`.
- [ ] A igual nivel, primero el organizador con mejor puntaje; a igual puntaje, el más próximo.
- [ ] Un jugador sin partidos jugados ve el orden por puntaje del organizador y fecha.
- [ ] La respuesta tiene exactamente la misma forma que antes; el front no cambia.
- [ ] No hay una consulta por partido para el puntaje (revisar con el log de Prisma).
- [ ] Ningún `.spec.ts`, `npm run lint` y `npm run build` pasan.

**Notas**

* El próximo sprint se puede cambiar el algoritmo sin tocar el front. Dejar el orden en un método privado
  con nombre (`sortByCompatibility`) para que se reemplace fácil.
* Si no entra esta semana, es el primer ticket que se corre a la semana 9.

**Bloqueado por:** SPO-234

---

# Front — Juanchi (Juan Rudolph) · 12 SP

## SPO-230 · Campanita con contador de no leídas · 2 SP

**Referencia:** RF-05 · WBS 11.2.1

**Descripción**

El back ya guarda notificaciones y SPO-226 las dispara. Falta verlas. Este ticket agrega la **campanita** con el
contador de no leídas; la pantalla con la lista es SPO-233. Todavía no hay diseño en Figma: se construye con los
componentes del repo, en el lugar acordado (`docs/reglas-de-negocio.md` §6). Si llega el diseño, se ajusta
el estilo.

**Pasos**

1. `front/src/types/notification.ts`: el tipo que devuelve el back (ver SPO-221) y los 8 tipos:

```ts
export type NotificationType =
  | 'JOIN_REQUEST_RECEIVED' | 'JOIN_REQUEST_ACCEPTED' | 'JOIN_REQUEST_REJECTED'
  | 'MATCH_CANCELED' | 'PARTICIPANT_LEFT' | 'MATCH_UPDATED'
  | 'NO_SHOW_CONFIRMED' | 'USER_SUSPENDED';

export type AppNotification = {
  id: string;
  type: NotificationType;
  readAt: string | null;
  createdAt: string;
  payload: Record<string, unknown> | null;
  actor: PublicUser | null;
  match: { id: string; date: string; location: string; status: 'ACTIVE' | 'CANCELED'; sport: Sport } | null;
};
```

2. `front/src/lib/notifications.ts`, siempre con `apiFetch`: `fetchNotifications()` (`GET /notifications`),
   `fetchUnreadCount()` (`GET /notifications/unread-count`), `markAsRead(id)` (`PATCH
   /notifications/:id/read`) y `markAllAsRead()` (`PATCH /notifications/read-all`).

3. `front/src/hooks/use-unread-count.ts`: pide el contador al montar, **cada 30 s** con `setInterval`, y al
   volver a la pestaña (`visibilitychange`). Misma forma de estado que `front/src/hooks/use-my-matches.ts`
   (`loading`, `error`, `refresh`). No se suma TanStack Query en este ticket.

4. Componente `front/src/components/notifications/notification-bell.tsx`: `IconButton` de
   `front/src/components/ui/icon-button.tsx` con `Bell` de `lucide-react`, un badge con el número (más de 9
   → "9+") y `aria-label="Notificaciones, N sin leer"`. Link a `/notificaciones`.
   - **Desktop:** en `front/src/components/top-nav-bar.tsx`, a la izquierda del avatar.
   - **Mobile:** va en el header del Mapa, que lo monta SPO-237. Este ticket deja el componente listo.
   - **Badge en el tab de Perfil** (`front/src/components/tab-bar.tsx`): un punto con el número sobre el
     ícono de Perfil cuando hay no leídas.

**Criterios de aceptación**

- [ ] En desktop, la campana está a la izquierda del avatar con el número de no leídas; sin no leídas, sin badge; más de 9 → "9+".
- [ ] En mobile, el tab de Perfil muestra el badge cuando hay no leídas.
- [ ] Una notificación nueva aparece en el contador en menos de 30 s sin recargar, y al volver a la pestaña.
- [ ] Si la API falla, la campana se ve sin badge y no rompe el header.
- [ ] Se ve bien a 375px; capturas de la campana en desktop y del badge en mobile (QA-05).
- [ ] `apiFetch` y nunca `fetch` pelado, cero colores sueltos (tokens de `src/design-system/tokens/`), `padding` y `gap` en vez de `margin`, UI en castellano, código en inglés. `npm run lint` y `npm run build` pasan.

**Notas**

* **Plan B si SPO-226 no está mergeado:** el seed de SPO-221 ya trae tres notificaciones; arrancar con esas.
* El intervalo de 30 s es provisorio hasta que se decida TanStack Query (BUG-9, fuera de esta semana).

**Bloqueado por:** SPO-226 (con plan B)

---

## SPO-233 · Centro de notificaciones: pantalla `/notificaciones` · 2 SP

**Referencia:** RF-05 · WBS 11.2.1

**Descripción**

La pantalla a la que lleva la campanita (SPO-230): la lista de notificaciones con un texto en castellano para
cada tipo, marcar como leída y "Marcar todas como leídas".

**Pasos**

1. Pantalla `front/src/app/(app)/notificaciones/page.tsx`: título "Notificaciones", botón "Marcar todas como
   leídas", y la lista. Hook `front/src/hooks/use-notifications.ts` sobre `fetchNotifications()` de SPO-230.

2. Cada fila es `front/src/components/notifications/notification-row.tsx`: avatar del actor
   (`front/src/components/user-avatar.tsx`) o ícono del deporte si no hay actor, texto, tiempo relativo ("hace
   5 min") y un punto si no está leída. **Textos en castellano, uno por tipo:**

| Tipo | Texto |
|---|---|
| `JOIN_REQUEST_RECEIVED` | **{actor}** quiere sumarse a tu partido de {deporte} |
| `JOIN_REQUEST_ACCEPTED` | **{actor}** te aceptó en el partido de {deporte} |
| `JOIN_REQUEST_REJECTED` | Tu solicitud para {deporte} no fue aceptada |
| `MATCH_CANCELED` | Se canceló el partido de {deporte} · Motivo: {payload.reason} |
| `PARTICIPANT_LEFT` | **{actor}** se bajó de tu partido de {deporte} |
| `MATCH_UPDATED` | Cambió la fecha o el lugar del partido de {deporte} |
| `NO_SHOW_CONFIRMED` | Te marcaron una falta en el partido de {deporte} |
| `USER_SUSPENDED` | Estás suspendido hasta el {payload.until} por faltas |

3. Tocar una fila → `markAsRead(id)` y navegar a `/partidos/{match.id}`, o a `/perfil` si no tiene partido.
   Al volver, el contador de la campana baja (`refresh` de `use-unread-count`).

4. Estados: skeleton mientras carga (`front/src/components/ui/skeleton.tsx`), error con reintento, y vacío con
   `front/src/components/ui/empty-state.tsx` ("No tenés notificaciones").

**Criterios de aceptación**

- [ ] `/notificaciones` lista las del usuario de la más nueva a la más vieja, con el texto correcto para cada tipo (los 6 del seed de SPO-226; los dos de faltas, con SPO-231 y SPO-236 o datos de prueba).
- [ ] Tocar una no leída la marca como leída, lleva al partido y el contador baja.
- [ ] "Marcar todas como leídas" deja el contador en 0 y quita los puntos.
- [ ] Estados de loading, error y vacío.
- [ ] Se ve bien a 375px; captura de la pantalla con notificaciones leídas y no leídas (QA-05).
- [ ] `apiFetch`, cero colores sueltos, `padding`/`gap`, UI en castellano, código en inglés. `npm run lint` y `npm run build` pasan.

**Notas**

* Fuera de alcance: push (semana 10), borrar notificaciones y preferencias.

**Bloqueado por:** SPO-230

---

## SPO-235 · Mapa (pantalla 03): partidos disponibles como pines · 2 SP

**Referencia:** RF-04 · WBS 7.3.2 · 7.3.3 · pantalla 03

**Descripción**

La pantalla 03 del diseño es el **Mapa**. Este ticket la construye en `/mapa` con los partidos disponibles
como pines por deporte; tocar un pin abre el detalle. Que sea el inicio, la ubicación del jugador y el header
van en SPO-237. Referencia de implementación: `MapScreen` en
`sportmatch-linktree/prototype/sportmatch/app/overrides.js` (pines `pinHtml`, tiles oscuros). Figma: frame
"Mobile Screens" del archivo SportMatch.

**Pasos**

1. Pantalla `front/src/app/(app)/mapa/page.tsx`, sobre `BaseMap`
   (`front/src/components/map/base-map.tsx`, lo crea SPO-227). Leaflet toca `window`: se carga con
   `next/dynamic` y `ssr: false` (leer la guía de la versión en `node_modules/next/dist/docs/`, como pide
   `front/AGENTS.md`). A pantalla completa, como el prototipo.

2. Datos: `useMatches()` de `front/src/hooks/use-matches.ts` (`GET /matches`), que trae los partidos
   disponibles. Los que no tienen `latitude`/`longitude` no se dibujan.

3. Pin por partido, como `pinHtml` del prototipo: pastilla con el nombre del deporte (`SPORT_LABEL`) y un
   punto de color por deporte, con `L.divIcon`. Los colores van como tokens nuevos en
   `front/src/design-system/tokens/colors.css` (`--sport-futbol`, `--sport-basquet`…), nunca sueltos.

4. **Tocar un pin → `/partidos/{id}`**, el detalle que ya existe (pantalla 05). Así lo resuelve el prototipo
   (`onOpen(m)`): no hay una tarjeta intermedia.

5. Encuadre inicial: `fitBounds` sobre los pines (el centroide de los partidos). La ubicación del jugador la
   agrega SPO-237.

6. Estados: loading con skeleton sobre el mapa, error con reintento, y sin partidos un `EmptyState`
   flotante ("No hay partidos cerca por ahora").

**Criterios de aceptación**

- [ ] `/mapa` muestra cada partido disponible con coordenadas como pin, con su deporte y color; los propios, los llenos y los ya pedidos no aparecen.
- [ ] Tocar un pin abre el detalle del partido.
- [ ] El mapa encuadra todos los pines al cargar.
- [ ] La atribución de OpenStreetMap/CARTO está visible (requisito de las licencias).
- [ ] Estados de loading, error y vacío.
- [ ] Se ve bien a 375px y en desktop; captura del mapa con pines (QA-05).
- [ ] `apiFetch`, cero colores sueltos, `padding`/`gap`, UI en castellano, código en inglés. `npm run lint` y `npm run build` pasan (sin errores de SSR por `window`).

**Notas**

* **Depende de SPO-227** (`BaseMap` y coordenadas en la respuesta). Plan B: arrancar con un array de partidos de
  prueba con coordenadas y conectar `useMatches` cuando llegue. Mientras tanto, cerrar SPO-230 y SPO-233.
* Descubrir (`/buscar`) no cambia.

**Bloqueado por:** SPO-227

---

## SPO-237 · El Mapa como inicio: ubicación del jugador, header y tab bar · 2 SP

**Referencia:** RF-04 · WBS 7.3.2 · pantalla 03

**Descripción**

El Mapa pasa a ser la **pantalla de inicio** (`docs/reglas-de-negocio.md` §7): la app abre ahí, se centra en
el jugador, y el tab bar sigue el orden del diseño. Además monta el header flotante con la campana, que es su
lugar en mobile.

**Pasos**

1. Ubicación: `front/src/hooks/use-user-location.ts` con `navigator.geolocation.getCurrentPosition`, pedido al
   entrar al mapa. Devuelve `{ location, status: 'pending' | 'granted' | 'denied' }`. SPO-239 lo usa para "Cerca".
   - Con permiso: centrar ahí y dibujar el punto azul "estás acá" del prototipo.
   - Sin permiso o con error: queda el encuadre de SPO-235 (centroide de los partidos).
   - Sin partidos y sin permiso: un centro por defecto en una constante con nombre.
   - Botón "Centrar" abajo a la derecha (`IconButton` glass), como el prototipo: vuelve a la ubicación del
     jugador. Si no hay ubicación, no se muestra.

2. Header flotante arriba: el espacio del buscador y del botón de filtros (los completan SPO-239 y SPO-240), y la
   **campana** `NotificationBell` de SPO-230.

3. **El Mapa pasa a ser el inicio:**
   - `front/src/hooks/use-redirect-if-authenticated.ts`: `HOME_ROUTE = '/mapa'`.
   - `front/src/lib/nav-items.ts`: el ítem Mapa pasa a `enabled: true`, y el orden sigue al diseño:
     **Mapa · Descubrir · + · Partidos · Perfil**. Revisar que `front/src/components/tab-bar.tsx`
     (`LEFT_ITEMS`/`RIGHT_ITEMS`) y `top-nav-bar.tsx` respeten el orden nuevo.
   - Revisar los links que hoy llevan a `/buscar` como inicio (logo de `top-nav-bar.tsx`, landing) y pasarlos
     a `/mapa`.

**Criterios de aceptación**

- [ ] Después de iniciar sesión, la app abre en `/mapa`.
- [ ] El tab bar muestra Mapa · Descubrir · + · Partidos · Perfil, con Mapa habilitado y activo en `/mapa`. Ya no aparece "Próximamente".
- [ ] Con permiso de ubicación, el mapa se centra en el jugador con el punto azul, y "Centrar" vuelve ahí. Sin permiso, queda en el centroide de los partidos y no hay botón "Centrar".
- [ ] La campana de SPO-230 aparece en el header del mapa en mobile.
- [ ] Se ve bien a 375px; captura del header con la campana y del punto "estás acá" (QA-05).
- [ ] Cero colores sueltos, `padding`/`gap`, UI en castellano, código en inglés. `npm run lint` y `npm run build` pasan.

**Notas**

* Fuera de alcance: el buscador y los filtros (SPO-239 y SPO-240).

**Bloqueado por:** SPO-235, SPO-230

---

## SPO-239 · Filtros del Mapa: chips de día, nivel y "Cerca" · 2 SP

**Referencia:** RF-04 · WBS 7.1.2 · pantalla 03

**Descripción**

Los filtros del diseño viven **solo en el Mapa**. Este ticket arma la fila de chips (día, nivel y cercanía) y
la conecta a los filtros que SPO-232 agrega a `GET /matches`. La hoja "Filtros" con deporte y el buscador son
SPO-240. Reglas de cada chip: `docs/reglas-de-negocio.md` §7. Referencia: `MapScreen` en
`sportmatch-linktree/prototype/sportmatch/app/overrides.js`.

**Pasos**

1. `FilterChip` en `front/src/components/ui/filter-chip.tsx`, como lo define `front/DESIGN.md` (altura 38,
   `aria-pressed`, ícono opcional). Se crea en `components/ui/` porque el diseño lo usa en varias pantallas
   (QA-09).

2. Fila de chips en el header del mapa (SPO-237), con scroll horizontal, en este orden: **Cerca** (ícono
   navigation) · **Hoy** · **Esta noche** · **Mañana** · **Fin de semana** · **Principiante** · **Intermedio**
   · **Avanzado**.
   - Los chips de día son excluyentes entre sí; el resto se combina.
   - "Cerca" está deshabilitado si no hay ubicación (`use-user-location` de SPO-237), con el texto "Activá tu
     ubicación".
   - **Sin** "Lugares libres" ni "Casual" (reglas de negocio §7).

3. Traducir los chips a query params en `front/src/lib/map-filters.ts`, con las fechas en hora de Argentina
   (`America/Argentina/Buenos_Aires`, como `back/src/utils/time/week-streak.ts`):

| Chip | Query |
|---|---|
| Hoy | `from` = ahora, `to` = hoy 23:59 |
| Esta noche | `from` = hoy 19:00 (o ahora si ya pasó), `to` = hoy 23:59 |
| Mañana | `from` = mañana 00:00, `to` = mañana 23:59 |
| Fin de semana | `from`/`to` = el próximo sábado 00:00 → domingo 23:59 (si hoy es sábado o domingo, este mismo) |
| Nivel | `level=INTERMEDIATE` (varios: `level=BEGINNER&level=ADVANCED`) |
| Cerca | `lat`, `lng`, `radiusKm=5` |

   `fetchMatches(filters?)` en `front/src/lib/matches.ts` arma el query string; sin filtros sigue pidiendo
   `/matches` como hoy (Descubrir no cambia).

4. Cambiar un chip vuelve a pedir los partidos y redibuja los pines. Sin resultados → `EmptyState` flotante
   "No hay partidos con estos filtros" con "Limpiar filtros".

**Criterios de aceptación**

- [ ] Los 8 chips en ese orden. Elegir "Mañana" deselecciona "Hoy". Los niveles se combinan entre sí y con el día.
- [ ] "Hoy" muestra solo partidos de hoy; "Esta noche", solo desde las 19:00; "Fin de semana", sábado y domingo (probado con partidos del seed en esos días).
- [ ] "Cerca" muestra solo partidos a menos de 5 km; sin permiso de ubicación está deshabilitado.
- [ ] Sin resultados → estado vacío con "Limpiar filtros".
- [ ] Descubrir sigue pidiendo `/matches` sin filtros.
- [ ] Se ve bien a 375px; captura de los chips (QA-05).
- [ ] `apiFetch`, cero colores sueltos, `padding`/`gap`, UI en castellano, código en inglés. `npm run lint` y `npm run build` pasan.

**Notas**

* Plan B si SPO-232 no está: filtrar en el cliente sobre la lista de `GET /matches`, y cambiar a los query params
  cuando llegue. La interfaz de `map-filters.ts` no cambia.

**Bloqueado por:** SPO-237, SPO-232

---

## SPO-240 · Hoja "Filtros" (deporte y nivel) y "Buscá en esta zona" · 2 SP

**Referencia:** RF-04 · WBS 7.1.2 · pantalla 03

**Descripción**

El resto de los filtros del Mapa: el botón de filtros abre una **hoja "Filtros"** con deporte y nivel, como en
el prototipo, y el buscador del header mueve el mapa a una dirección.

**Pasos**

1. `BottomSheet` en `front/src/components/ui/bottom-sheet.tsx`, como lo define `front/DESIGN.md` (radio 44
   arriba, grip 40×5, `role="dialog" aria-modal`, scrim, animación de 420 ms). Se crea en `components/ui/`
   porque el diseño lo usa en varias pantallas (QA-09).

2. Botón de filtros en el header (`IconButton` con `SlidersHorizontal`) → hoja **"Filtros"**:
   - **Deporte:** `FilterChip` (SPO-239) con los deportes de `useSports()`; varios a la vez → `sportId=…&sportId=…`.
   - **Nivel:** los mismos niveles de la fila de chips, sincronizados con ella (es el mismo estado).
   - Botón **"Ver N partidos"**, donde N es el resultado con esos filtros. Al tocarlo se cierra la hoja.
   - Se suma `sportId` a `front/src/lib/map-filters.ts`.

3. **"Buscá en esta zona":** el `Input` de búsqueda del header usa el servicio de direcciones de SPO-229
   (`front/src/lib/geocoding.ts`); elegir un resultado mueve el mapa ahí (`flyTo`). **No** filtra partidos:
   solo mueve la vista.

**Criterios de aceptación**

- [ ] El botón de filtros abre la hoja con la animación; se cierra con Escape, con el scrim y con la X.
- [ ] Elegir deportes filtra los pines; los niveles de la hoja y de la fila de chips están siempre sincronizados.
- [ ] "Ver N partidos" muestra el número correcto antes de cerrar.
- [ ] "Buscá en esta zona" sugiere direcciones y mueve el mapa a la elegida.
- [ ] Se ve bien a 375px; captura de la hoja abierta y del buscador con sugerencias (QA-05).
- [ ] `apiFetch` para nuestra API, cero colores sueltos, `padding`/`gap`, UI en castellano, código en inglés. `npm run lint` y `npm run build` pasan.

**Notas**

* Si no entra esta semana, se corre a la semana 9 sin afectar al resto del Mapa.

**Bloqueado por:** SPO-239, SPO-229

---

# Back + Front — Juanfra (Juan Francisco Siaba) · 10 SP

## SPO-227 · Proveedor de mapa (Leaflet + `BaseMap`) y coordenadas en `Match` · 2 SP

**Referencia:** RF-03 · RF-04 · WBS 7.3.1

**Descripción**

El Mapa necesita coordenadas y hoy `Match.location` es texto libre (riesgo R3 del cronograma v4). Este
ticket deja la base de todo el Mapa: el proveedor en el front (Leaflet + OpenStreetMap, decisión del PO) con
un componente `BaseMap` reusable, y `latitude`/`longitude` en la base y en la API. El paso "Lugar" del wizard
es SPO-229.

**Pasos**

**PR 1 — proveedor de mapa (chica, va primero: SPO-235 arranca sobre esta)**

1. Dependencias en `front/`: `leaflet` y `@types/leaflet` (dev). **Justificación (QA-03):** Leaflet es el
   proveedor que eligió el PO (gratis, sin API key, el mismo del prototipo). No se suma `react-leaflet`: con
   un componente propio alcanza.
2. `front/src/components/map/base-map.tsx`: crea un `L.map` sobre un `ref`, con los tiles oscuros del
   prototipo, atribución visible y `zoomControl: false`. Expone el mapa por `onReady(map)` y se desmonta con
   `map.remove()`. Importar `leaflet/dist/leaflet.css`. Se usa con `next/dynamic` + `ssr: false`.
3. La URL de tiles va por variable de entorno (QA-06): `NEXT_PUBLIC_MAP_TILES_URL` en `front/.env.example`,
   con el valor del prototipo: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`.

**PR 2 — coordenadas en el back**

4. `back/prisma/schema.prisma`, en `Match`: `latitude Float?` y `longitude Float?`. Son opcionales en la base
   porque hay partidos viejos sin coordenadas. Migración: `npm run db:migrate -- --name add_match_coordinates`.
5. `back/src/matches/dto/create-match.dto.ts`: `latitude` y `longitude` **obligatorios** (`@IsLatitude()`,
   `@IsLongitude()`). `UpdateMatchDto` hereda como opcionales. Un partido nuevo sin coordenadas → **400**.
6. `back/prisma/seed.ts`: coordenadas reales para cada partido del seed (Pilar y CABA), algunos a menos de
   5 km entre sí y otros más lejos, para que el Mapa y el filtro "Cerca" tengan datos.
7. `front/src/types/match.ts`: `Match` suma `latitude: number | null` y `longitude: number | null`.

**Criterios de aceptación**

- [ ] PR 1: `BaseMap` renderiza el mapa oscuro con atribución, sin errores de SSR, y el build pasa.
- [ ] `POST /matches` sin `latitude`/`longitude` → **400**; con valores fuera de rango → **400**.
- [ ] `GET /matches` y `GET /matches/:id` devuelven `latitude` y `longitude`.
- [ ] Migración nueva y `npm run db:migrate` limpio; el seed deja todos sus partidos con coordenadas.
- [ ] Dos PRs chicas (QA-01). URL de tiles por variable de entorno (QA-06). Ningún `.spec.ts`. `npm run lint` y `npm run build` pasan en `front/` y `back/`.

**Notas**

* **Hasta que entre SPO-229, el wizard no manda coordenadas**, así que crear un partido desde la app da 400.
  Mergear SPO-227 y SPO-229 juntas en `dev`, o SPO-229 enseguida.
* La URL de tiles de CARTO es gratuita con uso razonable. Si hace falta cambiar de proveedor, se cambia la
  variable de entorno.

**Bloqueado por:** —

---

## SPO-229 · Paso "Lugar" con autocompletado de direcciones y pin arrastrable · 2 SP

**Referencia:** RF-03 · WBS 7.3.1 · pantalla 07 (Crear · Lugar)

**Descripción**

El paso "Lugar" del wizard pasa a funcionar como Google Maps: se escribe una dirección, se elige de una lista
de sugerencias y aparece un mini mapa con el pin, que se puede arrastrar para ajustar. Así cada partido nuevo
tiene coordenadas. Reglas: `docs/reglas-de-negocio.md` §8.

**Pasos**

1. Servicio de direcciones: `front/src/lib/geocoding.ts`, con **Photon** (autocompletado sobre OSM). URL por
   variable de entorno, `NEXT_PUBLIC_GEOCODING_URL=https://photon.komoot.io/api`. Debounce de 300 ms, mínimo 3
   letras, `limit=5`, sesgo a Argentina con `lat`/`lon`. SPO-240 reusa este módulo.

```ts
export type Place = { label: string; latitude: number; longitude: number };
export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]>
```

   Es un servicio externo público: se usa `fetch` con `AbortController`, no `apiFetch`, que es solo para
   nuestra API.

2. Paso "Lugar" en `front/src/components/matches/match-wizard.tsx` (hoy `step === 1`, un `TextField`):
   - Mismo campo, con una lista de sugerencias debajo mientras se escribe. Navegable con teclado (flechas y
     Enter), `role="listbox"`.
   - Al elegir: `location` = `label`, y se guardan `latitude`/`longitude` en el form.
   - Debajo aparece un **mini mapa** (`BaseMap` de SPO-227, 180 px de alto) con el pin. **El pin se puede
     arrastrar** (`draggable: true`) y al soltarlo actualiza las coordenadas. El texto no cambia.

3. `front/src/lib/match-form.ts`: `MatchForm` suma `latitude` y `longitude`. La validación exige coordenadas
   ("Elegí una dirección de la lista"), y `toCreateMatchBody` / `toUpdateMatchBody` las mandan. Al editar, el
   mapeo desde `Match` las carga y el mini mapa arranca en el pin guardado.

**Criterios de aceptación**

- [ ] Escribir "Parque Sar" en "Lugar" muestra sugerencias; elegir una muestra el mini mapa con el pin.
- [ ] Arrastrar el pin cambia las coordenadas que se guardan (verificado en la respuesta del `POST`).
- [ ] No se puede avanzar del paso "Lugar" sin elegir una dirección de la lista.
- [ ] Editar un partido abre el paso con el pin en su lugar; cambiar la dirección actualiza las coordenadas.
- [ ] Si el servicio de direcciones falla, el campo muestra "No pudimos buscar direcciones. Probá de nuevo." y no rompe el wizard.
- [ ] Se ve bien a 375px; captura del autocompletado y del mini mapa (QA-05).
- [ ] URL por variable de entorno (QA-06), cero colores sueltos, `padding`/`gap`, UI en castellano, código en inglés. `npm run lint` y `npm run build` pasan.

**Notas**

* La instancia pública de Photon es gratuita con uso razonable. Si falla, se cambia la variable de entorno.
* Fuera de alcance: geocodificar partidos viejos (reglas §8: no aparecen en el mapa).

**Bloqueado por:** SPO-227

---

## SPO-232 · Filtros de búsqueda en `GET /matches` · 3 SP

**Referencia:** RF-04 · WBS 7.1.1

**Descripción**

El Mapa filtra por día, nivel, deporte y cercanía. Los filtros van en el back, sobre el mismo `GET /matches`
de Descubrir: mismos partidos disponibles, con query params opcionales. Sin params, la respuesta es
idéntica a la de hoy (Descubrir no cambia).

**Pasos**

1. `back/src/matches/dto/find-matches-query.dto.ts`:

```ts
export class FindMatchesQueryDto {
  @IsOptional() @IsString({ each: true }) @Transform(toArray) sportId?: string[];
  @IsOptional() @IsEnum(Level, { each: true }) @Transform(toArray) level?: Level[];
  @IsOptional() @Type(() => Date) @IsDate() from?: Date;
  @IsOptional() @Type(() => Date) @IsDate() to?: Date;
  @IsOptional() @Type(() => Number) @IsLatitude() lat?: number;
  @IsOptional() @Type(() => Number) @IsLongitude() lng?: number;
  @IsOptional() @Type(() => Number) @Min(0.5) @Max(50) radiusKm?: number;
}
```

   `toArray` convierte `?level=A` y `?level=A&level=B` en un array.
2. `MatchesController.findAll` recibe `@Query() query: FindMatchesQueryDto` y lo pasa a
   `MatchesService.findUpcoming(firebaseUid, query)`.
3. `MatchesRepository.findUpcoming(userId, query)`: `sportId: { in }`, `level: { in }`, y `date` con
   `gte: max(now, from)` y `lte: to`. El `where` de disponibilidad de hoy no cambia.
4. Cercanía en el service, igual que el filtro de cupo que ya está en memoria: distancia Haversine a
   `lat`/`lng`, y quedan los que están a menos de `radiusKm` (5 por defecto si viene `lat`/`lng`). Los
   partidos sin coordenadas quedan afuera **solo** cuando se filtra por cercanía. Función pura en
   `back/src/utils/geo/distance-km.ts`.
5. Validaciones cruzadas en el service: `lat` sin `lng` (o al revés) → **400**; `from` > `to` → **400**.

**Criterios de aceptación**

- [ ] `GET /matches` sin params → exactamente lo mismo que antes.
- [ ] `?level=INTERMEDIATE&level=ADVANCED` → solo esos niveles. `?sportId=X` → solo ese deporte.
- [ ] `?from=…&to=…` → solo partidos en ese rango; nunca partidos pasados, aunque `from` sea anterior a ahora.
- [ ] `?lat=-34.45&lng=-58.91&radiusKm=5` → solo partidos a menos de 5 km (verificado con dos partidos del seed, uno a 3 km y otro a 10 km).
- [ ] `level=CASUAL` → **400**; `lat` sin `lng` → **400**; `from` > `to` → **400**; `radiusKm=100` → **400**.
- [ ] Los filtros se combinan (AND entre filtros, OR dentro de un mismo filtro).
- [ ] Ningún `.spec.ts`, el service no importa `PrismaService`, `npm run lint` y `npm run build` pasan.

**Notas**

* SPO-238 también toca `findUpcoming` (el orden). Si SPO-238 entra primero, rebasear. El orden se aplica sobre el
  resultado filtrado.
* Fuera de alcance: búsqueda por texto y por bounding box del mapa.

**Bloqueado por:** SPO-227

---

## SPO-241 · Faltas en la app: "¿Faltó alguien?", suspensión en los CTAs y en el perfil · 3 SP

**Referencia:** RF-06 · WBS 6.4.3 · 5.2.4 · pantallas 05, 12

**Descripción**

La cara visible de SPO-228, SPO-231, SPO-234 y SPO-236: marcar faltas al calificar, mostrar las faltas en el perfil, y que un jugador
suspendido no pueda pedir sumarse ni crear partidos, con un mensaje claro. Reglas:
`docs/reglas-de-negocio.md` §2 y §5.

**Pasos**

1. `front/src/lib/ratings.ts`: `RatingTargets` suma `players: PublicUser[]`, y `submitRatings` manda
   `{ ratings, noShowUserIds }`.

2. `front/src/components/ratings/rating-modal.tsx`: un **paso 0 "¿Faltó alguien?"** antes de las estrellas.
   - Lista de `players` (avatar + nombre) para tildar. Botón "Nadie faltó" / "Continuar".
   - Los targets que tildé **se saltean** en los pasos de estrellas, y el contador "1 de N" se ajusta.
   - Si tildé a todos mis targets, el modal envía directo después del paso 0.
   - Texto de ayuda: "Si el organizador o dos jugadores marcan a alguien, cuenta como falta."
   - El toast final dice cuántos calificaste y, si marcaste, "y marcaste N faltas".

3. Suspensión. `front/src/types/user.ts`: `UserStats` suma `noShowCount90d: number`, y `User` (de
   `GET /users/me`) suma `suspendedUntil: string | null` en `stats`.
   - `front/src/components/matches/match-actions.tsx`: si estoy suspendido, "Pedir sumarme" está
     deshabilitado y debajo dice **"Estás suspendido hasta el dd/mm por faltas"**.
   - `front/src/components/matches/swipe-deck.tsx`: deslizar a la derecha estando suspendido muestra el toast
     con el mismo texto y no manda la solicitud.
   - Crear partido (tab `+` y botón del header): el wizard muestra el mismo mensaje en lugar del paso 1.
   - Si igual llega un **403** de la API, se muestra el mensaje del back.

4. Perfil (`front/src/components/profile/`):
   - Propio y ajeno: si `noShowCount90d > 0`, una línea debajo de los tiles de `profile-stats.tsx`:
     "Faltas (90 días): N", con color `danger`. Con 0, no se muestra. Los tres tiles del diseño no cambian.
   - Propio: si hay suspensión vigente, un aviso arriba "Suspendido hasta el dd/mm por faltas".

**Criterios de aceptación**

- [ ] En un partido jugado dentro de las 48 h, el modal abre en "¿Faltó alguien?" con todos los jugadores menos yo, organizador incluido.
- [ ] Tildar a un target lo saltea en las estrellas; el envío manda `noShowUserIds` y las estrellas del resto.
- [ ] Con un usuario suspendido del seed: "Pedir sumarme" deshabilitado con el mensaje, el swipe a la derecha muestra el toast y no envía nada, y el wizard muestra el mensaje.
- [ ] El perfil propio muestra "Suspendido hasta…" y las faltas; el perfil ajeno muestra las faltas, pero no la suspensión.
- [ ] Con 0 faltas, el perfil se ve exactamente igual que hoy.
- [ ] Se ve bien a 375px; capturas del paso "¿Faltó alguien?", del CTA suspendido y del perfil con faltas (QA-05).
- [ ] `apiFetch`, cero colores sueltos, `padding`/`gap`, UI en castellano, código en inglés. `npm run lint` y `npm run build` pasan.

**Notas**

* **Depende de otra lane (SPO-228 y SPO-236, Nacho).** Plan B: armar el paso 0 y los estados con datos de prueba
  (`players` y `suspendedUntil` inventados en el hook) y conectar cuando estén los endpoints.
* La línea "Faltas (90 días)" no está en el Figma. Se suma debajo de los tiles para no romper el diseño de la
  pantalla 12. Si los PMs quieren otro lugar, se mueve.

**Bloqueado por:** SPO-228, SPO-236

---

# Semana 10 · 08/10 → 15/10 — sin assignee

> Se crean en Linear **sin assignee y sin `dueDate`**. Si esta semana sobra capacidad, el PO adelanta
> alguno.

## SPO-242 · Perfil editable en el back: ciudad y datos básicos · 1 SP

**Referencia:** RF-02 · WBS 5.1.1 · Label Backend

- `User` suma `city String?` (migración `add_user_city`). `UpdateUserDto` acepta `name` (2–60) y `city`
  (2–80), además de `photoUrl`. `GET /users/me` y `GET /users/:id` devuelven `city`.
- Criterios: `PATCH /users/:id` propio actualiza `name` y `city`; ajeno → **403**; `city` de 1 letra →
  **400**; `firebaseUid`/`email` en el body → **400** (como hoy). Ningún `.spec.ts`, lint y build pasan.
- Fuera de alcance: subir una foto nueva (necesita storage; se decide aparte).

## SPO-244 · Ajustes (pantalla 13) · 2 SP

**Referencia:** RF-02 · WBS 5.2.2 · Label Frontend

- Pantalla 13 **Ajustes** (`/perfil/ajustes`): "Editar perfil" (lleva a SPO-245), "Compartir perfil" (copia o
  comparte el link de `/usuarios/{id}` con la Web Share API) y "Cerrar sesión" con confirmación en dos pasos.
  Reemplaza al dropdown de `front/src/components/profile/profile-menu.tsx`.
- Referencia: `SettingsPanel` y `SettingsRow` en `sportmatch-linktree/prototype/sportmatch/app/overrides.js`.
- Criterios: las tres acciones funcionan; "Compartir perfil" usa la Web Share API en mobile y copia al
  portapapeles con un toast en desktop; se ve a 375px; capturas (QA-05); lint y build pasan.

## SPO-245 · Editar perfil (pantalla 14) · 2 SP

**Referencia:** RF-02 · WBS 5.2.2 · Label Frontend · Bloqueado por SPO-242 y SPO-244

- Pantalla 14 **Editar perfil** (`/perfil/editar`): nombre, ciudad y **cambio de contraseña** (solo cuentas
  de email: `updatePassword` de Firebase, con reautenticación). Con `AuthField`/`EditField` como indica
  `front/DESIGN.md`. Referencia: `EditProfilePanel` y `EditField` en `overrides.js`.
- Criterios: guardar actualiza el perfil sin recargar; errores de validación en castellano; con una cuenta de
  Google no se muestra el cambio de contraseña; se ve a 375px; capturas (QA-05); lint y build pasan.
- Fuera de alcance: subir una foto nueva (necesita storage; se decide aparte).

## SPO-243 · Push PWA en el back: suscripciones y envío con `web-push` · 2 SP

**Referencia:** RF-05 · WBS 11.2.2 · Label Backend

- Modelo `PushSubscription` (`userId`, `endpoint` único, `p256dh`, `auth`, `createdAt`). Endpoints
  `POST /push-subscriptions` y `DELETE /push-subscriptions` (por `endpoint`), con `FirebaseAuthGuard`. Módulo
  en 4 capas.
- Dependencia `web-push` (QA-03: el estándar Web Push, sin FCM, decisión del PO). Claves VAPID en variables
  de entorno (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`) validadas en
  `back/src/config/env.validation.ts`.
- `NotificationsService.notify`/`notifyMany` además envían un push a cada suscripción del destinatario (título
  y texto en castellano, `url` al partido). Una suscripción que responde 404/410 se borra. Si el push falla, la
  notificación in-app se guarda igual.

## SPO-246 · Push PWA en el front: manifest, service worker y "Activar notificaciones" · 3 SP

**Referencia:** RF-05 · WBS 11.2.2 · Label Frontend · Bloqueado por SPO-243

- `front/src/app/manifest.ts` (nombre, íconos 192/512, `display: standalone`, colores del tema) para que la
  app sea instalable.
- Service worker `front/public/sw.js`: recibe el push, muestra la notificación y, al tocarla, abre o enfoca
  la URL del partido.
- En `/notificaciones`, un botón **"Activar notificaciones"** que pide permiso **solo al tocarlo**, registra
  el service worker y manda la suscripción a `POST /push-subscriptions`. `NEXT_PUBLIC_VAPID_PUBLIC_KEY` por
  variable de entorno.
- Criterios: en Chrome desktop y Android, con la app cerrada, una solicitud nueva llega como notificación del
  sistema y abre el partido. Notas: **en iPhone solo funciona con la app instalada en la pantalla de inicio
  (iOS 16.4+)**; eso va en el texto de ayuda del botón.
