# Semana 7 (Sprint 2) — jueves 17/09 18h al jueves 24/09 18h

> Primera semana del **Sprint 2** (semanas 7–10, 17/09 → 15/10, cierra con el Steering 2 y el MVP funcional).
> Calendario y paquetes: `sportmatch-linktree/docs/planning/Cronograma-y-PERT-v4.md` §9. Los planes del S1
> (`Sprint 1…5/`) son históricos.
>
> Escrito el sábado 19/09: la semana arrancó el jueves sin tickets cargados.

**Capacidad:** 18 SP — 3 devs × 6 SP. 1 SP = 1 hora. Sin buffer.
**Escala:** 1 / 2 / 3 / 4. Nada de Fibonacci. Si un ticket pinta 5, se parte.
**Sprints:** mensuales, entre steerings, con semanas de jueves a jueves (18h). S2 = semanas 7–10 · S3 = 11–13
(→ 05/11) · semana 14 de reserva · entrega final 12/11.

**Semana de exámenes.** Cada dev tiene una pieza mecánica o chica y una pesada. Menos tickets, más grandes:
decisión del PO.

## Objetivo de la semana

Que el jueves 24/09 **el código esté entero en inglés, de la base de datos a los componentes, sin que el
usuario note ningún cambio**, y que el back ya tenga lo que el S2 necesita para arrancar el núcleo:
**notificaciones in-app guardadas y consultables, y partidos que el organizador cancela con una razón en lugar de
borrarse**. Además, el perfil muestra el historial completo de partidos jugados, propio y ajeno.

## Supuestos

- El S1 cerró completo: 18/18 SP en la semana 6 y todo el board en Done. No hay arrastre.
- Los datos del entorno `dev` (cargados por profesores y QA en el steering) se conservan: la migración del
  refactor renombra, no recrea.
- Lo que no es código lo hacen los PMs: diseño de la campanita, regla de
  no-show, cuenta de email `noreply`, entregables de diseño (10.1.2) y selección de proveedores (11.1.2).

## Convención de los tickets

Formato fijo (Referencia · Descripción · Pasos · Criterios · Notas · Bloqueado por). Esta semana pesa más que
nunca **QA-10**: todo lo nuevo en inglés, la UI y las URLs del front en castellano. Y **QA-01**: el refactor
se parte en PRs de menos de 1000 líneas revisables dentro del mismo ticket (Prisma / módulos en el back;
contrato / componentes en el front).

Back: 4 capas, `--no-spec`, el repository es el único que toca `PrismaService`, el service el único que lanza
excepciones HTTP. Prisma 7 con cliente desde `back/src/generated/prisma/client`. Front: `apiFetch`, nada de
colores sueltos, rutas privadas bajo `(app)`.

---

# Back — Juan Rudolph · 6 SP

| Ticket | SP | Ref | Tipo |
|---|---|---|---|
| [SPO-201](https://linear.app/sportmatch-dirproy/issue/SPO-201) · Refactor de idioma · Back completo: Prisma, módulos y rutas de la API | 4 | 2.3.1 | mecánico, **va primero** |
| [SPO-220](https://linear.app/sportmatch-dirproy/issue/SPO-220) · Solicitudes consistentes: aceptar sin pasarse del cupo (BUG-7) y bajarse limpia la solicitud (BUG-6) | 2 | 6.3.3 · 6.3.5 | chico |

SPO-201 absorbió a SPO-202 y SPO-203 (cancelados con nota). Va en dos PRs: **PR 1** schema + migración de
renombres + seed; **PR 2** carpetas, clases, contrato JSON y rutas. Ninguna se mergea sola a `dev`: rompen el
front hasta que entra SPO-204.

# Infra — Juan Francisco Siaba · 6 SP

| Ticket | SP | Ref | Tipo |
|---|---|---|---|
| [SPO-221](https://linear.app/sportmatch-dirproy/issue/SPO-221) · Notificaciones in-app: modelo `Notification` + módulo `notifications` | 3 | 11.1.1 | **pesado** |
| [SPO-222](https://linear.app/sportmatch-dirproy/issue/SPO-222) · Cancelar partido en el back: `status` + razón obligatoria en texto + `PATCH /matches/:id/cancel` | 2 | 6.1.4 | **pesado** |
| [SPO-223](https://linear.app/sportmatch-dirproy/issue/SPO-223) · Sesión inválida = logout (BUG-8) | 1 | 4.1.3 | chico |

Las notificaciones son **solo in-app** por decisión del PO: el back las guarda y la semana que viene el front
las muestra en una campanita. Push queda fuera (la app es web). Email, si entra, es un canal más sobre la
misma entidad.

# Front — Ignacio "Pache" Pacheco · 6 SP

| Ticket | SP | Ref | Tipo |
|---|---|---|---|
| [SPO-209](https://linear.app/sportmatch-dirproy/issue/SPO-209) · Historial completo de partidos jugados, en el perfil propio y en el ajeno | 2 | 5.2.3 | feature |
| [SPO-204](https://linear.app/sportmatch-dirproy/issue/SPO-204) · Refactor de idioma · Front completo: tipos, lib, hooks y componentes | 3 | — | mecánico |
| [SPO-224](https://linear.app/sportmatch-dirproy/issue/SPO-224) · Cancelar partido como organizador: dropdown de razón obligatoria ("Otro" al final) + partido cancelado en Tus partidos | 1 | 6.2.5 | feature |

SPO-204 absorbió a SPO-205 (cancelado con nota). SPO-209 se reescribió: ahora cubre también el perfil ajeno,
donde el "Ver todos" está oculto desde el Steering 1. SPO-224 es la única dependencia cruzada de la semana:
necesita el endpoint de SPO-222 (Siaba); el plan B es armar la UI con un partido de prueba y conectar después.

# PMs — fuera de la capacidad de desarrollo

| Ticket | Qué | Para cuándo |
|---|---|---|
| — | Regla de no-show (quién marca, cuánto penaliza) | antes del jueves 24, para escribir los tickets de la semana 8 |
| — | Diseño de la campanita / centro de notificaciones (el motivo de cancelación lo resuelve SPO-224 con un dropdown de razones y los componentes del repo; revisar las razones y el layout si quieren otra cosa) | antes del jueves 24 |
| — | Decidir si entran mails y, si entran, crear la cuenta `noreply` | antes del jueves 24 |

---

# Orden dentro de la semana

| | Rudolph | Siaba | Pache |
|---|---|---|---|
| **jue 17 – dom 20** | — (sin tickets hasta el sábado) · SPO-201 PR 1 | SPO-223 (no depende de nadie) | SPO-209 (sobre los nombres actuales) |
| **lun 21 – mar 22** | SPO-201 PR 1 en review → PR 2 | SPO-221 desde la rama de la PR 1 | cierra SPO-209 · arranca SPO-204 PR 1 contra la rama de SPO-201 |
| **mié 23** | SPO-220 | SPO-222 | SPO-204 PR 2 · SPO-224 |
| **jue 24, antes de las 18h** | **merge coordinado**: SPO-201 → SPO-204 → SPO-220 / SPO-221 / SPO-222 → SPO-224, en ese orden | | |

**Qué no se puede correr:**

- **SPO-201 y SPO-204 no se mergean por separado.** Las respuestas del back esparcen el objeto de Prisma, así
  que renombrar columnas ya cambia las claves del JSON: el front de `dev` queda roto entre un merge y el otro.
- **SPO-220, SPO-221 y SPO-222 se escriben sobre los nombres nuevos.** Nadie escribe código en castellano
  para "después migrarlo".

# Estado en Linear

| Dev | Tickets | SP |
|---|---|---|
| Rudolph | SPO-201 · SPO-220 | 6 |
| Siaba | SPO-221 · SPO-222 · SPO-223 | 6 |
| Pache | SPO-209 · SPO-204 · SPO-224 | 6 |
| **Total** | | **18** |

Todos en **Backlog** con `dueDate` 2026-09-24. Relaciones "blocked by": SPO-204, SPO-220, SPO-221 y SPO-222 ←
SPO-201; SPO-224 ← SPO-222 y SPO-204. SPO-202, SPO-203 y SPO-205 quedaron Canceled (fusionados).

**Pendiente:**

- **Mover los ocho tickets a Todo**: la semana ya arrancó.
- Avisarle a QA que BUG-4, BUG-9, BUG-10 y BUG-11 van a la semana 8 y que BUG-6, BUG-7 y BUG-8 entran en esta.

# Definición de terminado del sprint

Contra `dev`, después del merge coordinado del jueves:

1. Levantar la app (o entrar a `dev`) con un usuario que ya existía antes de la migración: **sus partidos,
   solicitudes y calificaciones siguen ahí**.
2. Descubrir, sumarse a un partido, pedir sumarse a otro, abrir el detalle, crear uno con el wizard, editarlo.
   **Nada se ve distinto que el jueves 17.**
3. Con otra cuenta, aceptar la solicitud. Aceptar dos en paralelo sobre el último lugar: entra una sola.
4. Bajarse de un partido y volver a pedir sumarse: funciona.
5. En el perfil, "Ver todos" muestra el historial completo agrupado por mes. En el perfil de otro jugador,
   también.
6. Como organizador, cancelar un partido desde Tus partidos, eligiendo la razón del dropdown: queda como "Cancelado"
   con el motivo, para el organizador y para los anotados, y deja de verse en Descubrir.
   Con Postman, `GET /notifications` y `GET /notifications/unread-count` responden con las notificaciones sembradas.
7. Borrar la sesión en DevTools y navegar: la app manda a `/login`.
8. `grep` de identificadores en castellano sobre `back/src` y `front/src`: solo quedan textos de UI y URLs.

# Semanas siguientes (solo títulos)

## Semana 8 · 24/09 → 01/10 — *Notificaciones visibles, cancelación completa y no-show*

- Back: disparadores de notificaciones (solicitud recibida, aceptada o rechazada, y partido cancelado) ·
  no-show y cálculo del rating con penalización (según la regla de los PMs).
- Front: campanita con contador y centro de notificaciones · BUG-4, BUG-10, BUG-11.
- Infra: TanStack Query para polling e invalidación (BUG-9).

## Semana 9 · 01/10 → 08/10 — *No-show en el front y búsqueda*

- "No vino" en el detalle del partido jugado · búsqueda con filtros por deporte, nivel y fecha (7.1.1 +
  7.1.2) · mails, si entran.

## Semana 10 · 08/10 → 15/10 — *Cierre del MVP para el Steering 2*

- Editar perfil (pantalla 14) · ordenar por compatibilidad (7.1.3) · mapa, si se decide.

# Qué queda explícitamente afuera esta semana

- El aviso a los anotados cuando se cancela un partido: lo ven en Tus partidos, pero la notificación va la
  semana que viene. Cancelar desde el detalle del partido tampoco entra.
- La campanita. El back de notificaciones existe pero nadie lo ve todavía.
- No-show y cualquier cambio al cálculo del rating.
- BUG-4 (scrollbar del paso Horario), BUG-9 (polling con TanStack), BUG-10 (foto de Google) y BUG-11 (padding
  de Descubrir).
- Push, email y preferencias de notificación. Mapa y coordenadas.
- El resto del backlog viejo (SPO-188, SPO-190, SPO-193, SPO-210): no se planifica.

# Riesgos

- **La migración de renombres pierde datos o no cierra.** Prisma genera por defecto un drop + create. Si el
  SQL de renombres se complica, el plan B es dump de datos → migración destructiva → recarga. Nunca en `dev`
  sin avisar.
- **El merge coordinado del jueves.** Cinco PRs que dependen del refactor entran el mismo día, en semana de
  exámenes. Si SPO-201 o SPO-204 no están listas el miércoles, no se mergea nada del refactor y **SPO-220,
  SPO-221, SPO-222 y SPO-224 pasan a la semana 8**, que ya viene cargada con los disparadores y la campanita.
- **Pache arranca el refactor de front recién cuando el back tiene la PR 2.** Si Rudolph se atrasa, Pache
  cierra SPO-209 y espera.
- **Semana acortada.** Los tickets se cargaron el sábado 19: los devs pierden los dos primeros días.
