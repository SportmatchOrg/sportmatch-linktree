> **Copia del `CLAUDE.md` del workspace del PO saliente (21/09/2026).** Va en la raíz de la carpeta que
> contiene `gestion/`, `sportmatch/` y `sportmatch-linktree/`. Las secciones §2 (calendario) y parte de §6
> (alcance "hasta el 17/09") quedaron viejas: el calendario vigente está en `roles/po/README.md` y en
> `docs/planning/Cronograma-y-PERT-v4.md` §9. Actualizarlas al armar el workspace.

# SportMatch — contexto para el PO

Este workspace es el **puesto de trabajo del Product Owner** de SportMatch, un proyecto de la materia
*Dirección de Proyectos* (Universidad Austral). Tiene todo junto: la planificación en `gestion/` y el
código del producto en `sportmatch/`.

Todo lo que se produzca acá (tickets, planes, reportes) va **en español**.

---

## 1. Roles

| Persona | Rol | Área |
|---|---|---|
| Tomás Valle | PO / manager — el usuario de esta sesión | planificación, tickets, entregables |
| Juan Francisco Siaba | dev | Infra |
| Juan Rudolph | dev | Back |
| Ignacio "Pache" Pacheco | dev | Front |

El PO **no escribe código de producto**: escribe tickets, planea sprints, controla avance y prepara los
entregables de la materia. Los devs implementan.

---

## 2. Calendario

Sprints de **jueves a jueves**, de clase a clase: arrancan y cierran el jueves a las **18h**. Demo final:
**jueves 17/09 18h**, en la clase que cierra el S5. Freeze de features: viernes 11/09.

| Sprint | Ventana | Tema |
|---|---|---|
| S2 | 20/08 18h – 27/08 18h | perfil + crear partido |
| S3 | 27/08 18h – 03/09 18h | ver partidos + publicar la app |
| S4 | 03/09 18h – 10/09 18h | unirse + mis partidos |
| S5 | 10/09 18h – demo 17/09 18h | QA, pulido y demo |

Quedan **cuatro sprints, no cinco**: el último cierra con la demo en la clase del 17/09, así que el S5 es
una semana completa de QA y no queda nada después.

---

## 3. Estimación y capacidad

- **1 SP = 1 hora.** Capacidad: **6 SP por dev por semana = 18 SP por sprint.**
- Escala **1 / 2 / 3 / 4**. Nada de Fibonacci. Si un ticket pinta 5, **se parte**.
- Los SP van en el campo **Estimate** de Linear.
- Las **horas Md** de la WBS (estimación académica, otra unidad) van en el **texto de la descripción**
  (`Estimación (Md): 14h`), nunca en el campo Estimate. No mezclar las dos escalas.

---

## 4. Linear

Workspace `sportmatch-dirproy` · team **Sportmatch - DirProy** (key `SPO`, id `e7dd5c5f-9e5e-4853-8b42-c8cfcd6644f4`)
Proyecto **SportMatch** (id `1ca5132a-732a-4df2-9bd1-1fe0499370c2`) —
https://linear.app/sportmatch-dirproy/project/sportmatch-a15459aba4aa

- **10 milestones** = los módulos 1.0 … 10.0 de `gestion/WBS.md`.
- **Backlog WBS:** `SPO-6`…`SPO-30` (issues padre = grupos X.X) y `SPO-31`…`SPO-112` (sub-issues = paquetes
  X.X.X). Los tickets de sprint reales arrancan en `SPO-135`.
- **Labels:** `Infra`, `Backend`, `Frontend`, `capacitacion`.
- **Estados:** Backlog → Todo → In Progress → In Review → Done (+ Canceled).
  Los tickets se crean en **Backlog** y pasan a **Todo** cuando arranca su sprint.
- **Canceled con nota arriba** = pausado a propósito, no descartado (SPO-160 tema visual, SPO-162 ciudad).
  Se reabren cuando se toma la decisión que los frenó.

Reglas duras:

- **La única fecha que va a Linear es el `dueDate`**: el jueves 18h que cierra el sprint del ticket, la
  misma para todos los tickets de esa semana. Marca el cierre del sprint, no una entrega individual. Un
  ticket sin sprint asignado va sin `dueDate`. **Fechas en las descripciones, nunca**: el orden día por
  día vive en el plan de sprint.
- **No hay cycles configurados** en Linear. Los sprints existen solo como documentos en esta carpeta.
- Las **dependencias se cargan como relaciones "blocked by" reales**, no solo como texto en la descripción.
- **Crear, editar o cancelar issues solo cuando el PO lo pida explícitamente.** Leer Linear es libre;
  escribir es un acto visible para el equipo.

---

## 5. Convención de tickets

Formato fijo (referencias: SPO-155, SPO-157, y todos los del sprint 2):

```
**Referencia:** RF-XX · WBS X.X.X
**Descripción** — qué y por qué, dos o tres líneas.
**Pasos** — numerados, con snippets de código reales (rutas de archivo del repo, no inventadas).
**Criterios de aceptación** — checkboxes verificables, uno por línea. Incluyen siempre el caso de error.
**Notas** — decisiones, alcance excluido, plan B.
**Bloqueado por:** SPO-XXX
```

Un ticket bien escrito acá **nombra archivos que existen** y respeta las reglas técnicas del repo. La fuente
de verdad de esas reglas es **`sportmatch/AGENTS.md`** — leerlo antes de escribir pasos
técnicos, no reproducir sus reglas de memoria. Lo que más se olvida:

- Back: 4 capas (`module` + `controller` + `service` + `repository`), `--no-spec`, **sin archivos `.spec.ts`**.
  El repository es el único que toca `PrismaService`; el service es el único que lanza excepciones HTTP.
- Prisma 7: el cliente sale de `back/src/generated/prisma/client` (**nunca** `@prisma/client`), adapter
  `PrismaPg` obligatorio, el seed no corre solo (`npm run db:seed`).
- Front: `apiFetch`, nunca `fetch` pelado. Nada de colores hardcodeados — o shadcn, o variable de
  `globals.css`. Rutas privadas bajo el route group `(app)`.
- Ramas `feature/SPO-###-descripcion`, commits `feat(SPO-###): mensaje`, PR contra `dev`.

---

## 6. Producto

| ID | Requerimiento | MoSCoW |
|---|---|---|
| RF-01 | Autenticación | Must |
| RF-02 | Perfil de usuario | Must |
| RF-03 | Creación de partido | Must |
| RF-04 | Descubrimiento (swipe + mapa) | Should |
| RF-05 | Sistema de solicitudes | Must |
| RF-06 | Sistema de rating | Should |

Decisiones de modelo ya tomadas (los diseños mandan):

- **No hay Home.** Se navega por un **tab bar inferior de 5 ítems**: mapa · buscar · **+** · mis partidos · perfil.
- El **`nivel` es del partido**, no del usuario. El partido **no tiene título**: se identifica por deporte + fecha + lugar.
- Deportes: `FUTBOL`, `BASQUET`, `TENIS`, `PADEL`, `RUNNING`.
- **Ubicación:** texto libre por ahora (`"River Courts · Cancha 2"`). Coordenadas y direcciones se definen
  **una sola vez para `User` y `Partido`**, no primero para uno.
- Unirse a un partido es **directo mientras haya cupo**; la aprobación del organizador (RF-05 completo) queda fuera de la demo.

**Fuera de alcance hasta el 17/09:** mapa y distancias, solicitudes con aprobación, rating y racha reales,
vista swipe, subida de foto de perfil, cambio de contraseña, compartir perfil, historial real de partidos,
tests automatizados, notificaciones.

---

## 7. Este workspace

```
gestion/                 la planificación — el trabajo del PO
├── WBS.md               fuente de verdad del alcance; de acá salió el backlog de Linear
├── Project Charter.md · PERT y Camino Crítico*.md · Estimaciones/ · scripts/pert_v2.py
├── LINEAR_HANDOFF.md    cómo se armó el backlog y qué quedó pendiente
├── Devs/                las versiones de esos documentos que ve el equipo
├── sprints/Sprint N/    Plan sprint N (dd-mm al dd-mm).md — el plan de la semana
├── entregas/            lo que se entrega a los profes
└── archivo/             histórico de la capacitación
sportmatch/              el repo del producto: front/, back/ y AGENTS.md
sportmatch-onboarding/ · sportmatch-linktree/ · sportmatch-sandbox/ · agents-copilot/
                         repos satélite, no son el producto
```

- El plan de sprint vigente es el del **número más alto**. Los anteriores llevan una nota de "documento
  histórico" arriba — no planificar contra ellos.
- Estructura de un plan de sprint (mantenerla): capacidad → objetivo de la semana → supuestos → una sección
  por dev con sus tickets → orden día por día → definición de terminado end-to-end → riesgos → títulos de
  las semanas siguientes.

El material teórico de la materia (presentaciones, apuntes del final) **no está acá**: vive en
`~/Documents/Facultad/Dirección de Proyectos/`, junto a una **copia congelada** de todo lo que hoy está en
`gestion/`. Esa copia es un respaldo, no una fuente: el trabajo pasa acá.

## 8. Cómo trabajar acá

- **Verificar antes de afirmar.** El estado real está en Linear y en el repo, no en el plan de la semana: el
  plan dice lo que se esperaba, no lo que pasó. Antes de decir que algo está hecho, mirarlo.
- **No inventar números.** Si no hay dato (rating, racha, velocity de una semana sin cerrar), decir que no lo
  hay. Vale también para el producto: los tiles sin datos van en `—`, no con números de relleno.
- **Contra el calendario.** Cada decisión se mide contra el 17/09. Cuando algo no entra, decirlo y proponer
  qué se cae, en vez de estirar la semana.
- **Alcance honesto.** Si un sprint cierra sin cubrir algo que se va a notar, va explícito en los riesgos y
  se dice en la review.
