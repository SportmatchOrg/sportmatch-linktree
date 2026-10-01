# Plan: alinear Linear con la WBS v4

**Estado:** implementado · 29/09/2026

## Cómo quedó

| Pieza | Dónde |
|---|---|
| Mapa issue → paquete, 133 filas y 111 issues | [linear-wbs-map.csv](linear-wbs-map.csv) |
| Estado, puntos y fechas reales, refrescado por el script | [linear-issues.csv](linear-issues.csv) |
| Script de sincronización | [sync-linear.mjs](../../scripts/sync-linear.mjs) |
| Panel inferior y bloque `LINEAR` | [gantt.html](../../leadership/gantt.html) |
| Tests | [leadership-versions.test.mjs](../../tests/leadership-versions.test.mjs) |
| **Flujo para resincronizar** | [roles/pm/skills/sincronizar-linear](../../roles/pm/skills/sincronizar-linear/SKILL.md) |

En Linear: 10 milestones creados, descripción cargada, 111 issues en el proyecto (0 sueltos)
y 106 con milestone. Los 5 sin milestone son el refactor de idioma (SPO-201 a 205), que cae
en la épica 2 y por eso no tiene: el script los reporta en cada corrida.

**Lo que se desvió del plan:**

1. **`fechas=si` no alcanzaba.** Un ticket abierto sobre un paquete pendiente rompía
   `generate-v4.py`. La regla real, ya en el código: un paquete toma fechas sólo de los tickets
   **ya cerrados**; si no le cerró ninguno, lo agenda el planificador. Eso permitió borrar el
   `assert` que existía sólo porque el dict estaba curado a mano.
2. **El orden de las filas importa.** «La primera fila es el paquete principal» se rompe si el
   CSV se ordena por `wbs_id`. Se ordena por issue y nada más; dentro de un issue el orden es a
   mano. El primer push mandó SPO-226 al milestone 6 y SPO-241 al 5 por este motivo, y se
   corrigieron a mano.
3. **Una sola fila hubo que marcar `no`:** SPO-225, un retoque sobre 6.4.2 cerrado en la semana 7.
4. **El cálculo por puntos no se configura por API**, y no hace falta: Linear ya lo hace así
   cuando el team tiene estimates. El `scope` que devuelve la API son 185 puntos, no 96 issues.
5. **4 de 76 tareas del Gantt se movieron** (6.2.5, 6.2.6, 7.3.2, 7.3.3): son paquetes pendientes
   cuyos tickets ya arrancaron, así que ahora empiezan en su semana real. Es lo que buscaba la
   decisión 8.
6. **`generate-v4.py` ya no se pega a mano.** Como las fechas cambian en cada sincronización, ese
   paso se olvidaba seguro: ahora el script escribe directo el bloque `gen-begin` de `gantt.html`.
   Los otros tres archivos que genera siguen a mano, porque cambian solo si cambia la WBS.
7. **Un invariante de los tests dejó de ser cierto.** «Toda violación de dependencias involucra un
   paquete hecho» ya no vale: ahora un paquete pendiente puede tener fecha real porque su ticket
   arrancó. Apareció `7.3.3<7.3.2` (SPO-235 cubre los dos) y el test pasó a aceptar también ese caso.

---

## Plan original · 25/09/2026

## Objetivo

1. Que cada issue del team SPO tenga su **paquete de trabajo** de la WBS v4 anotado en un CSV del repo.
2. Que el [overview del proyecto en Linear](https://linear.app/sportmatch-dirproy/project/sportmatch-a15459aba4aa/overview) muestre el avance **por milestone**, con un milestone por épica y una descripción del proyecto.
3. Que al hacer clic en una **épica**, un **paquete** o un **entregable** del [Gantt](../../leadership/gantt.html) se abra un panel inferior con los issues de ahí y su avance.

La sincronización es manual: se corre un script cuando hace falta.

**El flujo de acá en más**, en una línea: se crea el issue en Linear **eligiendo el milestone** → se corre `sync-linear.mjs`, que lo agrega al CSV sin paquete y lo reporta → se le pide a Claude que complete el paquete → `npm run check` vuelve a pasar y el Gantt muestra el issue en su fila.

## Punto de partida (medido contra la API el 24/09)

| Dato | Valor |
|---|---|
| Issues en el team SPO | 111 (82 Done · 11 Todo · 1 In Review · 13 Backlog · 4 Canceled) |
| Ya mapeados a un paquete, en el dict `PKG_TICKETS` de `generate-v4.py` | 68 |
| **Sin mapear** | **43** (SPO-135, 181, 184, 188, 190, 194, 195, 201–206, 209, 210, 214, 220–246) |
| Issues fuera del proyecto SportMatch | 11 (SPO-113 a 126: las tres capacitaciones y sus sub-issues) |
| Sub-issues | 8 |
| Milestones en el proyecto | 0 |
| Descripción del proyecto | vacía |

El último export en el repo (`Export Tue Sep 15 2026.csv`) tiene 86 issues: quedó 25 issues atrás.

## Decisiones

| # | Decisión | Por qué |
|---|---|---|
| 1 | El CSV lleva una columna **`fechas`** (si/no) que marca si esa fila cuenta para calcular la ventana del paquete. | Pertenencia y cronograma son dos preguntas distintas. `PKG_TICKETS` hoy deja afuera hotfixes y arreglos de UI a propósito: si entraran, estirarían barras del Gantt hasta septiembre. |
| 2 | El `wbs_id` se valida contra los **116 paquetes de la WBS**, no contra los 76 del Gantt. | Varios issues pertenecen a la épica 8, que el Gantt no dibuja ([generate-v4.py:101](../../scripts/generate-v4.py#L101)). Quedan en su milestone y sin barra. |
| 3 | Los 43 `wbs_id` vacíos los propone Claude a partir del título, la etiqueta y la descripción, y quedan. | Lo que salga mal se corrige editando una fila del CSV y sincronizando de nuevo. |
| 4 | **Diez milestones**: épicas 3 a 12. Las épicas 1 (Gestión) y 2 (Diseño) no llevan milestone. Formato `3 · Capacitación y Setup`. | No se ticketean en Linear: su milestone quedaría siempre en 0%. |
| 5 | En un conflicto de milestone, **manda Linear**: el script lo reporta y no lo toca. Si el issue no tiene milestone, se lo pone. | Quien trabaja en Linear no pierde lo que hizo. El primer push igual funciona, porque «sin milestone» no es un conflicto. |
| 6 | Los 11 issues de capacitación **entran** al proyecto SportMatch. | Es la épica 3 de la WBS y es trabajo real. Sin proyecto no pueden tener milestone. El avance del proyecto baja de 82% a 74% porque el denominador crece. |
| 7 | El encabezado del panel **avisa cuando el Gantt y Linear no coinciden**. | La divergencia es la información más útil del panel. |
| 8 | El script también refresca **`linear-issues.csv`** con estado y timestamps, y `generate-v4.py` lo lee en lugar del export del 15/09. | Si no, el Gantt se queda con el calendario del S1 para siempre. Una corrida actualiza todo. |
| 9 | En la fila de épica, el **chip `22 · 55,4 h` abre el panel**; el nombre sigue colapsando el módulo. | Ese clic ya está ocupado por el colapsar ([gantt.html:909](../../leadership/gantt.html#L909)), que se usa todo el tiempo. |
| 10 | Un issue nuevo lleva **milestone elegido al crearlo**. El paquete lo propone **Claude cuando se le pide**, guiado por el milestone; el script solo deja la fila vacía y la reporta. | Linear ofrece el milestone al crear: es un campo, no un ritual. Elegir el X.X.X es criterio, no algo que un `.mjs` pueda adivinar de un título. |
| 11 | **`npm run check` falla** si un issue de Linear no tiene fila en el CSV. | Es lo único que evita volver a juntar 43 sin mapear en dos sprints. |
| 12 | El avance se mide **por puntos de estimate**, en Linear y en el panel. | 109 de 111 issues ya tienen estimate y 1 SP ≈ 1 h, la unidad de la WBS. Un mismo número en los dos lados. |

Decisiones ya tomadas antes de la entrevista:

- La `LINEAR_API_KEY` está en `.env.local`, que está en `.gitignore`.
- La barra muestra el estado de Linear tal cual. El ✅/🟡/⬜ del Gantt sigue como está.
- Todos los issues se asignan a un paquete, incluidos hotfixes y capacitación.
- Los sub-issues heredan el paquete del padre, salvo que tengan fila propia.
- Los cancelados no aparecen en la barra. Sí llevan paquete y milestone: Linear ya los excluye del avance.

## Fase 1 · CSV de asignación

**`docs/planning/linear-wbs-map.csv`**, editado a mano, una fila por par (issue, paquete):

```csv
issue,wbs_id,fechas,url
SPO-149,4.1.1,si,https://linear.app/sportmatch-dirproy/issue/SPO-149
SPO-149,5.1.1,si,https://linear.app/sportmatch-dirproy/issue/SPO-149
SPO-214,6.2.4,no,https://linear.app/sportmatch-dirproy/issue/SPO-214
SPO-181,8.3.1,si,https://linear.app/sportmatch-dirproy/issue/SPO-181
```

- `wbs_id`: un id X.X.X de la WBS v4, el nivel al que se escriben los tickets.
- `fechas`: `si` si la fila cuenta para la ventana del paquete; `no` para hotfixes y arreglos que no son alcance del paquete. Reemplaza al comentario de [generate-v4.py:119-121](../../scripts/generate-v4.py#L119-L121).
- La **épica es el primer número** del `wbs_id`: no lleva columna propia, así no hay dos lugares que puedan contradecirse. Es también el milestone.
- Un issue puede cubrir varios paquetes y aparece en varias filas (SPO-149 → 4.1.1 y 5.1.1; SPO-212 → 5.1.4, 5.1.5 y 5.2.4). Para el milestone se usa **la primera fila** del issue: es su paquete principal.
- Un `wbs_id` de las épicas 1 o 2 no tiene milestone: el script lo reporta y sigue.

**Cómo se carga:**

1. Se vuelcan las 68 asignaciones de `PKG_TICKETS`, con `fechas=si`, y las tres exclusiones actuales (SPO-184, 194, 214) como `fechas=no`.
2. Claude propone los 43 restantes. Calces ya identificados: SPO-181 → 8.3.1 · SPO-195 → 8.3.2 · SPO-188 → 8.1.1.
3. `generate-v4.py` lee el CSV en lugar de tener el dict adentro, filtrando por `fechas=si`.

**Listo cuando:** no queda ningún `wbs_id` vacío, todo `wbs_id` existe en la WBS v4, y `generate-v4.py` produce el mismo `_v4_gantt.js` que hoy.

## Fase 2 · Milestones y descripción en Linear

Diez milestones, con la fecha de fin que el Gantt v4 ya tiene para ese módulo:

| Milestone | Fecha objetivo | Horas | Paquetes |
|---|---|---|---|
| 3 · Capacitación y Setup | 03/09/2026 | 25,9 | 6 hechos |
| 4 · Autenticación | 17/09/2026 | 23,3 | 9 hechos |
| 5 · Perfil de Usuario | 15/10/2026 | 20,5 | 6 hechos · 3 en curso · 1 pendiente |
| 6 · Gestión de Partidos | 29/10/2026 | 55,4 | 15 hechos · 7 pendientes |
| 7 · Sistema de Matchmaking | 15/10/2026 | 27,8 | 2 hechos · 1 en curso · 5 pendientes |
| 8 · QA Manual y Validación | 05/11/2026 | — | fuera del Gantt de desarrollo |
| 9 · Deployment | 03/09/2026 | 14,9 | 4 hechos |
| 10 · Documentación Final | 29/10/2026 | 12,2 | 1 hecho · 1 en curso · 2 pendientes |
| 11 · Notificaciones | 29/10/2026 | 21,4 | 7 pendientes |
| 12 · Moderación y Reportes | 05/11/2026 | 20,4 | 6 pendientes |

La 8 va al 05/11 porque la validación con usuarios es lo que alarga el proyecto después del desarrollo ([Cronograma-y-PERT-v4.md:95-97](Cronograma-y-PERT-v4.md#L95-L97)).

**Pasos:**

1. Crear los diez milestones (`projectMilestoneCreate`).
2. Sumar al proyecto los 11 issues sueltos (SPO-113 a 126).
3. Asignar a cada issue el milestone de su épica (`issueUpdate` con `projectMilestoneId`), con la regla de la decisión 5. Los sub-issues reciben el del padre.
4. Configurar el avance del proyecto **por estimate**, y cargar el estimate de los 2 issues que no lo tienen.
5. Cargar la descripción: `description` es la línea corta del encabezado, `content` el cuerpo del overview.

**De acá en más**, quien crea un issue elige el milestone en el momento de crearlo. Es el único paso manual del flujo: de ahí sale la épica, y el paquete se completa después con Claude. Un issue sin milestone no rompe nada, pero queda sin paquete hasta que alguien lo mire.

**Descripción propuesta** (a revisar antes de cargarla):

> **description:** App para encontrar partidos de fútbol, básquet y tenis cerca tuyo, sumarte con un swipe y organizar los tuyos.
>
> **content:** SportMatch conecta jugadores con partidos abiertos cerca suyo. El jugador descubre partidos por mapa o por swipe, pide sumarse, y el organizador arma y gestiona el suyo. Después del partido, las calificaciones y el registro de faltas mantienen la comunidad sana.
>
> Proyecto de la materia Dirección de Proyectos (Equipo 11 · Austral). El desarrollo va de agosto a noviembre de 2026, con tres devs a 6 h por semana cada uno, en sprints de jueves a jueves. Cada milestone es una épica de la WBS v4; el detalle de paquetes, cronograma y camino crítico está en las vistas de leadership.

**Listo cuando:** el overview muestra los diez milestones con su avance, ningún issue del proyecto queda sin milestone y ninguno fuera del proyecto.

## Fase 3 · `scripts/sync-linear.mjs`

```sh
node --env-file=.env.local scripts/sync-linear.mjs          # revisa, reporta y actualiza el repo
node --env-file=.env.local scripts/sync-linear.mjs --push    # además escribe en Linear
```

Node 24 ya trae `--env-file` y `fetch`: no agrega dependencias.

1. **Trae** todos los issues del team SPO por GraphQL (`identifier`, `title`, `url`, `state { name type }`, `estimate`, `startedAt`, `completedAt`, `assignee`, `parent`, `project`, `projectMilestone`), paginado.
2. **Reporta**, sin escribir en Linear:
   - issues que faltan en el CSV, o filas con `wbs_id` vacío;
   - `wbs_id` que no existe en la WBS v4;
   - issues del CSV que ya no existen en Linear;
   - issues sin proyecto;
   - issues con un milestone distinto al del CSV (**no los toca**: decisión 5);
   - issues sin estimate, que no suman al avance;
   - paquetes donde el estado del Gantt y el de Linear divergen.
3. **Actualiza el repo** siempre:
   - `docs/planning/linear-issues.csv` — `issue,status,type,started,completed,assignee`, que `generate-v4.py` lee para las fechas reales;
   - el bloque entre marcadores en `leadership/gantt.html`;
   - agrega al mapa, con `wbs_id` vacío, los issues nuevos que no estaban.
4. **Con `--push`** escribe en Linear: suma al proyecto los issues sueltos y asigna el milestone a los que no tienen. Nada más: no toca estados, títulos ni asignados.

```js
// linear-begin — generado por scripts/sync-linear.mjs el 2026-09-25
const LINEAR = {
  syncedAt: "2026-09-25T18:00:00Z",
  issues: { "SPO-224": { t:"Cancelar partido como organizador…", s:"In Review", k:"started", e:3, u:"https://…", a:"Pache" } },
  byPkg:  { "6.4.2": ["SPO-224"] }
};
// linear-end
```

Va inyectado y no leído con `fetch` porque `.vercelignore` excluye `*.csv`, `docs/` y `scripts/`: en producción esos archivos no existen. El bloque y los dos CSV se commitean.

**Listo cuando:** el script corre limpio, sin issues sin asignar, y el bloque queda escrito en el Gantt.

## Fase 4 · Panel inferior en el Gantt

Tres niveles de apertura, uno por cada fila que el Gantt ya dibuja:

| Se hace clic en | Abre | Muestra |
|---|---|---|
| El chip `22 · 55,4 h` de una **épica** (`6.0`), o su **barra cuando está colapsada** | Panel de épica | El milestone de Linear, su % por puntos y los issues de todos sus paquetes |
| Una fila de **paquete** (`6.2`) | Panel de paquete | Los issues de todos sus X.X.X, sin repetir |
| Una fila de **entregable** (`6.2.3`) | Panel de entregable | Solo sus issues |

- **Disparador:** el clic que ya existe en etiquetas y barras ([gantt.html:1033](../../leadership/gantt.html#L1033), `toggleHighlight`) también abre el panel. En la fila de épica el nombre sigue colapsando el módulo y el chip de la derecha abre el panel (decisión 9). Se cierra con otro clic, con `Esc` o con la `×`. Solo en v4: v1 y v2 tienen otra numeración.
- **Encabezado:** `6.2 Solicitudes de participación · 42 de 55 pts · sincronizado 25/09 18:00`, con barra de progreso apilada por tipo de estado (`completed` / `started` / `unstarted` + `backlog`) **ponderada por puntos** (decisión 12). En el panel de épica, además, el nombre del milestone. Si el Gantt y Linear no coinciden, una línea más: `⚠ el Gantt lo da por hecho · 3 issues abiertos`.
- **Lista:** `SPO-149` como link a Linear, título, pastilla de estado, puntos, el X.X.X al que corresponde y el asignado. Los cancelados no aparecen. Si no hay issues: «Sin issues en Linear».
- **Estilo:** `position: fixed; bottom: 0`, alto máximo de unos 40vh con scroll interno, con los tokens de `assets/tokens/` que la página ya usa. Sin librerías nuevas.

## Fase 5 · Test

En `tests/leadership-versions.test.mjs`, sobre el bloque `LINEAR` ya inyectado, sin llamar a Linear:

- cada `wbs_id` de `byPkg` existe entre los **116 paquetes** de `WBS-SportMatch-v4.md`;
- cada issue de `byPkg` está en `issues`;
- **todo issue de `linear-issues.csv` tiene al menos una fila en el mapa** — es lo que hace fallar `npm run check` cuando aparece un issue nuevo sin paquete (decisión 11);
- el CSV no tiene `wbs_id` vacíos ni pares (issue, paquete) duplicados;
- todo issue con `fechas=si` existe en `linear-issues.csv`.

**Listo cuando:** `npm run check` pasa.

## Orden y dependencias

```
Fase 1 (CSV) ─┬─→ Fase 2 (milestones en Linear)
              └─→ Fase 3 (script) ─→ Fase 4 (barra) ─→ Fase 5 (test)
```

Las fases 2 y 3 comparten la lectura de la API, así que conviene escribir primero el script y usarlo para crear los milestones.

## Qué queda afuera

- **Sincronización automática** (GitHub Action o cron): recién si la manual se olvida seguido. Pediría la key como secret del repo.
- **Datos en vivo desde el navegador:** exigiría un endpoint en `api/` para no exponer la key. No se justifica para un poll manual.
- **`--pull`** (actualizar el CSV desde Linear cuando un milestone difiere): por ahora se corrige a mano, guiado por el reporte.
- **Labels por paquete en Linear:** son 116 paquetes, demasiados labels. El milestone cubre la épica y el paquete vive en el CSV.
- **La misma barra en `wbs.html`**, que sí muestra los 116 paquetes y es donde se verían los issues de la épica 8. Se reutiliza el bloque `LINEAR`.
- **El export del 15/09** queda archivado en el repo como el snapshot que se presentó en el steering 1.
