# BUG-18 · `GET /matches` trae todos los partidos del país: paginar, filtrar por zona y comprimir

> Creado en Linear: [SPO-307](https://linear.app/sportmatch-dirproy/issue/SPO-307/bug-18-get-matches-trae-todos-los-partidos-del-pais-paginar-filtrar)

**Referencia:** RF-04 · WBS 7.1.1 · bug de QA BUG-18 · audit de rendimiento con la carga masiva (31/10)

**Descripción**

Con la carga masiva en dev, cada `GET /matches` (Mapa y Descubrir):

1. trae **todos** los partidos futuros activos del país (2.783) con sus 7 relaciones (`matchInclude`), lo que tarda 0,3–1,0 s;
2. en Node descarta los llenos y, si viene `lat`/`lng`, los que están lejos. Por eso "Cerca" tarda 464 ms para devolver 65 partidos;
3. ordena por compatibilidad y devuelve **todo**: 1.677 partidos, **1,2 MB de JSON sin comprimir**. `main.ts` no tiene compresión; con gzip serían 159 KB.

Descubrir muestra 3 tarjetas a la vez y baja las 1.677.

Esto ya estaba anotado como pendiente. [SPO-186](https://linear.app/sportmatch-dirproy/issue/SPO-186) dice: "El filtro de cupo en memoria está bien para el volumen de la demo. Si algún día importa, es un `$queryRaw` o una columna `anotados` denormalizada". [SPO-232](https://linear.app/sportmatch-dirproy/issue/SPO-232) dejó afuera el bounding box del mapa. Con la carga, ya importa.

Medido contra una base local con la misma carga y el back de `origin/dev` (`f7b2989`): con el enfoque de abajo, los candidatos livianos de los 2.783 partidos tardan **146 ms**, y el `include` completo para una página de 30 ids, **49 ms**.

**Pasos**

1. **Compresión.** `back/src/main.ts`: `app.use(compression())`, con el paquete `compression`, como indica la doc de NestJS. **Justificación (QA-03):** es el middleware oficial de Express para gzip, y hacerlo a mano no tiene sentido. Antes, mirar en dev (DevTools → Network → `matches` → `content-encoding`) si el proxy `/api` de Vercel ya comprime hacia el navegador, y anotarlo en el PR. Igual vale la pena en el tramo Azure → Vercel.
2. **Parámetros nuevos, todos opcionales**, en `back/src/matches/dto/find-matches-query.dto.ts`:

   | Parámetro | Validación | Para qué |
   | -- | -- | -- |
   | `limit` | entero, 1–500 | Tamaño de página: Descubrir 30 y el Mapa hasta 500 |
   | `cursor` | string opaco que devolvió la página anterior | Página siguiente |
   | `north`, `south`, `east`, `west` | latitud y longitud válidas; **los cuatro juntos o ninguno**; `south < north` y `west < east`; si no, 400 | Zona visible del Mapa |
3. **Dos fases**, en `back/src/matches/matches.repository.ts` y `matches.service.ts`:
   1. **Candidatos livianos:** el mismo `where` de `findUpcoming`, con un `select` mínimo (`id`, `sportId`, `level`, `organizerId`, `date`, `capacity`, `latitude`, `longitude`, `_count.participants`). Si viene zona, se suma `latitude: { gte: south, lte: north }, longitude: { gte: west, lte: east }`.
   2. **En Node, igual que hoy:** descartar los llenos y los que quedan fuera del radio, y ordenar por compatibilidad (`sortByCompatibility`).
   3. **Cortar la página** con `cursor` y `limit`.
   4. **`include` completo (`matchInclude`) solo para los ids de la página**, en el orden del paso 2, y `toListResponse` como hoy.
4. **Cursor por clave de orden, no `offset`.** Si el jugador pide sumarse a la última tarjeta, ese partido deja de estar disponible, y con `offset` la página siguiente se saltearía uno. El cursor codifica la clave de orden del último ítem (deporte preferido, nivel, puntaje del organizador, fecha e `id`), en base64url, y el back devuelve los que van estrictamente después.
5. **Contrato:** el body sigue siendo un array, para no romper al front actual. El cursor siguiente va en el header `X-Next-Cursor`, que no se manda si no hay más páginas. Hay que exponerlo en CORS (`exposedHeaders`) si el front lo lee directo del back. **Sin `limit`, el comportamiento es igual que hoy**, así el back se despliega sin esperar al front.

**Criterios de aceptación**

- [ ] Sin parámetros nuevos, `GET /matches` devuelve los mismos partidos, en el mismo orden, que antes del cambio (mismo usuario y mismos datos).
- [ ] `limit=30` devuelve los mismos 30 primeros ids que la lista completa. Encadenando `X-Next-Cursor` se obtiene la lista completa, sin duplicados ni faltantes.
- [ ] Si se pide sumarse al último partido de una página, la página siguiente no saltea ni repite ninguno.
- [ ] Con zona, todos los resultados caen adentro. Zona incompleta o invertida → **400**. `limit` fuera de 1–500 → **400**.
- [ ] `GET /matches` con `Accept-Encoding: gzip` responde con `Content-Encoding: gzip`.
- [ ] Con la carga (antes y después en el PR, con `scripts/perf-bench.e2e-spec.ts` de `sportmatch-linktree`): `GET /matches?limit=30` **< 400 ms p50 y < 40 KB**, y "Cerca" **< 300 ms p50** (hoy 2,2 s y 1,2 MB, y 464 ms).
- [ ] El Mapa, los filtros y Descubrir funcionan igual que hoy en dev: el front todavía no manda los parámetros nuevos.
- [ ] El service no importa `PrismaService`. Ningún archivo `.spec.ts`. `npm run lint` y `npm run build` pasan.

**Notas**

* Funciona sin BUG-17, pero sin él cada página sigue pagando `getScores` (~2 s). Conviene hacer BUG-17 primero.
* Que el front use la paginación (Descubrir de a 30 con `useInfiniteQuery`, y el Mapa pidiendo la zona visible) va en tickets aparte, después de [SPO-296](https://linear.app/sportmatch-dirproy/issue/SPO-296) y [SPO-302](https://linear.app/sportmatch-dirproy/issue/SPO-302). Están descritos en el audit.
* Cuando el front use `limit`, abrir un ticket chico para que `limit` tenga un default.
* No se contempla el antimeridiano, porque Argentina no lo cruza. El ordenamiento sigue en Node: sobre filas livianas alcanza.
* Audit completo, con el método y cómo reproducir la medición: `issues/audit-rendimiento.md` en `sportmatch-linktree`.

**Rama:** `feature/SPO-307-matches-paginado`, PR contra `dev`. No usar la rama que sugiere Linear (`usuario/spo-307-…`).

**Bloqueado por:** —
