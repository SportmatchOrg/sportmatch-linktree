# Plan: issues de Linear en el Gantt

**Estado:** propuesta, sin implementar · 16/09/2026

## Objetivo

1. Asignar cada issue del team SPO en Linear (https://linear.app/sportmatch-dirproy/team/SPO/all) a su paquete de la WBS v4, o marcarlo como fuera de la WBS con el motivo.
2. En [leadership/gantt.html](../../leadership/gantt.html), al hacer clic en un paquete, abrir una barra inferior con los issues del paquete y su estado general.
3. Sincronizar a mano: se corre un script cuando hace falta. No hay webhooks ni polling automático.

## Lo que ya existe y condiciona el diseño

| Hecho | Consecuencia |
|---|---|
| `scripts/generate-v4.py` ya tiene la asignación paquete → tickets en el dict `PKG_TICKETS`, cargado a mano y solo para lo hecho al 15/09. | El CSV nuevo arranca con ese dict y lo **reemplaza**. Así la asignación vive en un solo lugar. |
| `.vercelignore` excluye `*.csv`, `docs/` y `scripts/`. | El navegador **no puede** hacer `fetch` del CSV en producción. |
| Las páginas de leadership traen los datos como literales JS entre marcadores (`// v4-begin` … `// v4-end`), y `tests/leadership-versions.test.mjs` los valida. | Seguimos el mismo patrón: el script inyecta un bloque `// linear-begin` … `// linear-end` en `gantt.html`. |
| Un ticket puede cubrir varios paquetes (SPO-149 → 4.1.1 y 5.1.1; SPO-212 → 5.1.4, 5.1.5 y 5.2.4). | La relación es muchos a muchos: **una fila por par (paquete, issue)**. |
| El Gantt tiene dos niveles: X.X (por defecto) y X.X.X. Los tickets se escriben a nivel X.X.X. | La asignación se guarda a nivel **X.X.X**. La vista X.X junta los issues de todos sus hijos. |
| La numeración de la WBS cambia entre v1, v2 y v4. | La barra solo se habilita en **v4**. |

## Piezas

### 1. `docs/planning/linear-wbs-map.csv`: asignación (se edita a mano)

```csv
wbs_id,issue,url
4.1.1,SPO-149,https://linear.app/sportmatch-dirproy/issue/SPO-149
5.1.1,SPO-149,https://linear.app/sportmatch-dirproy/issue/SPO-149
-,SPO-184,https://linear.app/sportmatch-dirproy/issue/SPO-184
```

- `wbs_id` es un id X.X.X de la WBS v4. `-` quiere decir que el issue queda fuera de la WBS a propósito (por ejemplo, un hotfix o una capacitación duplicada).
- Guarda solo los links, como se pidió. Título y estado **no** van acá: los trae la sincronización.
- Carga inicial: se genera desde `PKG_TICKETS`, y los issues que no aparecen ahí se agregan con `wbs_id` vacío para completarlos a mano.

### 2. `scripts/sync-linear.mjs`: sincronización manual

```sh
LINEAR_API_KEY=lin_api_... node scripts/sync-linear.mjs
```

1. Trae todos los issues del team SPO con la API GraphQL de Linear (`issues(filter:{team:{key:{eq:"SPO"}}})`, paginado): `identifier`, `title`, `url`, `state { name type }`, `assignee`.
   Usa el `fetch` nativo de Node 24, sin dependencias nuevas.
2. Cruza esos issues con el CSV y **falla con un reporte** si encuentra:
   - issues de Linear que no están en el CSV (sin asignar);
   - filas con `wbs_id` vacío;
   - un `wbs_id` que no existe en la WBS v4;
   - un issue del CSV que ya no existe en Linear.
3. Agrega al CSV, con `wbs_id` vacío, los issues nuevos que no tenía, para no tener que tipearlos.
4. Reescribe en `leadership/gantt.html` el bloque entre marcadores:

```js
// linear-begin — generado por scripts/sync-linear.mjs el 2026-09-16
const LINEAR = {
  syncedAt: "2026-09-16T18:00:00Z",
  issues: { "SPO-149": { title: "...", state: "Done", type: "completed", url: "...", assignee: "Rudolph" } },
  byPkg:  { "4.1.1": ["SPO-149"], "5.1.1": ["SPO-149"] }
};
// linear-end
```

**Alternativa sin API key:** exportar el CSV desde Linear, como el `Export Tue Sep 15 2026.csv`, y pasarlo con `--export <archivo>`. El resto del flujo no cambia. Conviene soportar las dos entradas solo si alguien del equipo no puede generar una key.

### 3. Barra inferior en `gantt.html`

- **Disparador:** el clic que ya existe en las etiquetas y las barras (`toggleHighlight`) también llama a `openIssues(id)`. Hacer clic otra vez, apretar `Esc` o tocar `×` la cierra.
- **Qué issues muestra:**
  - En X.X, los issues de todos los `byPkg` cuyo id empieza con `X.X.`, sin repetir.
  - En X.X.X, solo `byPkg[id]`.
  - En una envolvente de módulo colapsado, no se abre.
- **Contenido:**
  - Encabezado: `4.1 Backend de autenticación · 5/6 hechos · sincronizado 16/09 18:00`.
  - Barra de progreso apilada según el tipo de estado de Linear: `completed` / `started` / `unstarted` + `backlog` / `canceled`. Para el porcentaje, los cancelados no cuentan.
  - Lista: `SPO-149` (link a Linear, nueva pestaña) · título · pastilla de estado · X.X.X al que corresponde · asignado.
  - Paquete sin issues: «Sin issues en Linear».
- **Estilo:** `position: fixed; bottom: 0`, alto máximo de unos 40vh con scroll interno, y los tokens de `assets/tokens/` que ya usa la página. No agrega librerías.

### 4. Test

En `tests/leadership-versions.test.mjs` (o en un test nuevo, `linear-map.test.mjs`):

- cada `wbs_id` del bloque `LINEAR` existe en las tareas v4 del Gantt;
- cada issue de `byPkg` está en `issues`;
- no queda ningún `wbs_id` vacío.

Esto no llama a Linear: valida lo último que se sincronizó.

## Pasos

| # | Paso | Listo cuando |
|---|---|---|
| 1 | Generar `linear-wbs-map.csv` desde `PKG_TICKETS` más los issues del export del 15/09. | El CSV tiene todos los issues del export: con paquete, con `-` o con `wbs_id` vacío. |
| 2 | Completar a mano los vacíos. Es la alineación: un repaso con el equipo. | No quedan `wbs_id` vacíos. |
| 3 | `generate-v4.py` lee el CSV en lugar de `PKG_TICKETS`. | El script devuelve el mismo `_v4_gantt.js` que antes, sin diferencias. |
| 4 | `scripts/sync-linear.mjs` | El script se corre con una key, reporta lo que falta asignar e inyecta el bloque. |
| 5 | Barra inferior en el Gantt | Se abre al hacer clic en X.X y en X.X.X, anda en móvil y cierra con `Esc`. |
| 6 | Test | `npm run check` pasa. |
| 7 | Agregar al README una línea sobre cómo sincronizar. | — |

## Qué queda afuera y cuándo agregarlo

- **Sincronización automática** (cron o GitHub Action): solo si la manual se olvida seguido. Pediría la key como secret del repo.
- **Datos en vivo desde el navegador:** exigiría un endpoint en `api/` para no exponer la key. No se justifica para un poll manual.
- **Asignación dentro de Linear** (labels o un campo por paquete): son 116 paquetes, demasiados labels. El CSV alcanza.
- **Barra en las vistas WBS y PERT:** se puede reutilizar el mismo bloque `LINEAR` si después se pide.

## Preguntas abiertas

1. **¿Quién puede crear la API key de Linear?** Una key personal (Settings → API) alcanza para leer y no se commitea. Si no se puede, se usa el export CSV.
2. **¿El estado general debe recalcular el estado del Gantt?** Hoy el ✅/🟡/⬜ de cada paquete se carga a mano en `generate-v4.py`. Propuesta: la barra muestra Linear tal como está, y el Gantt sigue con su estado planificado. Si difieren, eso es información útil, no un error.
3. **Issues fuera de la WBS** (capacitación duplicada SPO-113/114/115, hotfixes, arreglos de UI SPO-184/194/214): ¿se marcan con `-`, o van a un paquete (por ejemplo, 3.1.2 o 8.x)?
4. **Sub-issues:** ¿se asigna el padre y los hijos heredan el paquete, o se asigna cada hijo por separado? Propuesta: heredan del padre salvo que tengan una fila propia.
5. **Cancelados y archivados:** ¿se muestran en la barra (tachados) o se ocultan?
