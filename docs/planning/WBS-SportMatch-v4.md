# WBS SportMatch — v4

Documento interno del equipo. Mantiene el detalle necesario para derivar el backlog y los tickets.
Para presentación a docentes se utiliza una versión resumida de alto nivel.

**Qué cambia respecto de la v3.** La v3 describía el alcance planificado. Esta versión incorpora los
**entregables que el equipo efectivamente construyó y que ningún paquete de la v3 nombraba**: la entrada
al producto (landing pública y shell de navegación), la autenticación federada, el catálogo de deportes,
la vista de mis partidos, la inscripción directa, el perfil público de otro jugador, el QA automatizado
sobre cada pull request y la contenedorización del backend. Son **13 paquetes nuevos por 32,50 h**.

**No** se incorporan como paquetes los arreglos ni el retrabajo surgidos del propio desarrollo: no son
alcance, son consecuencia. Dos paquetes existentes amplían su contenido sin cambiar de número (**3.1.2**
y **3.2.3**) y dos actualizan su descripción para reflejar cómo se resolvieron (**2.3.1** y **4.1.2**).
Además, **3.1.2 se recalibra de 3 h a 15 h** contra lo que la capacitación costó en la ejecución.

| | v2 | v3 | v4 | Δ v3→v4 |
|---|---:|---:|---:|---:|
| Paquetes de trabajo | 79 | 103 | **116** | +13 |
| Esfuerzo total estimado | 433,17 h | 395,77 h | **440,27 h** | +44,50 h |

De las 44,50 h de diferencia, **32,50 h son los 13 paquetes nuevos** —25,00 h de desarrollo de producto
(módulos 4.0 a 7.0) y 7,50 h de QA automatizado y deployment (8.3 y 9.1.4)— y **12,00 h son la
recalibración de 3.1.2**.

**Agregado el 07/10: 13.0 Challenge.** El reporte diario de KPIs que pidió la cátedra (Lab4,
`docs/challenge/ADR.md`) suma **2 paquetes por 4,00 h**, el tope de impacto sobre el proyecto que fija el
ADR. Su ventana la fijó el equipo, del 01/10 al 14/10, y no sale del planificador. Quedan fuera de la
comparación v3→v4 de arriba.

**Convención.** Cada paquete lleva número, descripción, dependencias y estimación en horas.
La estimación usa el método PERT sobre tres puntos: DO optimista, DM más probable, DP pesimista,
con `Estimación = (DO + 4·DM + DP) / 6`. Los paquetes de desarrollo fueron **recalibrados con un
factor 0,75** contra la velocidad real medida en las cuatro primeras semanas del proyecto, de modo
que el plan refleje cómo entrega efectivamente este equipo de tres personas.
Los paquetes marcados 🆕 son nuevos en la v3; los marcados ✳️ son **nuevos en la v4**.
La fuente de verdad de las estimaciones es `docs/planning/estimaciones-wbs.csv`.

---

## Entregables incorporados en la v4

Relevamiento completo del estado real en `docs/planning/Estado-real-WBS-15-09.md`.

| Entregable construido | Paquete v4 |
|---|---|
| Autenticación federada con proveedor de identidad | 4.1.4 |
| Inicio de sesión con Google | 4.2.2 |
| Recuperación de contraseña | 4.2.3 |
| Landing pública y animación de entrada | 4.2.4 |
| Shell de navegación con barra inferior | 4.2.5 |
| Estadísticas de actividad del perfil | 5.1.5 |
| Perfil público de otro jugador | 5.2.5 |
| Catálogo de deportes como entidad | 6.1.5 |
| Vista "Mis partidos" | 6.2.4 |
| Inscripción directa y baja del partido | 6.3.5 |
| Revisión automática de pull requests | 8.3.1 |
| Harness de pruebas end-to-end de la API | 8.3.2 |
| Contenedorización y registro de imágenes | 9.1.4 |

Quedaron **fuera** a propósito: el refactor de idioma del código (escrito y estimado, no ejecutado, y
además retrabajo de una decisión propia de nomenclatura) y todos los arreglos puntuales de desarrollo.

---

## Decisiones de producto tomadas

La propuesta de extensión dejaba seis puntos abiertos. Quedaron resueltos así:

| # | Decisión | Resolución | Impacto |
|---|---|---|---|
| 1 | Proveedor de push y de email (11.1.2) | *Revisado el 24/09:* **Web Push estándar con la librería `web-push`** (claves VAPID), sin FCM. **Mail fuera de alcance** por ahora | Costo cero; una sola librería en el backend |
| 2 | Ventana del recordatorio pre-partido (11.1.4) | **24 horas antes**, un único envío, sin configuración por usuario | Simplifica el job: no hay ventanas múltiples ni reintentos programados |
| 3 | Preferencias de notificación (11.2.3) | *Revisado el 24/09:* **fuera de alcance.** Sin mail no hay canales entre los que elegir | Las 1,63 h quedan en la línea base, sin ejecutar |
| 4 | Esquema de deep-linking (6.5.1) | **URL pública simple** `/partidos/:id` en modo lectura. No hay app nativa, así que no se requieren app links | Evita el trabajo de universal links; queda definir qué datos se exponen sin sesión |
| 5 | Invitación directa y aprobación (6.5.3) | La invitación **reutiliza el modelo de solicitud** (6.3.1) con origen `invitacion`. El invitado acepta y queda anotado sin aprobación adicional del organizador, porque fue él quien invitó | Evita un modelo paralelo. Si la decisión se revierte, 6.5.3 pasa de 4 h a unas 8 h |
| 6 | Panel de moderación (12.2) | **Panel completo con acciones**: listado con filtros, suspensión de usuario e historial de moderación | +17,83 h. Convierte a Moderación en un módulo real y **obliga a introducir un rol de administrador**, que hoy no existe en el modelo de usuario |

---

## Paquetes que la extensión no contemplaba y que se agregaron

La propuesta original describía backend y frontend de los módulos nuevos, pero no el diseño ni la
validación que arrastran. Sin estos cuatro paquetes el WBS quedaría incompleto:

- **2.2.7** Pantallas de notificaciones y **2.2.8** Pantallas de moderación — los módulos nuevos
  suman pantallas que hoy no existen en el Figma.
- **8.1.8**, **8.1.9** y **8.1.10** — pruebas manuales de notificaciones, invitaciones y moderación,
  en línea con las que ya existen para el resto de los módulos.

Además, dos paquetes existentes amplían su contenido sin cambiar de número: **2.3.1** (el DER suma
las entidades de notificación, reporte e historial de moderación) y **10.2.2** (la documentación de
APIs cubre los endpoints nuevos).

---

## Secuencia recomendada

El módulo de Notificaciones es prerrequisito de dos paquetes de otros módulos: la invitación
directa (6.5.2) y el aviso de cancelación (6.2.6). Conviene cerrar **11.1.1 → 11.1.2 → 11.1.3**
antes de arrancar cualquiera de los dos.

El panel de moderación (12.2.1) introduce el **rol de administrador**, que no existe hoy en el
modelo de usuario ni en el guard de autenticación. Es la dependencia oculta más cara de la v3 y
conviene resolverla al inicio del módulo, no al final.

---

# Paquetes de trabajo

## 1.0 Gestión del Proyecto

### 1.1 Planificación y documentación inicial

**1.1.1** — Project Charter: documento con objetivo, alcance, supuestos, restricciones, stakeholders, entregables principales y requerimientos.
<br>*Dependencias:* — · *Estimación:* 7 h (DO 4 / DM 7 / DP 10)

**1.1.2** — WBS: descomposición del trabajo del proyecto en paquetes ejecutables orientados a entregables.
<br>*Dependencias:* 1.1.1 · *Estimación:* 6.33 h (DO 4 / DM 6 / DP 10)

**1.1.3** — Cronograma y PERT: cronograma del proyecto, secuencia, duración estimada y camino crítico identificado.
<br>*Dependencias:* 1.1.2 · *Estimación:* 8 h (DO 4 / DM 8 / DP 12)

### 1.2 Gestión ágil y seguimiento

**1.2.1** — Backlog priorizado: épicas, historias de usuario y tareas priorizadas para el MVP.
<br>*Dependencias:* 1.1.1 · *Estimación:* 6.33 h (DO 4 / DM 6 / DP 10)

**1.2.2** — Plan de sprints: distribución de funcionalidades en 3 sprints de un mes priorizando los flujos centrales.
<br>*Dependencias:* 1.2.1 · *Estimación:* 4.5 h (DO 3 / DM 4 / DP 8)

**1.2.3** — Reportes de avance y control de desvíos: monitoreo recurrente de avance, bloqueos, riesgos y cronograma.
<br>*Dependencias:* 1.2.2 · *Estimación:* 14.67 h (DO 8 / DM 14 / DP 24)

**1.2.4** — Registro de riesgos: identificación, evaluación y actualización periódica de riesgos técnicos, funcionales y de gestión.
<br>*Dependencias:* 1.1.1 · *Estimación:* 6.33 h (DO 4 / DM 6 / DP 10)

### 1.3 Reuniones de seguimiento

**1.3.1** — Acta de kick-off: alineamiento de objetivos, roles, alcance, expectativas y forma de trabajo.
<br>*Dependencias:* 1.1.1 · *Estimación:* 3 h (DO 2 / DM 3 / DP 4)

**1.3.2** — Minutas quincenales de seguimiento: registro de revisión de avance y próximos pasos.
<br>*Dependencias:* 1.3.1 · *Estimación:* 8.17 h (DO 5 / DM 8 / DP 12)

**1.3.3** — Sprint reviews: demostración de los incrementos funcionales desarrollados al cierre de cada sprint.
<br>*Dependencias:* 1.2.2 · *Estimación:* 5.17 h (DO 3 / DM 5 / DP 8)

### 1.4 Cierre del proyecto

**1.4.1** — Informe final del proyecto: resultados, desvíos, aprendizajes, cumplimiento de objetivos y estado final del MVP.
<br>*Dependencias:* 8.2.4, 9.1.3 · *Estimación:* 7.5 h (DO 5 / DM 7 / DP 12)

**1.4.2** — Presentación final: presentación ejecutiva con explicación del proyecto, alcance desarrollado y demo funcional.
<br>*Dependencias:* 9.1.2, 9.1.3, 10.1.1 · *Estimación:* 6.33 h (DO 4 / DM 6 / DP 10)


## 2.0 Diseño del Producto

### 2.1 Investigación y definición UX

**2.1.1** — Perfiles de usuario principales: jugador y organizador, formalizados y validados.
<br>*Dependencias:* 1.1.1 · *Estimación:* 4 h (DO 2 / DM 4 / DP 6)

**2.1.2** — Sistema visual base: paleta, tipografías y estilos base del MVP.
<br>*Dependencias:* 1.1.1, 2.1.1 · *Estimación:* 4.33 h (DO 3 / DM 4 / DP 7)

### 2.2 Diseño de pantallas

**2.2.1** — Pantallas de autenticación: registro/login y estados de error.
<br>*Dependencias:* 2.1.2 · *Estimación:* 4.17 h (DO 3 / DM 4 / DP 6)

**2.2.2** — Pantallas de perfil: visualización y edición de perfil, historial y rating.
<br>*Dependencias:* 2.1.2 · *Estimación:* 5.33 h (DO 3 / DM 5 / DP 9)

**2.2.3** — Pantallas de creación y edición de partido: flujo paso a paso.
<br>*Dependencias:* 2.1.2 · *Estimación:* 6.33 h (DO 4 / DM 6 / DP 10)

**2.2.4** — Pantalla de solicitudes: vista para aceptar/rechazar y ver estado de solicitud.
<br>*Dependencias:* 2.1.2 · *Estimación:* 5.17 h (DO 3 / DM 5 / DP 8)

**2.2.5** — Vista swipe: experiencia de descubrimiento mediante tarjetas navegables.
<br>*Dependencias:* 2.1.2 · *Estimación:* 6.33 h (DO 4 / DM 6 / DP 10)

**2.2.6** — Vista mapa interactivo: visualización de partidos disponibles en mapa.
<br>*Dependencias:* 2.1.2 · *Estimación:* 6.33 h (DO 4 / DM 6 / DP 10)

**2.2.7** 🆕 — Pantallas de notificaciones: centro de notificaciones con indicador de no leídas y estados vacíos.
<br>*Dependencias:* 2.1.2 · *Estimación:* 3.17 h (DO 2 / DM 3 / DP 5)

**2.2.8** 🆕 — Pantallas de moderación: formulario de reporte y panel de revisión con acciones.
<br>*Dependencias:* 2.1.2 · *Estimación:* 5.17 h (DO 3 / DM 5 / DP 8)

### 2.3 Modelo funcional y de datos

**2.3.1** — Diagrama Entidad-Relación: usuarios, perfiles, deportes, partidos, participantes, solicitudes, ratings e historial.
<br>*Dependencias:* 1.1.1 · *Estimación:* 5.33 h (DO 3 / DM 5 / DP 9)

**2.3.2** — Reglas de negocio: cupos, solicitudes, rating, no-show, edición de partidos y visibilidad.
<br>*Dependencias:* 2.3.1 · *Estimación:* 6.33 h (DO 4 / DM 6 / DP 10)


## 3.0 Capacitación y Setup

### 3.1 Capacitación del equipo

**3.1.1** — Stack tecnológico definido: tecnologías para frontend, backend, base de datos, hosting y herramientas.
<br>*Dependencias:* 1.1.1 · *Estimación:* 4 h (DO 2 / DM 4 / DP 6)

**3.1.2** — Equipo capacitado en stack: nivelación de conocimientos en framework FE/BE y base de datos, mediante la implementación completa de una feature de referencia end-to-end en un repositorio de práctica por persona.
<br>*Dependencias:* 3.1.1 · *Estimación:* 15 h (DO 10 / DM 15 / DP 20)
<br>*Recalibrado en la v4: la v3 estimaba 3 h sobre el supuesto de una nivelación teórica. El ejercicio real fue una feature completa por dev y costó 5 h por persona.*

**3.1.3** — Equipo capacitado en buenas prácticas: uso de issue tracker, Git, PRs, branches y convenciones.
<br>*Dependencias:* 3.1.1 · *Estimación:* 1.5 h (DO 0.8 / DM 1.5 / DP 2.2)

### 3.2 Setup técnico

**3.2.1** — Repositorios y entornos: repos creados, frontend/backend inicializados, dependencias y entornos dev/main.
<br>*Dependencias:* 3.1.1 · *Estimación:* 1.63 h (DO 0.8 / DM 1.5 / DP 3)

**3.2.2** — Base de datos inicial con seed mínima: BD creada con migraciones iniciales y dataset semilla mínimo para arrancar el sistema.
<br>*Dependencias:* 2.3.1, 3.2.1 · *Estimación:* 1.5 h (DO 0.8 / DM 1.5 / DP 2.2)

**3.2.3** — Pipeline de CI: workflow con build, lint y typecheck automáticos, hooks de calidad pre-push en cada máquina y un workflow orquestador único que ordena lo que corre en cada pull request y en cada integración.
<br>*Dependencias:* 3.2.1 · *Estimación:* 2.23 h (DO 0.8 / DM 2.2 / DP 3.8)


## 4.0 Autenticación

### 4.1 Backend de autenticación

**4.1.1** — Modelo de usuario: entidad con campos mínimos del MVP y CRUD.
<br>*Dependencias:* 3.2.2 · *Estimación:* 2.88 h (DO 1.5 / DM 3 / DP 3.8)

**4.1.2** — Servicio de registro, login y logout: alta de usuario, inicio de sesión con sesión válida y cierre de sesión. La sesión se delega en un proveedor de identidad externo en lugar de emitirse propia (ver 4.1.4).
<br>*Dependencias:* 4.1.1 · *Estimación:* 2.22 h (DO 1.5 / DM 2.2 / DP 3)

**4.1.3** — Middleware de rutas privadas: restricción de acceso a funcionalidades autenticadas.
<br>*Dependencias:* 4.1.2 · *Estimación:* 2.35 h (DO 1.5 / DM 2.2 / DP 3.8)

**4.1.4** ✳️ — Integración con proveedor de identidad federada: verificación del token de sesión contra el proveedor en el backend y alta implícita del usuario en su primer inicio de sesión.
<br>*Dependencias:* 4.1.1 · *Estimación:* 4 h (DO 2.5 / DM 4 / DP 6)

### 4.2 Frontend de autenticación y acceso a la app

**4.2.1** — Pantalla de registro e inicio de sesión: formularios conectados al backend con feedback de errores.
<br>*Dependencias:* 2.2.1, 4.1.2 · *Estimación:* 2.35 h (DO 1.5 / DM 2.2 / DP 3.8)

**4.2.2** ✳️ — Inicio de sesión con Google: autenticación federada desde el cliente, con manejo de los errores propios del flujo.
<br>*Dependencias:* 4.1.4, 4.2.1 · *Estimación:* 1.5 h (DO 1 / DM 1.5 / DP 2.5)

**4.2.3** ✳️ — Recuperación de contraseña: flujo de restablecimiento por email desde la pantalla de acceso.
<br>*Dependencias:* 4.2.1 · *Estimación:* 1.5 h (DO 1 / DM 1.5 / DP 2.5)

**4.2.4** ✳️ — Landing pública y entrada a la app: página pública en la raíz que presenta el producto a quien no tiene sesión, y animación de entrada posterior al acceso.
<br>*Dependencias:* 2.1.2, 4.2.1 · *Estimación:* 3 h (DO 2 / DM 3 / DP 5)

**4.2.5** ✳️ — Shell de navegación de la app: layout privado con barra de navegación inferior de cinco ítems, estado activo y control de sesión, sobre el que se montan todas las pantallas del producto.
<br>*Dependencias:* 4.1.3, 2.1.2 · *Estimación:* 3.5 h (DO 2 / DM 3.5 / DP 5.5)


## 5.0 Perfil de Usuario

### 5.1 Modelo y backend de perfil

**5.1.1** — Modelo de perfil: datos personales, deportes, nivel y ubicación.
<br>*Dependencias:* 4.1.1, 2.3.1 · *Estimación:* 1.5 h (DO 0.8 / DM 1.5 / DP 2.2)

**5.1.2** — API de visualización y edición de perfil: endpoints para obtener y editar el perfil del usuario autenticado.
<br>*Dependencias:* 5.1.1, 4.1.3 · *Estimación:* 2.22 h (DO 1.5 / DM 2.2 / DP 3)

**5.1.3** — API de historial de partidos: partidos creados, solicitados o jugados por el usuario.
<br>*Dependencias:* 6.1.1, 6.3.1 · *Estimación:* 2.22 h (DO 1.5 / DM 2.2 / DP 3)

**5.1.4** — Servicio de cálculo de rating: rating visible a partir de calificaciones y penalizaciones por no-show. Cada falta cuenta como 1 ★ y cada baja tarde (menos de 2 h antes) como 2 ★; 3 faltas en 90 días suspenden 7 días, y 6 meses si reincide (ver `docs/reglas-de-negocio.md`).
<br>*Dependencias:* 6.4.1, 6.4.2, 6.4.3 · *Estimación:* 3 h (DO 1.5 / DM 3 / DP 4.5)

**5.1.5** ✳️ — Estadísticas de actividad del perfil: partidos jugados y semanas activas calculadas en el backend, disponibles tanto para el perfil propio como para el de cualquier usuario.
<br>*Dependencias:* 5.1.3 · *Estimación:* 2 h (DO 1 / DM 2 / DP 3)

### 5.2 Frontend de perfil

**5.2.1** — Vista de perfil: datos del usuario, deportes, nivel, ubicación y rating.
<br>*Dependencias:* 2.2.2, 5.1.2 · *Estimación:* 2.23 h (DO 0.8 / DM 2.2 / DP 3.8)

**5.2.2** — Edición de perfil: formulario para modificar información básica del perfil.
<br>*Dependencias:* 2.2.2, 5.1.2 · *Estimación:* 2.22 h (DO 1.5 / DM 2.2 / DP 3)

**5.2.3** — Vista de historial: historial de partidos y estados relevantes.
<br>*Dependencias:* 5.1.3 · *Estimación:* 1.5 h (DO 0.8 / DM 1.5 / DP 2.2)

**5.2.4** — Visualización de rating: promedio, cantidad de calificaciones y estado reputacional.
<br>*Dependencias:* 5.1.4 · *Estimación:* 1.63 h (DO 0.8 / DM 1.5 / DP 3)

**5.2.5** ✳️ — Perfil público de otro jugador: la misma pantalla del perfil propio con los datos públicos del jugador, sin opciones personales ni de cuenta.
<br>*Dependencias:* 5.2.1, 5.1.5 · *Estimación:* 2 h (DO 1 / DM 2 / DP 3)


## 6.0 Gestión de Partidos

### 6.1 Modelo y backend de partidos

**6.1.1** — Modelo de partido: deporte, fecha, ubicación, cupo, nivel, descripción y organizador.
<br>*Dependencias:* 2.3.1, 2.3.2 · *Estimación:* 1.5 h (DO 0.8 / DM 1.5 / DP 2.2)

**6.1.2** — CRUD de partidos: endpoints para crear, editar y eliminar partidos.
<br>*Dependencias:* 6.1.1 · *Estimación:* 3 h (DO 1.5 / DM 3 / DP 4.5)

**6.1.3** — Endpoint de listado de partidos disponibles: consulta de partidos activos para descubrimiento.
<br>*Dependencias:* 6.1.1 · *Estimación:* 2.35 h (DO 0.8 / DM 2.2 / DP 4.5)

**6.1.4** 🆕 — Cancelación de partido con motivo: estado cancelado y campo motivo en el modelo; endpoint que exige motivo obligatorio.
<br>*Dependencias:* 6.1.1, 6.1.2 · *Estimación:* 2.35 h (DO 1.5 / DM 2.2 / DP 3.8)

**6.1.5** ✳️ — Catálogo de deportes: entidad propia con endpoint de consulta, consumida por la creación de partido y por los filtros, en lugar de una lista fija en el cliente.
<br>*Dependencias:* 2.3.1, 6.1.1 · *Estimación:* 2 h (DO 1 / DM 2 / DP 3)

### 6.2 Frontend de gestión de partidos

**6.2.1** — Formulario de creación de partido: flujo paso a paso desde la interfaz.
<br>*Dependencias:* 2.2.3, 6.1.2 · *Estimación:* 3.9 h (DO 2.2 / DM 3.8 / DP 6)

**6.2.2** — Formulario de edición de partido: edición de partidos existentes desde la interfaz.
<br>*Dependencias:* 2.2.3, 6.1.2 · *Estimación:* 3 h (DO 1.5 / DM 3 / DP 4.5)

**6.2.3** — Detalle de partido: información completa antes de solicitar unirse.
<br>*Dependencias:* 6.1.2, 6.1.3 · *Estimación:* 2.1 h (DO 0.8 / DM 2.2 / DP 3)

**6.2.4** ✳️ — Vista "Mis partidos": pantalla con los partidos que el usuario organiza y aquellos en los que juega, separados y con su estado.
<br>*Dependencias:* 6.1.2, 6.3.4 · *Estimación:* 2.5 h (DO 1.5 / DM 2.5 / DP 4)

**6.2.5** 🆕 — Interfaz de cancelación: modal de confirmación que solicita el motivo antes de cancelar.
<br>*Dependencias:* 6.1.4, 6.2.3 · *Estimación:* 1.63 h (DO 0.8 / DM 1.5 / DP 3)

**6.2.6** 🆕 — Notificación de cancelación a participantes: aviso a todos los anotados con el motivo ingresado.
<br>*Dependencias:* 6.1.4, 11.1.3 · *Estimación:* 1.5 h (DO 0.8 / DM 1.5 / DP 2.2)

### 6.3 Sistema de solicitudes

**6.3.1** — Modelo de solicitud: solicitud con estados pendiente, aceptada o rechazada.
<br>*Dependencias:* 4.1.1, 6.1.1 · *Estimación:* 2.35 h (DO 1.5 / DM 2.2 / DP 3.8)

**6.3.2** — Envío de solicitud para unirse a partido: solicitud con control de cupo disponible.
<br>*Dependencias:* 6.3.1, 6.2.3 · *Estimación:* 3.9 h (DO 2.2 / DM 3.8 / DP 6)

**6.3.3** — Gestión de solicitudes por el organizador: aceptación o rechazo de solicitudes recibidas.
<br>*Dependencias:* 6.3.2 · *Estimación:* 2.22 h (DO 1.5 / DM 2.2 / DP 3)

**6.3.4** — Visualización de estado de solicitud: pendiente, aceptada o rechazada para el jugador.
<br>*Dependencias:* 6.3.2, 6.3.3 · *Estimación:* 2.47 h (DO 1.5 / DM 2.2 / DP 4.5)

**6.3.5** ✳️ — Inscripción directa y baja del partido: alta inmediata mientras haya cupo, con control de cupo y de unicidad, y baja del participante antes de que el partido se juegue.
<br>*Dependencias:* 6.1.1, 6.3.1 · *Estimación:* 3 h (DO 2 / DM 3 / DP 4.5)

### 6.4 Rating post-partido

**6.4.1** — Modelo de calificación: calificación 1 a 5 estrellas relacionada con usuarios y partidos.
<br>*Dependencias:* 4.1.1, 6.1.1 · *Estimación:* 2.23 h (DO 0.8 / DM 2.2 / DP 3.8)

**6.4.2** — Interfaz de calificación: pantalla para calificar participantes luego del partido.
<br>*Dependencias:* 2.2.2, 6.4.1 · *Estimación:* 1.63 h (DO 0.8 / DM 1.5 / DP 3)

**6.4.3** — Regla de penalización por no-show: definición e implementación de una regla simple para penalizar el rating de usuarios que no se presentan. La falta la marcan el organizador o al menos 2 jugadores al calificar, dentro de las 48 h posteriores al partido (ver `docs/reglas-de-negocio.md`).
<br>*Dependencias:* 6.4.1 · *Estimación:* 2.35 h (DO 1.5 / DM 2.2 / DP 3.8)

### 6.5 Invitación a partido — **NUEVO**

**6.5.1** 🆕 — Link compartible de partido: URL pública única que abre el detalle en modo lectura sin login previo.
<br>*Dependencias:* 6.1.1, 6.2.3 · *Estimación:* 2.47 h (DO 1.5 / DM 2.2 / DP 4.5)

**6.5.2** 🆕 — Invitación directa a un usuario: búsqueda de usuario registrado e invitación desde el partido, con notificación al invitado.
<br>*Dependencias:* 6.1.1, 4.1.1, 11.1.3 · *Estimación:* 3.9 h (DO 2.2 / DM 3.8 / DP 6)

**6.5.3** 🆕 — Aceptación de invitación: flujo para aceptar o rechazar; reutiliza el modelo de solicitud con origen invitación.
<br>*Dependencias:* 6.5.2, 6.3.1 · *Estimación:* 3 h (DO 1.5 / DM 3 / DP 4.5)


## 7.0 Sistema de Matchmaking

### 7.1 Descubrimiento de partidos

**7.1.1** — Búsqueda de partidos: consulta por deporte, ubicación, fecha, nivel y cupo.
<br>*Dependencias:* 6.1.3 · *Estimación:* 4.62 h (DO 2.2 / DM 4.5 / DP 7.5)

**7.1.2** — Filtros (deporte, nivel, fecha): aplicación de filtros del usuario sobre los resultados de búsqueda; expuestos en el mapa (el swipe no se filtra, decisión del 24/09).
<br>*Dependencias:* 7.1.1 · *Estimación:* 3.12 h (DO 1.5 / DM 3 / DP 5.2)

**7.1.3** — Ordenamiento por rating y compatibilidad: ordena partidos sugeridos según rating del organizador y compatibilidad de nivel con el usuario.
<br>*Dependencias:* 7.1.1, 5.1.4 · *Estimación:* 1.63 h (DO 0.8 / DM 1.5 / DP 3)

### 7.2 Vista Swipe

**7.2.1** — Tarjeta de partido: información resumida y mensaje cuando no hay partidos compatibles.
<br>*Dependencias:* 2.2.5, 7.1.1 · *Estimación:* 3.12 h (DO 2.2 / DM 3 / DP 4.5)

**7.2.2** — Navegación tipo swipe: solicitar, descartar o abrir detalle desde la vista swipe.
<br>*Dependencias:* 7.2.1, 6.3.2 · *Estimación:* 4.62 h (DO 2.2 / DM 4.5 / DP 7.5)

### 7.3 Vista Mapa Interactivo

**7.3.1** — Integración con proveedor de mapa: configuración del mapa interactivo y credenciales. Proveedor: Leaflet + OpenStreetMap, sin credenciales; el mapa es la pantalla de inicio (decisión del 24/09).
<br>*Dependencias:* 3.2.1, 3.2.3 · *Estimación:* 4.28 h (DO 3 / DM 3.8 / DP 7.5)

**7.3.2** — Visualización de partidos en mapa: marcadores de partidos disponibles según ubicación.
<br>*Dependencias:* 7.3.1, 7.1.1 · *Estimación:* 2.47 h (DO 1.5 / DM 2.2 / DP 4.5)

**7.3.3** — Detalle de partido desde mapa: información resumida o completa desde un marcador.
<br>*Dependencias:* 7.3.2, 6.2.3 · *Estimación:* 3.9 h (DO 2.2 / DM 3.8 / DP 6)


## 8.0 QA Manual y Validación

### 8.1 Planificación de pruebas manuales

**8.1.1** — Dataset de demo: usuarios, perfiles y partidos representativos para validar flujos principales y para la demo final.
<br>*Dependencias:* 3.2.2, 4.1.1, 5.1.1, 6.1.2 · *Estimación:* 2.47 h (DO 1.5 / DM 2.2 / DP 4.5)

**8.1.2** — Prueba manual de autenticación: registro, login, logout, errores y rutas protegidas.
<br>*Dependencias:* 4.2.1, 4.1.3 · *Estimación:* 4 h (DO 2 / DM 4 / DP 6)

**8.1.3** — Prueba manual de perfil: visualización, edición, historial y rating.
<br>*Dependencias:* 5.2.1, 5.2.2, 5.2.3, 5.2.4 · *Estimación:* 5.17 h (DO 3 / DM 5 / DP 8)

**8.1.4** — Prueba manual de creación y edición de partidos: creación, edición, permisos y detalle.
<br>*Dependencias:* 6.2.1, 6.2.2, 6.2.3 · *Estimación:* 6.17 h (DO 3 / DM 6 / DP 10)

**8.1.5** — Prueba manual de solicitudes: solicitud, aceptación, rechazo, estado y control de cupos.
<br>*Dependencias:* 6.3.2, 6.3.3, 6.3.4 · *Estimación:* 6.17 h (DO 3 / DM 6 / DP 10)

**8.1.6** — Prueba manual de matchmaking: swipe, mapa, filtros y resultados.
<br>*Dependencias:* 7.2.2, 7.3.3 · *Estimación:* 6.5 h (DO 4 / DM 6 / DP 11)

**8.1.7** — Prueba manual de rating post-partido: calificación y actualización del rating en perfil.
<br>*Dependencias:* 6.4.2, 6.4.3, 5.1.4, 5.2.4 · *Estimación:* 5.17 h (DO 3 / DM 5 / DP 8)

**8.1.8** 🆕 — Prueba manual de notificaciones: recepción de push y email, centro de notificaciones y recordatorio pre-partido.
<br>*Dependencias:* 11.1.3, 11.1.4, 11.2.1, 11.2.2 · *Estimación:* 3.17 h (DO 2 / DM 3 / DP 5)

**8.1.9** 🆕 — Prueba manual de invitaciones: link compartible, invitación directa y aceptación.
<br>*Dependencias:* 6.5.1, 6.5.2, 6.5.3 · *Estimación:* 2.17 h (DO 1 / DM 2 / DP 4)

**8.1.10** 🆕 — Prueba manual de moderación: creación de reporte, panel de revisión, suspensión e historial.
<br>*Dependencias:* 12.1.3, 12.2.1, 12.2.2, 12.2.3 · *Estimación:* 3.17 h (DO 2 / DM 3 / DP 5)

### 8.2 Validación con usuarios

**8.2.1** — Guion de prueba: tareas que los usuarios deberán completar durante la validación.
<br>*Dependencias:* 8.1.2, 8.1.3, 8.1.4, 8.1.5, 8.1.6, 8.1.7, 8.1.8, 8.1.9, 8.1.10 · *Estimación:* 4.17 h (DO 3 / DM 4 / DP 6)

**8.2.2** — Ejecución de pruebas con usuarios: registro, búsqueda, solicitud, creación y rating.
<br>*Dependencias:* 8.2.1 · *Estimación:* 11.5 h (DO 7 / DM 11 / DP 18)

**8.2.3** — Registro de feedback: problemas, fricciones, dudas y oportunidades de mejora.
<br>*Dependencias:* 8.2.2 · *Estimación:* 5.17 h (DO 3 / DM 5 / DP 8)

**8.2.4** — Backlog de ajustes finales priorizado: ajustes según impacto, esfuerzo y tiempo disponible.
<br>*Dependencias:* 8.2.3 · *Estimación:* 4.33 h (DO 3 / DM 4 / DP 7)

### 8.3 QA automatizado en el pipeline — **NUEVO**

**8.3.1** ✳️ — Revisión automática de pull requests: agente que analiza cada pull request contra los criterios de QA del equipo y deja una revisión en borrador para que la valide una persona.
<br>*Dependencias:* 3.2.3 · *Estimación:* 2.5 h (DO 1.5 / DM 2.5 / DP 4)

**8.3.2** ✳️ — Harness de pruebas end-to-end de la API: infraestructura para ejecutar pruebas automáticas sobre los endpoints del backend.
<br>*Dependencias:* 3.2.3 · *Estimación:* 1.5 h (DO 1 / DM 1.5 / DP 2.5)


## 9.0 Deployment

### 9.1 Deploy

**9.1.1** — Ambiente productivo configurado: hosting, base de datos y variables productivas.
<br>*Dependencias:* 3.2.1, 3.2.2, 3.2.3 · *Estimación:* 4.75 h (DO 3 / DM 4.5 / DP 7.5)

**9.1.2** — Deploy final del MVP: publicación accesible mediante URL.
<br>*Dependencias:* 9.1.1 · *Estimación:* 3.37 h (DO 2.2 / DM 3 / DP 6)

**9.1.3** — Smoke test manual post-deploy: validación manual de flujos críticos luego del deploy.
<br>*Dependencias:* 9.1.2 · *Estimación:* 3.23 h (DO 2.2 / DM 3 / DP 5.2)

**9.1.4** ✳️ — Contenedorización del backend y registro de imágenes: imagen de producción reproducible que aplica las migraciones al arrancar, publicada automáticamente en cada integración. Es **prerrequisito de 9.1.1**, aunque lleve un número posterior para no renumerar el módulo.
<br>*Dependencias:* 3.2.3 · *Estimación:* 3.5 h (DO 2 / DM 3.5 / DP 5.5)


## 10.0 Documentación Final

### 10.1 Documentación funcional

**10.1.1** — Manual de uso y descripción de funcionalidades: funcionalidades incluidas, fuera de alcance y flujos principales.
<br>*Dependencias:* 9.1.2, 9.1.3 · *Estimación:* 6 h (DO 3 / DM 6 / DP 9)

**10.1.2** — Entrega final de diseño UX/UI: archivo Figma consolidado con todos los flujos y pantallas finales del MVP.
<br>*Dependencias:* 2.2.1, 2.2.2, 2.2.3, 2.2.4, 2.2.5, 2.2.6, 2.2.7, 2.2.8 · *Estimación:* 3.17 h (DO 2 / DM 3 / DP 5)

### 10.2 Documentación técnica

**10.2.1** — README del proyecto: instalación, configuración y ejecución local.
<br>*Dependencias:* 3.2.3 · *Estimación:* 1.5 h (DO 0.8 / DM 1.5 / DP 2.2)

**10.2.2** — Documentación de APIs: endpoints principales, parámetros, respuestas y errores. Documentación del modelo de datos: entidades, relaciones y reglas principales. Documentación de deployment: despliegue, variables y validación básica.
<br>*Dependencias:* 4.1.3, 5.1.4, 6.1.3, 6.3.4, 7.1.3, 11.1.3, 12.1.2 · *Estimación:* 1.5 h (DO 0.8 / DM 1.5 / DP 2.2)


## 11.0 Notificaciones — **NUEVO**

### 11.1 Backend de notificaciones

**11.1.1** 🆕 — Modelo de notificación: tipo, destinatario, estado leída/no leída, canal y payload asociado.
<br>*Dependencias:* 4.1.1 · *Estimación:* 2.35 h (DO 1.5 / DM 2.2 / DP 3.8)

**11.1.2** 🆕 — Selección de proveedor de push y email: Web Push estándar con `web-push`, sin FCM; email fuera de alcance por ahora (decisión del 24/09).
<br>*Dependencias:* 4.1.1 · *Estimación:* 1.63 h (DO 0.8 / DM 1.5 / DP 3)

**11.1.3** 🆕 — Servicio de envío de notificaciones: disparo ante solicitud creada, aceptada o rechazada y ante cancelación de partido.
<br>*Dependencias:* 11.1.1, 11.1.2, 6.3.2, 6.3.3 · *Estimación:* 4.75 h (DO 3 / DM 4.5 / DP 7.5)

**11.1.4** 🆕 — Job de recordatorio pre-partido: proceso programado que avisa a los participantes 24 h antes del partido.
<br>*Dependencias:* 11.1.3, 6.1.1 · *Estimación:* 3.12 h (DO 1.5 / DM 3 / DP 5.2)

### 11.2 Frontend de notificaciones

**11.2.1** 🆕 — Centro de notificaciones: pantalla con el listado de notificaciones e indicador de no leídas.
<br>*Dependencias:* 11.1.1, 2.2.7 · *Estimación:* 3.9 h (DO 2.2 / DM 3.8 / DP 6)

**11.2.2** 🆕 — Recepción de push en cliente: registro del token de dispositivo y manejo de la recepción. Como la app es web, se resuelve como PWA: manifest, service worker y suscripción Web Push.
<br>*Dependencias:* 11.1.2 · *Estimación:* 4.03 h (DO 2.2 / DM 3.8 / DP 6.8)

**11.2.3** 🆕 — Preferencias de notificación: activación y desactivación de push y email por parte del usuario. **Fuera de alcance desde el 24/09** (sin mail no hay canales entre los que elegir); se conserva en la línea base.
<br>*Dependencias:* 11.2.1 · *Estimación:* 1.63 h (DO 0.8 / DM 1.5 / DP 3)


## 12.0 Moderación y Reportes — **NUEVO**

### 12.1 Reportar usuario

**12.1.1** 🆕 — Modelo de reporte: reportante, reportado, motivo, comentario opcional, partido asociado y estado.
<br>*Dependencias:* 4.1.1 · *Estimación:* 2.35 h (DO 1.5 / DM 2.2 / DP 3.8)

**12.1.2** 🆕 — Endpoint de creación de reporte: registro de un reporte de un usuario sobre otro.
<br>*Dependencias:* 12.1.1 · *Estimación:* 1.63 h (DO 0.8 / DM 1.5 / DP 3)

**12.1.3** 🆕 — Interfaz de reporte: acción Reportar desde el perfil de otro usuario y desde el detalle de partido, con selección de motivo.
<br>*Dependencias:* 12.1.2, 2.2.8, 5.2.1, 6.2.3 · *Estimación:* 3 h (DO 1.5 / DM 3 / DP 4.5)

### 12.2 Panel de moderación

**12.2.1** 🆕 — Panel de revisión de reportes: listado con filtro por estado y acción de marcar como revisado, restringido a rol administrador.
<br>*Dependencias:* 12.1.2, 2.2.8 · *Estimación:* 6.27 h (DO 3.8 / DM 6 / DP 9.8)

**12.2.2** 🆕 — Suspensión de usuario: acción de suspender una cuenta desde el panel, con bloqueo de acceso a rutas privadas.
<br>*Dependencias:* 12.2.1, 4.1.3 · *Estimación:* 4.03 h (DO 2.2 / DM 3.8 / DP 6.8)

**12.2.3** 🆕 — Historial de moderación: registro de las acciones tomadas sobre cada reporte y sobre cada usuario.
<br>*Dependencias:* 12.2.1 · *Estimación:* 3.12 h (DO 1.5 / DM 3 / DP 5.2)


## 13.0 Challenge — **NUEVO**

### 13.1 Reporte diario de KPIs

**13.1.1** ✳️ — Instrumentación para KPIs: momento en que un partido completa su cupo y actividad diaria por usuario.
<br>*Dependencias:* 6.1.1, 4.1.1 · *Estimación:* 1.5 h (DO 1 / DM 1.5 / DP 2)

**13.1.2** ✳️ — Cálculo y persistencia de KPIs: endpoint protegido que calcula los 7 KPIs de negocio de una fecha y guarda la corrida.
<br>*Dependencias:* 13.1.1 · *Estimación:* 2.5 h (DO 1.5 / DM 2.5 / DP 3.5)
