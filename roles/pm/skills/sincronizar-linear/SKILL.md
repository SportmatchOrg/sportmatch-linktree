---
name: sincronizar-linear
description: Resincroniza el estado de Linear con el Gantt y las vistas de leadership después de que el PO agregó o movió issues. Corre sync-linear.mjs, asigna los issues nuevos a su paquete de la WBS v4, regenera el cronograma y deja el repo verde. Usar cuando el PO cargó tickets nuevos, antes de un steering, cuando el Gantt muestra fechas viejas, o cuando alguien pida "resincronizá Linear", "actualizá el Gantt", "el panel no muestra los issues nuevos".
---

# /sincronizar-linear — poner el Gantt al día con Linear

Lo que cambia entre sincronizaciones es **que el PO agrega issues**. Todo lo demás del flujo es
mecánico: el único paso con criterio es decidir a qué paquete de la WBS pertenece cada issue nuevo.

El plan completo y por qué cada pieza es así: `docs/planning/plan-linear.md`.

## Las piezas

| Archivo | Qué es | Quién lo edita |
|---|---|---|
| `docs/planning/linear-wbs-map.csv` | issue → paquete de la WBS. Una fila por par | **A mano** (este skill) |
| `docs/planning/linear-issues.csv` | estado, puntos y fechas reales | Generado, no tocar |
| `leadership/gantt.html` | bloques `linear-begin` y `gen-begin` | Generado, no tocar |
| `scripts/sync-linear.mjs` | trae Linear, reporta y escribe el repo | — |
| `scripts/generate-v4.py` | recalcula el cronograma con las fechas reales | — |

## Qué NO hace

- **No escribe en Linear sin `--push`**, y `--push` solo suma issues al proyecto y pone milestones que
  faltan. Nunca toca estados, títulos, asignados ni estimates.
- **No pisa un milestone puesto a mano.** Si difiere del CSV, lo reporta y sigue: manda Linear.
- No inventa el paquete de un issue cuya descripción no da para decidirlo. Ahí se pregunta.
- No commitea: el commit lo decide quien corre el skill.

## Paso 1 — Traer Linear y ver qué falta

```sh
node --env-file=.env.local scripts/sync-linear.mjs
```

Sin `--push` no escribe nada en Linear. Actualiza `linear-issues.csv`, el bloque del Gantt, y agrega al
mapa los issues nuevos con `wbs_id` vacío.

Lo que reporta y qué significa cada cosa:

| Aviso | Qué hacer |
|---|---|
| `sin paquete en el CSV` | Paso 2. Es el trabajo real |
| `sin proyecto` | Paso 3: `--push` los suma |
| `milestone distinto al del CSV` | Decidir cuál está bien. Si manda Linear, corregir el CSV; si manda el CSV, corregirlo en Linear a mano |
| `paquete en épica 1 o 2: sin milestone` | Esperado: gestión y diseño no tienen milestone. SPO-201 a 205 salen siempre |
| `sin estimate` | Pedirle al PO que lo cargue: sin puntos, el issue no suma al avance |
| `en el CSV pero ya no en Linear` | Borrar esas filas del CSV |

## Paso 2 — Asignar los issues nuevos a su paquete

Para cada issue con `wbs_id` vacío, leer su descripción en Linear — con `get_issue` del MCP de Linear,
o abriendo la URL que el propio CSV dejó en la fila:

```sh
grep ',,' docs/planning/linear-wbs-map.csv   # las filas sin paquete, con su link
```

1. **Si la descripción dice `WBS X.Y.Z`, ese es el paquete.** Lo escribió quien redactó el ticket y vale
   más que cualquier inferencia por el título. Casi todos los tickets lo traen.
2. Si no lo trae, el milestone del issue da la épica, y los paquetes de esa épica están en
   `docs/planning/WBS-SportMatch-v4.md`. Elegir entre esos.
3. Si ni el milestone ni la descripción alcanzan, **preguntar al PO**. No adivinar.

Reglas de la fila:

- **Un issue puede cubrir varios paquetes**: una fila por cada uno.
- **La primera fila del issue es su paquete principal** y de ahí sale el milestone. El orden dentro de un
  issue es a mano: no reordenar el CSV por `wbs_id`.
- **`fechas`** decide si esa fila mueve la barra del Gantt:

| `fechas` | Cuándo |
|---|---|
| `si` | El ticket es alcance del paquete: su trabajo es lo que el paquete promete |
| `no` | Hotfix, arreglo de UI, o un retoque sobre un paquete que ya estaba cerrado (por ejemplo SPO-225 sobre 6.4.2) |

Un ticket abierto sobre un paquete pendiente puede ir con `si` sin problema: solo cuentan los tickets
ya cerrados. Marcar `no` a un ticket que sí es alcance del paquete **esconde** trabajo del cronograma.

## Paso 3 — Escribir en Linear

```sh
node --env-file=.env.local scripts/sync-linear.mjs --push
```

Suma al proyecto los issues sueltos y le pone milestone a los que no tienen, según la primera fila del
CSV. Es un cambio que el equipo ve en el overview del proyecto: correrlo con el CSV a medio completar
manda issues al milestone equivocado.

## Paso 4 — Recalcular el cronograma

```sh
python3 scripts/generate-v4.py
```

Escribe solo el bloque `gen-begin` de `leadership/gantt.html` con las fechas reales de lo cerrado. Los
otros tres archivos que deja en `scripts/_v4_*` van a mano y **solo si cambiaron**:

- `_v4_wbs.js` → `leadership/wbs.html` (cambia solo si cambió la WBS)
- `_v4_pert.js` → `leadership/pert.html` (ídem)
- `_v4_calendario.md` → `docs/planning/Cronograma-y-PERT-v4.md`, §4 y §9

## Paso 5 — Verificar

```sh
npm run check
```

Los tres fallos que aparecen después de sincronizar, y qué significan:

| Falla | Qué pasó |
|---|---|
| `issues sin paquete: …` | Volver al paso 2: quedó una fila vacía |
| `dependency violations changed` | Un paquete arrancó antes que aquel del que depende. **Mirarlo, no silenciarlo**: si es real, agregarlo a `KNOWN_DEP_VIOLATIONS` con un comentario que diga por qué |
| `el bloque LINEAR coincide con el mapa` | El bloque quedó desfasado del CSV: correr de nuevo el paso 1 |

Después, abrir el Gantt y hacer clic en una épica, un paquete y un entregable: el panel de abajo tiene
que listar los issues con su estado y el avance en puntos.

```sh
python3 -m http.server 8000   # http://localhost:8000/leadership/gantt.html
```

## Paso 6 — Dejarlo registrado

Los cuatro archivos que cambian y se commitean juntos:

```
docs/planning/linear-wbs-map.csv      # las filas nuevas
docs/planning/linear-issues.csv       # el snapshot de Linear
leadership/gantt.html                 # bloques linear-begin y gen-begin
docs/planning/Cronograma-y-PERT-v4.md # solo si cambió el calendario
```

Si el paso 4 movió fechas de paquetes que ya estaban planificados, vale la pena decirlo en el commit:
es información de cronograma, no ruido.

## Para el PO: que el flujo salga barato

Un issue creado **con milestone** y **con estimate** no necesita nada más que el paso 1. Sin milestone,
el issue aparece sin épica y hay que rastrearlo a mano; sin estimate, no suma al avance de su milestone.
