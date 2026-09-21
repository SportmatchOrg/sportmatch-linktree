# PO

Traspaso escrito por Tomás Valle (PO hasta el 21/09/2026). Desde ahí pasa a tech lead / QA y sigue
disponible para dudas.

## Objetivo del rol

Decidir **qué** se construye cada semana y dejarlo ejecutable: tickets que un dev abre y ejecuta sin
preguntar, un plan semanal con capacidad, orden y riesgos, y control de avance contra el calendario. El PO
**no escribe código de producto**.

## Responsabilidades recurrentes

| Cuándo | Qué | Skill |
|---|---|---|
| Jueves (cierre de semana, 18h) | Cerrar la semana que termina y planear la que viene: tickets en Linear + plan escrito | `/semana` |
| Durante la semana | Bajar pedidos sueltos o paquetes de la WBS a tickets ejecutables | `/ticket` |
| Mitad de semana / antes de una daily o review | Cruzar plan vs Linear vs PRs y ver qué está en riesgo | `/pulse` |
| Arranque de semana | Mover a **Todo** los tickets de la semana (se crean en Backlog) | a mano |
| Antes de cada steering | Verificar a mano qué está hecho de verdad | `referencias/flujos-de-prueba.md` |

## Herramientas y accesos

**Linear** — workspace `sportmatch-dirproy` · team **Sportmatch - DirProy** (key `SPO`,
id `e7dd5c5f-9e5e-4853-8b42-c8cfcd6644f4`) · proyecto **SportMatch**
(id `1ca5132a-732a-4df2-9bd1-1fe0499370c2`).

- Backlog WBS: `SPO-6`…`SPO-30` (grupos X.X) y `SPO-31`…`SPO-112` (paquetes X.X.X). Tickets de sprint reales
  desde `SPO-135`. Capacitación: `SPO-113`…`SPO-133`.
- Labels `Infra`, `Backend`, `Frontend`, `capacitacion`. Estados Backlog → Todo → In Progress → In Review →
  Done (+ Canceled). **No hay cycles**: los sprints existen solo como documentos.
- **Canceled con nota arriba = pausado, no descartado** (SPO-160 tema visual, SPO-162 ciudad).

**GitHub** — org `SportmatchOrg`. Repo del producto `sportmatch` (PRs contra `dev`). Satélites:
`sportmatch-linktree` (este), `agents-copilot`, `sportmatch-sandbox`, `sportmatch-onboarding`.

## Cómo armar el workspace

Las skills asumen una carpeta con esta forma, y Claude Code abierto en la raíz:

```
<workspace>/
├── CLAUDE.md                 ← copiar de roles/po/workspace/CLAUDE.md
├── .claude/skills/           ← copiar roles/po/skills/{pulse,semana,ticket}
├── gestion/                  ← planificación del PO (ver abajo)
├── sportmatch/               ← git clone SportmatchOrg/sportmatch
└── sportmatch-linktree/      ← git clone SportmatchOrg/sportmatch-linktree
```

Necesita el conector de **Linear** en Claude y `gh` autenticado (`gh auth login`).

`gestion/` no está en ningún repo: es la carpeta local del PO saliente (WBS, charter, PERT, planes de
sprint). Pedírsela a Tomás. Lo mínimo para que las skills funcionen:

- `gestion/sprints/S2 (17-09 al 15-10)/Plan semana 7 (17-09 al 24-09).md` — copia en `referencias/`.
- `gestion/qa-criteria.md` — usar la versión de `roles/qa/skills/pr-review/references/qa-criteria.md`,
  que es la más nueva (QA-05 ya no lo revisa el agente).
- `gestion/WBS.md` — la versión vigente es `docs/planning/WBS-SportMatch-v4.md`.

### Las skills tienen rutas y fechas viejas

Se copiaron tal cual se usaron en el S1. Antes de correrlas, ajustar:

- **Rutas de planes.** Buscan `gestion/sprints/Sprint N/Plan sprint N (...).md`. Desde el S2 los planes son
  **por semana**: `gestion/sprints/S2 (17-09 al 15-10)/Plan semana N (dd-mm al dd-mm).md`.
- **"Contra el 17/09".** `/pulse`, `/semana` y `/ticket` miden todo contra la demo del 17/09. Ahora el hito es
  el steering del sprint en curso (15/10, después 05/11 fin de desarrollo y 12/11 entrega).
- **Plantilla de plan.** `/semana` apunta al plan del sprint 2 del S1; la plantilla actual es el de la
  semana 7 (`referencias/`).
- **Fuera de alcance.** El §6 del `CLAUDE.md` tiene la lista "hasta el 17/09"; varias cosas ya entraron
  (solicitudes con aprobación, rating, historial, swipe).

## Calendario vigente

Semanas de **jueves a jueves, 18h** (hora de la clase), numeradas desde la semana 1 (06/08).

| Tramo | Semanas | Fechas | Cierra con |
|---|---|---|---|
| S1 | 1–6 | 06/08 → 17/09 | Steering 1 (hecho) |
| **S2** | 7–10 | 17/09 → 15/10 | Steering 2 · MVP funcional |
| S3 | 11–13 | 15/10 → 05/11 | fin de desarrollo |
| Reserva | 14 | 05/11 → 12/11 | sin trabajo planificado |
| Entrega final | — | 12/11 | fin de clases |

Plan semana a semana: `docs/planning/Cronograma-y-PERT-v4.md` §9 (lo regenera `scripts/generate-v4.py`).

**Capacidad:** 3 devs × 6 SP = **18 SP por semana**. 1 SP = 1 hora. Escala 1 / 2 / 3 / 4; si pinta 5, se
parte. SP en el campo Estimate; las horas Md de la WBS van como texto en la descripción, nunca mezcladas.

**Velocity del S1:** 90 SP entregados sobre 90 de capacidad (18/16/20/18/18). El desvío del cronograma
original es de **alcance**, no de ejecución: ~32 SP de entregables que la WBS no tenía (detalle en
`docs/planning/Estado-real-WBS-15-09.md`).

## Reglas de planificación vigentes

Decisiones tomadas en el S1 y el S2. No son ley para el PO nuevo, pero cada una salió de un error concreto:

- **La semana en curso se asume cerrada completa.** Al planear la siguiente, todo lo que está en Todo / In
  Progress / In Review cuenta como Done el jueves 18h. El arrastre **no descuenta capacidad**: va a riesgos,
  con qué ticket se cae si no cierra.
- **Sin buffer.** Cada SP va a un ticket concreto. Si sobra capacidad, se busca trabajo de valor.
- **Pocos tickets y grandes.** 2–3 por dev por semana. Bugs chicos se agrupan con trabajo de la misma zona.
  Un refactor grande es un ticket de 4 SP partido en PRs de < 1000 líneas (QA-01).
- **Las pantallas se construyen como están diseñadas.** Nada de versiones "simples por ahora": se reescriben
  y cuestan el doble. Si no entra, se corre entera a la semana siguiente. Índice de las 14 pantallas:
  `generated/figma/screens-mobile.html`.
- **`qa-criteria.md` (QA-01…QA-10) es el estándar base** de los criterios de aceptación de cada ticket.
- **Código nuevo en inglés, UI en español rioplatense.** El refactor de idioma es SPO-201 (back) y SPO-204
  (front).
- **Lo que no es código lo hacen los PMs** (reglas de negocio, diseños nuevos, cuentas externas, selección de
  proveedores) y no ocupa capacidad de devs. Los SP de QA no los redacta el PO.
- **Endpoints básicos del back se quedan** aunque el front no los use; la autorización va con guards.
- **Seed en JSON por entidad** (`back/prisma/seed/data/*.json`), fechas relativas, usuarios de demo con
  emails `@demouser.sportmatch.com`.
- **Notificaciones solo in-app** (entidad en el back + campanita). Sin push; email como mucho.
- **La única fecha en Linear es el `dueDate`**: el jueves de cierre de la semana, igual para todos sus
  tickets. Nada de fechas en las descripciones. Dependencias como relaciones "blocked by" reales.
- **Escribir en Linear solo con OK explícito.** Las skills tienen el gate adentro (`/ticket` Paso 5,
  `/semana` Paso 5).

## Estado al traspaso (21/09)

Semana 7 (17/09 → 24/09) en curso: refactor de idioma completo, notificaciones in-app en el back,
cancelar partido con razón, historial completo en el perfil. 18 SP, ocho tickets con `dueDate` 2026-09-24.
Detalle, orden y riesgos: `referencias/Plan semana 7 (17-09 al 24-09).md`.

Lo que hay que mirar primero: el **merge coordinado del jueves 24** (SPO-201 → SPO-204 → el resto). Si el
refactor no llega el miércoles, SPO-220/221/222/224 pasan a la semana 8.

## Skills

En `skills/<nombre>/SKILL.md`. Se instalan copiándolas a `<workspace>/.claude/skills/`.

- **`/semana`** — cierra la semana, propone alcance, y con **un solo OK** redacta y crea los tickets en
  Linear y escribe el plan. `--solo-plan` no toca Linear (recomendado las primeras veces).
- **`/ticket`** — un ticket en el formato fijo, con cada ruta de archivo verificada contra el repo. Crea en
  Linear solo con OK.
- **`/pulse`** — radar de solo lectura: plan vs Linear vs PRs vs repo, y qué hacer hoy.

Tickets de referencia para el registro y el nivel de detalle: **SPO-155** (back), **SPO-165** (front),
**SPO-167** (infra).

## Archivos de esta carpeta

- `PENDIENTES.md` — lo que queda abierto del rol.
- `workspace/CLAUDE.md` — el contexto del workspace del PO saliente.
- `referencias/Plan semana 7 (17-09 al 24-09).md` — el plan vigente y la plantilla de los que siguen.
- `referencias/flujos-de-prueba.md` — cómo verificar a mano qué está hecho antes de una review.
