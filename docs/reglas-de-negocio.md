# Reglas de negocio — SportMatch

Decisiones de producto del PO para el Sprint 2, tomadas el 24/09/2026. Son la referencia de los tickets de
las semanas 8 a 10 y de lo que se demuestra en el Steering 2. El vocabulario está definido en
[`CONTEXT.md`](./CONTEXT.md).

Si una regla cambia, se actualiza este documento **antes** que el ticket.

---

## 1. Partido jugado y ventana de cierre

- Un partido está **jugado** cuando pasó su hora de inicio y no está cancelado. No existe una duración.
- La **ventana de cierre** son las **48 h** posteriores a la hora de inicio.
  - Dentro de la ventana: se califica y se marcan faltas.
  - Fuera de la ventana: no se puede calificar ni marcar faltas (hoy calificar no tiene plazo; pasa a tenerlo).
- Calificar sigue siendo **un solo envío** por jugador y partido. Las faltas se marcan en ese mismo envío.

## 2. Faltas (no-show)

| Regla | Valor |
|---|---|
| Quién puede marcar | El organizador y cualquier jugador anotado del partido. Nadie se marca a sí mismo |
| A quién se puede marcar | A cualquier otro anotado, incluido el organizador |
| Dónde se marca | En el paso "¿Faltó alguien?" del modal de calificación, que lista a **todos** los anotados |
| Cuándo existe una falta | En el momento en que la marca el **organizador** o **al menos 2 jugadores** |
| Cuándo se calcula | Cada vez que alguien envía su calificación |
| ¿Se puede deshacer? | **No.** Las marcas son de un solo envío. Un error se corrige a mano en la base |
| Efecto en el puntaje | Cuenta como **una calificación de 1 ★** |
| Estrellas de ese partido | Se descartan las que el jugador que faltó **recibió** y las que **dio** en ese partido |
| Visibilidad | "Faltas (90 días): N" en el perfil propio y en el ajeno |

Si una marca no llega al umbral antes de que cierre la ventana, se pierde: no hay falta.

## 3. Baja tarde

- Es **baja tarde** cuando un jugador anotado se baja a **menos de 2 h** de la hora de inicio, o cuando el
  **organizador cancela** el partido a menos de 2 h.
- Cuenta como **una calificación de 2 ★** en el puntaje de quien se baja o cancela.
- **No es una falta** y no cuenta para la suspensión.
- Cancelar una **solicitud pendiente**, aunque sea a último momento, no penaliza: el jugador todavía no
  estaba anotado.

## 4. Puntaje

```
puntaje = promedio de:
  + las estrellas recibidas (descontando las de los partidos donde hubo falta, propia o de quien calificó)
  + 1 ★ por cada falta
  + 2 ★ por cada baja tarde
```

- Sin ningún dato, el puntaje es `—`, no 0.
- Se redondea a un decimal, como hoy.

## 5. Suspensión

| Regla | Valor |
|---|---|
| Qué la dispara | Juntar **3 faltas en 90 días** |
| Primera suspensión | **7 días** |
| Reincidencia | Volver a juntar 3 faltas en 90 días **dentro de los 12 meses** posteriores a la suspensión anterior → **6 meses** |
| Reinicio | Tras 12 meses sin suspensiones, la escalera vuelve a empezar desde 7 días |
| Cuándo empieza | En el momento en que la tercera falta pasa a existir |
| Conteo | Después de una suspensión, las faltas que la dispararon no se vuelven a contar |

**Mientras dura la suspensión:**

- **No puede** pedir sumarse a partidos (incluido el swipe a la derecha) ni crear partidos. La API responde
  **403** y la app muestra "Estás suspendido hasta el dd/mm por faltas".
- **Sí puede** ver partidos, bajarse de los que ya está anotado, cancelar los que organiza y calificar.
- Los partidos en los que ya estaba anotado y sus solicitudes pendientes se mantienen. El organizador decide
  si acepta la solicitud.
- "Suspendido hasta dd/mm" se ve solo en el perfil propio.

## 6. Notificaciones

Canal actual: **solo in-app** (campanita). **Push PWA** en las últimas semanas del S2, con `web-push`
(estándar Web Push, sin FCM). **Mail: fuera por ahora.** Preferencias de notificación: fuera de alcance.

| Tipo | Cuándo | A quién |
|---|---|---|
| Solicitud recibida | Un jugador pide sumarse | Organizador |
| Solicitud aceptada | El organizador acepta | Jugador |
| Solicitud rechazada | El organizador rechaza | Jugador |
| Partido cancelado | El organizador cancela, con el motivo | Anotados **y** jugadores con solicitud pendiente |
| Un jugador se bajó | Un anotado deja el partido | Organizador |
| Partido editado | Cambia **fecha, hora o lugar** (no la descripción ni el cupo) | Anotados **y** jugadores con solicitud pendiente |
| Te marcaron falta | Una falta pasa a existir | El jugador que faltó |
| Quedaste suspendido | Una falta dispara una suspensión | El jugador suspendido |

- Nadie recibe una notificación por algo que hizo él mismo.
- **La campanita:** en desktop va al lado de la foto de perfil del header. En mobile va en el header del
  Mapa, y hay un badge de no leídas sobre el tab de Perfil. El contador se refresca cada 30 s y al volver a
  la pestaña.
- Tocar una notificación la marca como leída y lleva al partido.
- Futuro (no planificado en el S2): recordatorio antes del partido (WBS 11.1.4).

## 7. Mapa

- Es la **pantalla de inicio**: después de iniciar sesión, la app abre el Mapa.
- Proveedor: **Leaflet + OpenStreetMap** (sin costo, con atribución visible).
- Muestra los **partidos disponibles**, los mismos que Descubrir: futuros, activos, con lugar, que no
  organizo, en los que no estoy anotado y a los que no pedí sumarme.
- **Centro inicial:** la ubicación del jugador. Si no da permiso, el centroide de los partidos visibles.
- **Filtros** (solo en el Mapa):
  - **Día** (excluyentes entre sí): Hoy · Mañana · Esta noche (hoy desde las 19:00) · Fin de semana
    (el próximo sábado y domingo; si hoy es sábado o domingo, este mismo). Hora de Argentina.
  - **Nivel:** Principiante · Intermedio · Avanzado. "Casual" no existe en el modelo y se omite.
  - **Deporte.**
  - **Cerca:** a menos de 5 km del jugador. Solo se puede usar si el jugador dio su ubicación.
  - El chip "Lugares libres" del diseño se omite: el Mapa ya muestra solo partidos con lugar.
- Tocar un pin abre el detalle del partido.

## 8. Lugar del partido

- En el paso "Lugar" del wizard se escribe una dirección y se **autocompleta** (como Google Maps), con un
  servicio de direcciones sobre OpenStreetMap (Photon).
- Al elegir una dirección aparece un **mini mapa con el pin**, que se puede **arrastrar** para ajustar.
- El partido guarda el nombre del lugar que ve el usuario y sus coordenadas. Un partido nuevo **no se puede
  crear sin coordenadas**.
- Los partidos anteriores a este cambio no tienen coordenadas y no aparecen en el Mapa.

## 9. Descubrir y compatibilidad

- Descubrir es una **caja negra del back**: el usuario no filtra. Trae los partidos disponibles.
- El orden es por **compatibilidad**:
  1. Primero, los partidos cuyo nivel coincide con el nivel más frecuente de los partidos que jugó el
     jugador.
  2. Después, el puntaje del organizador, de mayor a menor.
  3. Después, la fecha, del más próximo al más lejano.
- Un jugador sin partidos jugados se ordena solo por (2) y (3).
- El próximo sprint se puede reemplazar por un algoritmo más interesante sin cambiar la app.

## 10. Fuera de alcance (S2)

- Mail y preferencias de notificación.
- Deshacer una falta o apelarla.
- Recordatorio antes del partido (S3, 11.1.4).
- Filtros en Descubrir.
