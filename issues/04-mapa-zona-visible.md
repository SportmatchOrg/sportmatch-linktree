# [Sin crear] Mapa: pedir solo los partidos de la zona visible

**Prioridad:** P3 · **Estado:** documentado, no creado en Linear (31/10); se crea si después de SPO-302 el Mapa sigue lento · **Área:** front (`mapa/page.tsx`, `components/map/*`)
**Depende de:** BUG-18 / SPO-307 (parámetros `north/south/east/west` y `limit` en `GET /matches`), **SPO-296** (`useMatches`
con TanStack Query) y **SPO-302** (agrupar pines)
**Evidencia:** [audit §3](audit-rendimiento.md#3-mediciones)

> **El clustering no va acá:** ya lo cubre **SPO-302** (Todo, "Mapa: agrupar los pines cercanos en un contador
> al alejar el zoom"), con `@googlemaps/markerclusterer`. Este issue resuelve otra cosa: el Mapa sigue bajando
> y montando **todos** los partidos del país aunque estén agrupados.

## Problema

Con la carga, el Mapa recibe 1.677 partidos y:

- monta **1.677 `AdvancedMarker`**. SPO-302 los agrupa en pantalla, pero se siguen creando todos;
- en escritorio, la lista lateral dibuja **1.677 `MatchRow`** (`renderList`);
- `FitBounds` encuadra todos los puntos, o sea el país entero, cuando el jugador no compartió su ubicación.

SPO-232 dejó afuera el filtro por zona del mapa ("Fuera de alcance: … bounding box del mapa"). Este issue
es ese pendiente.

**El render no se midió en navegador** porque el login en dev estaba bloqueado. Antes de empezar, conviene
confirmar el costo con DevTools → Performance (zoom y paneo en dev con la carga), que es el ítem del checklist
de `plan-data.md` §7.4. Si con SPO-302 ya está fluido, bajar este issue a P3.

## Propuesta

1. **Pedir por zona visible.** Al evento `idle` del mapa, con debounce de ~300 ms, se toman los bounds y se
   llama a `GET /matches?north&south&east&west&limit=500` junto con los filtros que ya existen. Se usa la
   `matchesQueryOptions` de SPO-296, con los bounds redondeados (~3 decimales) dentro de la clave.
   - Si llegan exactamente `limit` resultados, se muestra un aviso chico: "Acercate para ver todos".
   - Mientras se pide una zona nueva, se siguen mostrando los pins anteriores (`keepPreviousData`, que ya está
     en SPO-296).
2. **`FitBounds` solo en la primera carga.** Si no, encuadrar mueve los bounds, eso dispara otro fetch, y el
   ciclo se repite.
3. **Lista lateral de escritorio:** muestra los partidos de la zona visible, que con el `limit` son como mucho
   500. Si se siente lento, recortarla a los primeros 50 con un "Ver más". No hace falta virtualizar.
4. **La precarga de SPO-296** (`matchesQueryOptions({})`) pasa a precargar la zona por defecto
   (`DEFAULT_MAP_CENTER` y `DEFAULT_ZOOM`) y deja de precargar el país entero.

## Criterios de aceptación

- [ ] Ninguna request del Mapa trae más de 500 partidos (DevTools → Network).
- [ ] Panear y hacer zoom no dispara más de una request por gesto, y no hay loop de fetch con o sin ubicación
      del jugador.
- [ ] En dev con la carga, el paneo no muestra long tasks > 200 ms en DevTools → Performance. Anotar el antes y
      el después en el PR.
- [ ] Los filtros Día, Nivel, Deporte y Cerca siguen funcionando combinados con la zona. Los contadores de los
      grupos de SPO-302 cuentan solo los partidos de la zona pedida.
- [ ] Al tocar un pin se sigue abriendo `/partidos/:id`.

## Fuera de alcance

- Agrupar pines (SPO-302).
- Clustering del lado del servidor y endpoint liviano de "solo pins". Volver a evaluarlo si con 500 por zona
  sigue pesando.
