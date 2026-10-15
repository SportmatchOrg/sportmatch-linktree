# Cronograma y PERT — SportMatch v5 (Desarrollo)

Recalculado sobre **`WBS-SportMatch-v5.md`** al cierre del S2 (Steering 2, 15/10). Reemplaza al
*Cronograma y PERT v4* como plan vigente; la v4 queda **congelada como línea base del S1 y el S2** y es contra
la que se mide lo que pasó hasta acá.

**Qué cambia respecto de la v4.**

- **El S2 está cerrado.** Sus paquetes llevan fechas reales, tomadas de Linear al 14/10.
- **El S3 suma 11 paquetes de desarrollo (25,99 h)** del alcance agregado en la WBS v5: primer uso guiado,
  imágenes personalizadas y contenido generado con IA.
- **11.2.3 se descarta** (preferencias de notificación, fuera de alcance desde el 24/09).
- **La documentación funcional (10.1.1 y 10.1.2) sale del cronograma**: la hacen los PMs, como el resto de
  lo que no es código, y no se planifica acá.
- **Las lanes son las del S2**: desde el 24/09 cada dev pasó por otro rol (Rudolph → Front, Pacheco → Back,
  Siaba → Back y Front).
- **El S3 sigue el plan de ejecución del 15/10, cargado en Linear**: cada paquete cae en una sola semana y con
  un solo dev (§6), en lugar de que el planificador lo reparta en las tres.

Los datos salen de la WBS v5 y del export de Linear por `scripts/generate-v5.py`, que también escribe la v5
de `leadership/pert.html` y `leadership/gantt.html`.

---

## 1. Supuestos del modelo

Los mismos de la v4, con cuatro cambios:

- **Alcance:** módulos **3.0 a 15.0 excepto el 8.0**: 89 paquetes y 251,61 h. Del S3 quedan fuera del
  cronograma 10.1.1 y 10.1.2 (de los PMs, 9,17 h) y 11.2.3 (descartado, 1,63 h).
- **Lo hecho lleva fechas reales:** la semana del primer ticket empezado y la del último cerrado en Linear.
  Los paquetes del S2 y lo del S3 que se adelantó en la semana 10 (6.5.2, 6.5.3, 12.1.1, 12.1.2) están ✅.
- **Lo pendiente se planifica desde la semana 11**, con la misma regla de la v4: un dev puede encadenar una
  dependencia dentro de la semana; entre devs distintos el sucesor arranca la semana siguiente.
- **Lanes del S2:** 1 Front (Rudolph), 2 Back (Pacheco), 3 Back y Front (Siaba). La columna "Dev" de lo hecho
  muestra quién cerró los tickets del paquete.

Siguen iguales: horas de desarrollo (no story points), estimación PERT de tres puntos, 3 devs × 6 h/semana,
semanas de jueves a jueves con cierre a las 18 h y la semana del 05/11 al 12/11 de reserva.

---

## 2. Calendario

| Sprint | Ventana | Semanas | Capacidad | Esfuerzo WBS | Uso | Cierre |
|---|---|---:|---:|---:|---:|---|
| **S1** | 06/08 → 17/09 | 1–6 | 108 h | 123,70 h | 115 % | Steering 1 ✅ |
| **S2** | 17/09 → 15/10 | 7–10 | 72 h | 56,73 h | 79 % | Steering 2 ✅ |
| **S3** | 15/10 → **05/11** | 11–13 | 54 h | **49,50 h** | **92 %** | Fin del desarrollo |
| Reserva | 05/11 → **12/11** | 14 | — | — | — | Entrega final |

El S2 usó el 79 % de su capacidad en paquetes de la WBS. **El resto no quedó libre**: se fue en trabajo que
la WBS no tiene como paquete (refactor de idioma, bugs de QA y retrabajo, unos 18 SP; ver §5).

El S3 queda al **92 %** con el alcance agregado: **4,5 h de margen** en las tres semanas, más la semana de
reserva, que sigue sin nada planificado.

---

## 3. Alcance agregado en la v5

| Entregable | Paquetes | Horas | Semanas |
|---|---|---:|---|
| Primer uso guiado | 5.3.1 · 5.3.2 · 5.3.3 · 7.1.4 | 7,08 | 11 y 12 |
| Imágenes personalizadas | 14.1.1 · 14.1.2 · 14.1.3 | 8,08 | 12 y 13 |
| Contenido generado con IA | 15.1.1 · 15.1.2 · 15.1.3 · 15.2.1 | 10,83 | 12 y 13 |
| **Total de desarrollo** | **11 paquetes** | **25,99** | |

Fuera del modelo de desarrollo: **2.2.9** (diseño de las pantallas nuevas, de los PMs, 3,17 h) y **8.1.11**
(prueba manual, 1,58 h). El detalle y las decisiones (#7 a #10) están en la WBS v5.

---

## 4. Plan por sprint

El S1 no cambia respecto de la v4 (§4 de ese documento). 🔷 = paquete nuevo en la v5.

### S2 — 56.73 h

| ID | Paquete | Dur (h) | Holgura | Dev | Inicio | Fin | Estado |
|---|---|---:|---:|---|---|---|:---:|
| 5.1.1 | Modelo de perfil | 1.50 | 8.52 | Pacheco | 13/08 | 15/10 | ✅ |
| 5.1.4 | Servicio de cálculo de rating | 3.00 | 9.41 | Pacheco | 10/09 | 08/10 | ✅ |
| 5.2.2 | Edición de perfil | 2.22 | 5.45 | Rudolph | 01/10 | 15/10 | ✅ |
| 5.2.3 | Vista de historial | 1.50 | 14.05 | Pacheco | 03/09 | 24/09 | ✅ |
| 6.1.4 | Cancelación de partido con motivo | 2.35 | 33.52 | Siaba | 17/09 | 24/09 | ✅ |
| 6.2.5 | Interfaz de cancelación | 1.63 | 33.52 | Pacheco | 17/09 | 01/10 | ✅ |
| 6.2.6 | Notificación de cancelación a participantes | 1.50 | 5.40 | Pacheco | 24/09 | 01/10 | ✅ |
| 6.4.3 | Regla de penalización por no-show | 2.35 | 9.41 | Pacheco | 24/09 | 08/10 | ✅ |
| 7.1.1 | Búsqueda de partidos | 4.62 | 25.79 | Rudolph | 03/09 | 01/10 | ✅ |
| 7.1.2 | Filtros (deporte, nivel, fecha) | 3.12 | 30.41 | Rudolph | 01/10 | 15/10 | ✅ |
| 7.1.3 | Ordenamiento por rating y compatibilidad | 1.63 | 9.41 | Pacheco | 01/10 | 08/10 | ✅ |
| 7.3.1 | Integración con proveedor de mapa | 4.28 | 21.99 | Siaba | 24/09 | 08/10 | ✅ |
| 7.3.2 | Visualización de partidos en mapa | 2.47 | 21.99 | Rudolph | 24/09 | 01/10 | ✅ |
| 7.3.3 | Detalle de partido desde mapa | 3.90 | 21.99 | Rudolph | 24/09 | 01/10 | ✅ |
| 11.1.1 | Modelo de notificación | 2.35 | 6.12 | Siaba | 17/09 | 24/09 | ✅ |
| 11.1.2 | Selección de proveedor de push y email | 1.63 | 6.84 | Siaba | 24/09 | 08/10 | ✅ |
| 11.1.3 | Servicio de envío de notificaciones | 4.75 | -0.00 | Pacheco | 24/09 | 01/10 | ✅ |
| 11.2.1 | Centro de notificaciones | 3.90 | 12.24 | Rudolph | 24/09 | 01/10 | ✅ |
| 11.2.2 | Recepción de push en cliente | 4.03 | 14.46 | Siaba | 01/10 | 08/10 | ✅ |
| 11.2.3 | Preferencias de notificación | 1.63 | — | — | — | — | ❌ |
| 13.1.1 | Instrumentación para KPIs | 1.50 | 16.12 | Rudolph | 01/10 | 08/10 | ✅ |
| 13.1.2 | Cálculo y persistencia de KPIs | 2.50 | 16.12 | Rudolph | 01/10 | 08/10 | ✅ |

### S3 — 60.38 h · 49.50 h pendientes de desarrollo

| ID | Paquete | Dur (h) | Holgura | Dev | Inicio | Fin | Estado |
|---|---|---:|---:|---|---|---|:---:|
| 5.3.1 🔷 | Backend de onboarding | 1.58 | 8.75 | Siaba | 15/10 | 22/10 | ⬜ |
| 5.3.2 🔷 | Pantalla de onboarding | 3.00 | 8.11 | Rudolph | 22/10 | 29/10 | ⬜ |
| 5.3.3 🔷 | Tutorial de Descubrir | 1.00 | 29.41 | Rudolph | 15/10 | 22/10 | ⬜ |
| 6.5.1 | Link compartible de partido | 2.47 | 32.93 | Rudolph | 08/10 | 22/10 | 🟡 |
| 6.5.2 | Invitación directa a un usuario | 3.90 | 0.00 | Pacheco | 01/10 | 15/10 | ✅ |
| 6.5.3 | Aceptación de invitación | 3.00 | 0.00 | Pacheco | 08/10 | 15/10 | ✅ |
| 7.1.4 🔷 | Recomendación con el perfil declarado | 1.50 | 9.41 | Siaba | 15/10 | 22/10 | ⬜ |
| 10.2.2 | Documentación de APIs | 1.50 | 5.40 | Pacheco | 29/10 | 05/11 | ⬜ |
| 11.1.4 | Job de recordatorio pre-partido | 3.12 | 3.78 | Rudolph | 15/10 | 22/10 | ⬜ |
| 12.1.1 | Modelo de reporte | 2.35 | 5.84 | Pacheco | 08/10 | 15/10 | ✅ |
| 12.1.2 | Endpoint de creación de reporte | 1.63 | 5.84 | Pacheco | 08/10 | 15/10 | ✅ |
| 12.1.3 | Interfaz de reporte | 3.00 | 8.10 | Rudolph | 15/10 | 22/10 | ⬜ |
| 12.2.1 | Panel de revisión de reportes | 6.27 | 5.84 | Pacheco | 15/10 | 22/10 | ⬜ |
| 12.2.2 | Suspensión de usuario | 4.03 | 5.84 | Rudolph | 22/10 | 29/10 | ⬜ |
| 12.2.3 | Historial de moderación | 3.12 | 6.75 | Rudolph | 29/10 | 05/11 | ⬜ |
| 14.1.1 🔷 | Almacenamiento de imágenes | 3.00 | 18.31 | Siaba | 22/10 | 29/10 | ⬜ |
| 14.1.2 🔷 | Foto de perfil propia | 2.08 | 5.45 | Siaba | 22/10 | 29/10 | ⬜ |
| 14.1.3 🔷 | Foto del partido | 3.00 | 18.31 | Siaba | 29/10 | 05/11 | ⬜ |
| 15.1.1 🔷 | Integración con proveedores de IA | 1.67 | 20.64 | Pacheco | 22/10 | 29/10 | ⬜ |
| 15.1.2 🔷 | Interpretación de texto a partido | 2.58 | 20.64 | Pacheco | 22/10 | 29/10 | ⬜ |
| 15.1.3 🔷 | Crear partido por texto o voz | 3.00 | 20.64 | Rudolph | 29/10 | 05/11 | ⬜ |
| 15.2.1 🔷 | Generación de imágenes con IA | 3.58 | 5.45 | Pacheco | 29/10 | 05/11 | ⬜ |

---

## 5. Estado al cierre del S2 (14/10)

### Ejecución semanal (story points de Linear)

| Semana | Cargado | Hecho | Nota |
|---|---:|---:|---|
| 7 · 17/09 → 24/09 | 18 | 18 | SPO-224 se mergeó el 24/09 a las 23:42, unas horas después del cierre |
| 8 · 24/09 → 01/10 | 18 | 18 | Todo cerrado el 30/09 |
| 9 · 01/10 → 08/10 | 20 | 20 | Incluye los 2 SP del Challenge (SPO-276, SPO-277), sumados a mitad de semana |
| 10 · 08/10 → 15/10 | 18 | 17 | Abierto al 14/10: SPO-282 (datos y guion de la demo). Se sumó el release a producción (SPO-281), fuera del plan |
| Sin semana asignada | — | 4 | SPO-225, SPO-249, SPO-283 y SPO-284 |

**77 SP cerrados sobre 72 de capacidad.** La ejecución sigue igual que en el S1: lo que se compromete se cierra.

### Contra la línea base de la v4

- **Todos los paquetes del S2 cerraron**, salvo 11.2.3 (descartado) y 10.1.2 (de los PMs, sale del cronograma).
- **Atrasados una semana y recuperados dentro del sprint:** 6.4.3 (no-show) y 7.1.1 (búsqueda).
- **Adelantados:** 6.2.6 (de la semana 10 a la 8) y, del S3, **6.5.2, 6.5.3, 12.1.1, 12.1.2 y el back de 6.5.1**:
  unas 11 h de las 40,39 h del S3 de la línea base, cerca del **27 %**, más el back del link compartible.
- **Cambios de alcance:** push con `web-push` y sin mail, mapa como pantalla de inicio con Google Maps,
  filtros solo en el mapa y el **13.0 Challenge**, que entró a mitad del sprint (4 h).
- **Trabajo fuera de la WBS: unos 18 SP**, casi una semana de capacidad. Son el refactor de idioma
  (SPO-201 y SPO-204) y los bugs y el retrabajo (SPO-190, 210, 220, 223, 225, 249, 250 y 283).
- **Producción al día:** el release del 14/10 (PR #136) dejó `main` igual que `dev`.

---

## 6. Calendario semana a semana

Plan de ejecución del S3 acordado el 15/10 y cargado en Linear. 🔷 = paquete nuevo en la v5.

- **Balanceado entre semanas y entre devs:** 12, 13 y 14 SP por semana y 13 SP por dev, con 4 o 5 SP por
  dev y semana. Cada uno queda en su lane: el front va a Rudolph y el back a Pacheco.
- **Semana 11:** lo que destraba el resto: el rol de admin y el panel, el back del onboarding, el reporte y
  el recordatorio.
- **Semana 12:** el bloqueo, que usa el rol de admin de la semana 11, y la base de imágenes e IA. Cada cadena
  queda en manos de un solo dev (Pacheco: 15.1.1 → 15.1.2 · Siaba: 14.1.1 → 14.1.2).
- **Semana 13:** el front de la IA (15.1.3) y lo recortable, en este orden si la validación con usuarios
  (8.2) trae ajustes: 15.2.1 → 14.1.3 → 12.2.3 → 10.2.2 → health (SPO-257).

| Semana | Rudolph | Pacheco | Siaba | SP |
|---|---|---|---|---:|
| 11 | SPO-259, 265, 268, 290 | SPO-266, 269, 270 | SPO-282, 285, 286 | 12 |
| 12 | SPO-271, 272, 289 | SPO-288, 293 | SPO-287, 291 | 13 |
| 13 | SPO-273, 294 | SPO-274, 295 | SPO-257, 292 | 14 |
| **Total** | **13** | **13** | **13** | **39** |

La carga de la tabla de abajo está en horas de la WBS contra las 18 h de capacidad de la semana.

| Sem | Ventana | Sprint | Rudolph (Front) | Pacheco (Back) | Siaba (Back y Front) | Carga |
|---|---|---|---|---|---|---:|
| 11 | 15/10 → 22/10 | S3 | 5.3.3 🔷 Tutorial de Descubrir<br>6.5.1 Link compartible de partido<br>11.1.4 Job de recordatorio pre-partido<br>12.1.3 Interfaz de reporte | 12.2.1 Panel de revisión de reportes | 5.3.1 🔷 Backend de onboarding<br>7.1.4 🔷 Recomendación con el perfil declarado | 18.9 / 18 h |
| 12 | 22/10 → 29/10 | S3 | 5.3.2 🔷 Pantalla de onboarding<br>12.2.2 Suspensión de usuario | 15.1.1 🔷 Integración con proveedores de IA<br>15.1.2 🔷 Interpretación de texto a partido | 14.1.1 🔷 Almacenamiento de imágenes<br>14.1.2 🔷 Foto de perfil propia | 16.4 / 18 h |
| 13 | 29/10 → 05/11 | S3 | 12.2.3 Historial de moderación<br>15.1.3 🔷 Crear partido por texto o voz | 10.2.2 Documentación de APIs<br>15.2.1 🔷 Generación de imágenes con IA | 14.1.3 🔷 Foto del partido | 14.2 / 18 h |
| 14 | 05/11 → 12/11 | reserva | — | — | — | 0.0 / 18 h |

**Lo que tienen que tener listo los PMs, por semana:**

| Antes de | Qué | Para |
|---|---|---|
| 22/10 (semana 12) | Elegir los proveedores de IA (texto e imágenes) y conseguir las claves | 15.1.1 y 15.1.2 |
| 15/10 (semana 11) | Diseño 2.2.9 del tutorial de Descubrir, o plan B con los componentes existentes | 5.3.3 |
| 22/10 (semana 12) | Diseño 2.2.9 de la pantalla de onboarding | 5.3.2 |
| 29/10 (semana 13) | Diseño 2.2.9 del campo de IA en el wizard | 15.1.3 |

---

## 7. PERT y holguras del S3

PERT completo (131 paquetes): camino crítico de 83.84 h · 1.1.1 → 3.1.1 → 3.1.2 → 4.1.1 → 6.3.1 → 6.3.2 → 6.3.3 → 11.1.3 → 6.5.2 → 6.5.3 → 8.1.9 → 8.2.1 → 8.2.2 → 8.2.3 → 8.2.4 → 1.4.1
PERT de desarrollo (89 paquetes): camino crítico de 42.00 h · 3.1.1 → 3.1.2 → 4.1.1 → 6.3.1 → 6.3.2 → 6.3.3 → 11.1.3 → 6.5.2 → 6.5.3

El camino crítico **no cambia respecto de la v4** y ya está cerrado: termina en 6.5.3, que se completó el
14/10. Ningún paquete nuevo es crítico.

| ID | Paquete | Dur (h) | ES | EF | LS | LF | Holgura |
|---|---|---:|---:|---:|---:|---:|---:|
| 5.3.1 🔷 | Backend de onboarding | 1.58 | 28.67 | 30.25 | 37.42 | 39.00 | 8.75 |
| 5.3.2 🔷 | Pantalla de onboarding | 3.00 | 30.89 | 33.89 | 39.00 | 42.00 | 8.11 |
| 5.3.3 🔷 | Tutorial de Descubrir | 1.00 | 11.59 | 12.59 | 41.00 | 42.00 | 29.41 |
| 6.5.1 | Link compartible de partido | 2.47 | 6.60 | 9.07 | 39.53 | 42.00 | 32.93 |
| 7.1.4 🔷 | Recomendación con el perfil declarado | 1.50 | 31.09 | 32.59 | 40.50 | 42.00 | 9.41 |
| 10.2.2 | Documentación de APIs | 1.50 | 35.10 | 36.60 | 40.50 | 42.00 | 5.40 |
| 11.1.4 | Job de recordatorio pre-partido | 3.12 | 35.10 | 38.22 | 38.88 | 42.00 | 3.78 |
| 12.1.3 | Interfaz de reporte | 3.00 | 30.90 | 33.90 | 39.00 | 42.00 | 8.10 |
| 12.2.1 | Panel de revisión de reportes | 6.27 | 25.86 | 32.13 | 31.70 | 37.97 | 5.84 |
| 12.2.2 | Suspensión de usuario | 4.03 | 32.13 | 36.16 | 37.97 | 42.00 | 5.84 |
| 12.2.3 | Historial de moderación | 3.12 | 32.13 | 35.25 | 38.88 | 42.00 | 6.75 |
| 14.1.1 🔷 | Almacenamiento de imágenes | 3.00 | 14.11 | 17.11 | 32.42 | 35.42 | 18.31 |
| 14.1.2 🔷 | Foto de perfil propia | 2.08 | 30.89 | 32.97 | 36.34 | 38.42 | 5.45 |
| 14.1.3 🔷 | Foto del partido | 3.00 | 17.11 | 20.11 | 35.42 | 38.42 | 18.31 |
| 15.1.1 🔷 | Integración con proveedores de IA | 1.67 | 14.11 | 15.78 | 34.75 | 36.42 | 20.64 |
| 15.1.2 🔷 | Interpretación de texto a partido | 2.58 | 15.78 | 18.36 | 36.42 | 39.00 | 20.64 |
| 15.1.3 🔷 | Crear partido por texto o voz | 3.00 | 18.36 | 21.36 | 39.00 | 42.00 | 20.64 |
| 15.2.1 🔷 | Generación de imágenes con IA | 3.58 | 32.97 | 36.55 | 38.42 | 42.00 | 5.45 |

Los de menos holgura son **11.1.4 (3,78 h)**, la cadena de moderación **12.2.x (5,84 h)** y
**14.1.2 → 15.2.1 (5,45 h)**: son los que no pueden correrse.

---

## 8. Riesgos del S3

| # | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| R5 | **El S3 queda al 92 %.** Si la validación con usuarios (8.2) trae ajustes, no hay lugar para hacerlos sin sacar algo. | Alto | Orden de corte acordado antes de empezar: primero 15.2.1 (imágenes con IA, 3,58 h), después 14.1.3 (foto del partido, 3 h). Ninguno es prerrequisito de otro paquete del S3. |
| R9 | **La moderación se reparte en dos semanas y dos devs:** el bloqueo (Rudolph, semana 12) usa el rol de admin y el panel (Pacheco, semana 11). | Medio | SPO-266 (rol de admin) es lo primero de la semana 11. El historial (12.2.3) queda en la 13 y es recortable. |
| R6 | **Los proveedores de IA no están elegidos** y 15.1.1 arranca la semana 12. | Alto | Decidir antes del 22/10. Si no está, 15.1.x se corre a la semana 13 (holgura de 20,64 h) y 15.2.1 sale del S3 (R5). |
| R7 | **El onboarding, el tutorial y el campo de IA no tienen diseño** (2.2.9). | Medio | Los PMs lo cierran por semana (§6). Plan B: se arman con los componentes de Editar perfil y del wizard, sin pantallas nuevas. El tutorial (semana 11) ya va con el plan B. |
| R10 | **15.2.1 (semana 13, Pacheco) usa 14.1.3**, que Siaba hace esa misma semana. | Bajo | La foto de perfil generada con IA sale sola; la del partido se suma al final. 15.2.1 es el primero a cortar (R5). |
| R8 | **Imágenes subidas y generadas por usuarios.** Contenido inapropiado y costo de almacenamiento. | Medio | Validar tipo y tamaño en 14.1.1; las fotos quedan dentro de los reportes de moderación (12.1); límite de uso por usuario en 15.1.1. |
| R2 | **El rol de administrador** (12.2.1) sigue sin existir. | Medio | Primer ticket de la moderación en la semana 11 (SPO-266). |

R1, R3 y R4 de la v4 quedaron resueltos en el S2: 11.1.3 cerró en la semana 8, las coordenadas entraron con
SPO-227 y la capacidad del S2 alcanzó.

---

## 9. Hitos

| Hito | Fecha | Estado |
|---|---|---|
| Steering 2 · MVP funcional completo | 15/10 | ✅ en producción desde el 14/10 |
| Fin del desarrollo | **05/11** | Plan v5: 49,50 h sobre 54 h |
| Entrega final | **12/11** | Después de la semana de reserva |
