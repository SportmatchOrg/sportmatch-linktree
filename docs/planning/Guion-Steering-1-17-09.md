# Guion del Steering 1 — SportMatch

**Fecha:** 17/09/2026 · **Expone:** Matías Chialva (PM) · **Duración:** 15 min
**Fuentes de verdad:** `outputs/SportMatch - Equipo 11 - EVM y Curva S.xlsx` · `docs/planning/WBS-SportMatch-v4.md` · `docs/planning/Cronograma-y-PERT-v4.md` · Tablero de Estado del Proyecto

---

## Cómo usar este documento

Cada slide tiene cuatro bloques:

- **🎤 Qué decir** — el texto hablado. No es para leer de memoria: es el hilo. Si te sale con otras palabras, mejor.
- **🎯 Foco** — qué está evaluando la cátedra en esa slide.
- **📚 Teoría** — lo que tenés que poder explicar si te frenan ahí.
- **❓ Si preguntan** — las repreguntas probables, con la respuesta ya armada.

Al final hay anexos con la teoría completa y una **hoja de números** para memorizar.

### Reloj

| # | Slide | Tiempo | Acumulado |
|---|---|---:|---:|
| 1-2 | Portada + Agenda | 0:30 | 0:30 |
| 3 | El producto | 1:00 | 1:30 |
| 4 | Equipo y roles | 1:00 | 2:30 |
| 5 | Qué hicimos | 2:00 | 4:30 |
| 6 | Cronograma e hitos | 2:30 | 7:00 |
| 7 | Presupuesto | 1:30 | 8:30 |
| 8 | **Valor ganado** | 3:00 | 11:30 |
| 9 | Riesgos | 1:30 | 13:00 |
| 10 | Próximos pasos | 0:45 | 13:45 |
| 11 | Demo | 1:15 | 15:00 |

> **Regla de oro del reloj:** si vas atrasado, recortá *El producto* y *Equipo y roles*. **Nunca** recortes *Valor ganado* ni *Riesgos*: son las dos slides que la cátedra vino a ver.

---

## Slide 1-2 — Portada + Agenda · ⏱ 0:30

### 🎤 Qué decir

> "Buenas. Steering 1 de SportMatch, equipo 11. Corte al 17 de septiembre, que es el cierre de la semana 6 de 13.
>
> En 15 minutos vamos a ver qué construimos, cómo venimos contra el cronograma y el presupuesto, qué riesgos tenemos vivos, y cerramos con una demo del producto funcionando."

### 🎯 Foco

Encuadrar. Que quede claro desde el segundo cero que **hay un corte definido** y que todo lo que sigue está medido contra una línea base. No arranques pidiendo disculpas ni explicando el contexto de la materia.

---

## Slide 3 — El producto · ⏱ 1:00

### 🎤 Qué decir

> "SportMatch resuelve un problema chico y concreto: querés jugar al fútbol un martes y te faltan tres jugadores. Hoy eso se resuelve en grupos de WhatsApp, a mano, y falla.
>
> Es una plataforma web donde un organizador publica un partido con deporte, lugar, horario y cupo, y otros deportistas lo descubren y se suman. El flujo completo es: te registrás, armás tu perfil, creás o encontrás un partido, y te unís.
>
> Lo que van a ver en la demo al final es ese flujo andando en producción, no un prototipo."

### 🎯 Foco

Que el producto se entienda en 30 segundos. La cátedra no evalúa la idea, pero **necesita el contexto para juzgar si el alcance es coherente**. Decir "en producción" temprano es plantar bandera.

### ❓ Si preguntan

**"¿Por qué web y no app nativa?"**
> "Decisión de alcance del Charter. Web nos da un solo código para desktop y móvil, y despliegue continuo sin pasar por review de tiendas. Con 3 devs a 6 horas semanales, una app nativa no cerraba."

---

## Slide 4 — Equipo y roles · ⏱ 1:00

### 🎤 Qué decir

> "Somos siete. Cuatro en gestión y tres en desarrollo.
>
> Yo soy el PM: cronograma, riesgos, presupuesto y coordinación. Tomás es Product Owner: mantiene el backlog priorizado, define los criterios de aceptación y es el que decide si una pantalla está buena o no. Santos es Tech Lead: mentorea a los devs, controla la deuda técnica y lidera el workstream de agentes de IA. Ignacio Chevallier es QA Lead: valida calidad y prueba los flujos contra los criterios de aceptación.
>
> Los tres devs trabajan por especialidad para no pisarse: Rudolph backend, Siaba infraestructura, Pacheco frontend. Cada ticket en Linear tiene un único responsable asignado.
>
> Dos cosas sobre la capacidad: cada dev pone **6 horas semanales** y cada lead **4**. Y **arrancamos con 2 devs y terminamos con 3** — eso es lo que explica el cambio de alcance que viene en la próxima slide."

### 🎯 Foco

Eje 1 de la guía docente: **"¿quién se hace cargo de cada tarea?"**. La respuesta correcta no es una lista de nombres, es **un responsable único por ticket**. Decilo con esas palabras.

### 📚 Teoría

**Responsabilidad única vs. responsabilidad compartida.** Un ticket con dos dueños es un ticket sin dueño. En Linear cada issue tiene un solo *assignee*; la separación por especialidad (back / infra / front) es lo que hace que eso sea sostenible sin conflictos de merge.

**Nivel de esfuerzo vs. trabajo con entregables.** Los roles de gestión y QA son *level of effort*: se consumen con el calendario y no producen paquetes cerrables de la WBS. Los devs sí. Esta distinción es la que después justifica que la línea base de EVM sea solo desarrollo. **Andá plantando esto acá, así en la slide 8 ya está pago.**

### ❓ Si preguntan

**"¿Cómo se resuelve un desacuerdo entre PO y Tech Lead?"**
> "Producto lo decide el PO contra los diseños; lo técnico lo decide el Tech Lead. Si chocan alcance y deuda técnica, lo arbitro yo contra el cronograma. Hasta ahora no pasó."

**"¿El PM también programa?"**
> "No. Es deliberado: si el PM se mete a codear, deja de mirar el cronograma. Mi entregable son estos documentos."

---

## Slide 5 — Qué hicimos · ⏱ 2:00

### 🎤 Qué decir

> "Esta slide es el alcance por steering, con semáforo. Verde es cerrado, naranja es en curso.
>
> En el **Sprint 1**, que es el que cerramos hoy, terminamos completo el módulo de **autenticación** —registro, login con email y con Google, guard de rutas privadas— y la **landing**. Y quedaron avanzados pero no cerrados **perfil de usuario**, **gestión de partidos** y el inicio de **matchmaking**.
>
> En números: **43 de 76 paquetes** de la WBS cerrados, **123,7 horas de 221,6**, un **55,8 %** del desarrollo.
>
> Y hay un cambio de alcance que quiero explicitar: **sumamos Notificaciones y Moderación**. No es scope creep. Arrancamos el proyecto con dos desarrolladores y se incorporó un tercero; en vez de terminar antes, decidimos con el PO usar esa capacidad para cerrar dos módulos que el MVP necesitaba igual. El impacto está cuantificado: el presupuesto pasó de 6.719 a **8.063 dólares**."

### 🎯 Foco

Ejes 2 y 3 de la guía: **hacer visible el avance** y **registrar decisiones**. La cátedra quiere ver que el cambio de alcance fue **una decisión con dueño, motivo e impacto medido**, no una deriva.

La trampa acá es contar features. **Contá paquetes y horas.** "Hicimos la autenticación" no es evidencia; "9 paquetes de la WBS cerrados, 23 horas estimadas" sí.

### 📚 Teoría

**Un paquete de trabajo cuenta o no cuenta — no hay medio paquete.** Es la regla 0/100: un paquete aporta 0 % hasta que cierra y 100 % cuando cerró. Por eso los 5 paquetes parciales (13,79 h) **no suman nada** al 55,8 %. Es conservador a propósito: evita el clásico "está al 90 %" que dura tres semanas.

**Definition of Done.** Un paquete está cerrado si: PR mergeado + CI en verde + criterios de aceptación cumplidos y validados por QA. "Casi listo" no existe.

**Control de cambios.** Un cambio de alcance necesita cuatro cosas: (1) quién lo pidió, (2) por qué, (3) impacto en costo y plazo, (4) quién lo aprobó. Acá: lo propuso el PO, la causa fue capacidad extra, el impacto son +26 paquetes y +1.344 USD, lo aprobamos PM y PO.

### ❓ Si preguntan

**"¿No es scope creep?"**
> "Scope creep es alcance que entra sin que nadie lo apruebe ni se mida. Esto entró por una decisión explícita, con el impacto cuantificado en el presupuesto y replanificado en la WBS v4. La diferencia es que está registrado."

**"¿Por qué esos dos módulos y no terminar antes?"**
> "Porque el producto sin notificaciones no avisa que te aceptaron en un partido, y sin moderación no hay forma de sacar a alguien que se porta mal. Eran deuda de alcance, no features nuevas."

**"¿Qué pasó con los paquetes que quedaron a medias?"**
> "Cinco paquetes, 13,79 horas, todos replanificados en el S2. Y hay tres que se cerraron **antes** que su predecesor: la API de perfil antes del modelo completo, la visualización de rating antes del cálculo, la tarjeta de partido antes de la búsqueda. En los tres casos se entregó primero la parte utilizable. Está documentado en el Cronograma v4, sección 5."

---

## Slide 6 — Cronograma e hitos · ⏱ 2:30

### 🎤 Qué decir

> "Este es el Gantt del proyecto completo, generado desde la WBS y el export de Linear — no está dibujado a mano.
>
> Las barras en rojo son el **camino crítico**. Tres cosas para leer acá.
>
> **Primero, el camino crítico dura 42 horas sobre 221,6 de esfuerzo total.** Es el 19 %. Eso significa que el proyecto es **ancho, no largo**: la restricción real no es la cadena de dependencias, es la capacidad del equipo. Por eso el plan se arma por capacidad semanal y no por la red de precedencias.
>
> **Segundo, la cadena crítica es** setup → modelo de usuario → solicitudes → **notificaciones** → invitaciones. Ya recorrimos 6 de esos 9 paquetes. El que queda y nos preocupa es el servicio de notificaciones: de él cuelgan la invitación directa, la aceptación y el aviso de cancelación. Es el riesgo R1 y volvemos sobre él en dos slides.
>
> **Tercero, los hitos del Charter.** Kick-off técnico: cumplido el 13/08. MVP funcional: comprometido para fines de octubre, planificado para el **15/10**, o sea **15 días de adelanto**. Deploy del sistema: comprometido para principios de noviembre y está **operativo desde el Sprint 1**, unos dos meses antes. Finalización: el desarrollo cierra el 05/11 y la entrega final es el 12/11, después de la semana de reserva.
>
> El deploy adelantado es el desvío positivo más grande del proyecto y no fue casualidad: adelantamos el Dockerfile de producción justamente porque el primer deploy es la forma clásica de perder una demo."

### 🎯 Foco

Eje 1: **organizar el trabajo y las dependencias**. Acá es donde se ve si entendés la diferencia entre *tener un Gantt* y *entender el Gantt*.

El número que impresiona es **19 %**. Casi nadie calcula qué porcentaje del esfuerzo está en el camino crítico, y es la métrica que te dice si tu problema es de secuencia o de capacidad.

### 📚 Teoría — esto tenés que saberlo en detalle

**Estimación PERT de tres puntos.** Cada paquete se estima con tres valores: optimista (DO), más probable (DM) y pesimista (DP). La duración esperada es:

```
Te = (DO + 4 · DM + DP) / 6
```

Es una media ponderada que le da peso 4 al valor más probable. Sirve para no anclarse ni en el mejor ni en el peor caso.

**CPM — cómo se calcula el camino crítico.** Dos pasadas sobre el grafo de dependencias:

- **Pasada hacia adelante:** `ES` (early start) de una tarea = el máximo `EF` de sus predecesoras. `EF = ES + duración`. Te da la fecha más temprana en que cada tarea puede terminar.
- **Pasada hacia atrás:** `LF` (late finish) = el mínimo `LS` de sus sucesoras. `LS = LF − duración`. Te da la fecha más tardía sin atrasar el proyecto.
- **Holgura total** = `LS − ES` = `LF − EF`.
- **El camino crítico es la cadena de tareas con holgura cero.** Si una se atrasa un día, el proyecto entero se atrasa un día.

**Definición de camino crítico, en una frase:** la secuencia más larga de tareas dependientes entre sí, que determina la duración mínima del proyecto.

**Los 9 paquetes críticos, de memoria:**

| # | ID | Paquete | Dur |
|---|---|---|---:|
| 1 | 3.1.1 | Stack tecnológico definido | 4,00 h |
| 2 | 3.1.2 | Equipo capacitado en stack | 15,00 h |
| 3 | 4.1.1 | Modelo de usuario | 2,88 h |
| 4 | 6.3.1 | Modelo de solicitud | 2,35 h |
| 5 | 6.3.2 | Envío de solicitud | 3,90 h |
| 6 | 6.3.3 | Gestión de solicitudes | 2,22 h |
| 7 | **11.1.3** | **Servicio de notificaciones** | 4,75 h |
| 8 | 6.5.2 | Invitación directa | 3,90 h |
| 9 | 6.5.3 | Aceptación de invitación | 3,00 h |
| | | **Total** | **42,00 h** |

**Dos caminos críticos según el alcance.** Sobre los 76 paquetes de desarrollo son 42 h. Sobre la WBS completa (116 paquetes, con gestión, diseño y QA) son **83,84 h y 16 paquetes**: la misma cadena, precedida por el Project Charter y seguida por la validación con usuarios y el informe final. **Lo que alarga el proyecto después del desarrollo es la validación con usuarios.**

### ❓ Si preguntan

**"¿Por qué el camino crítico es tan corto comparado con el proyecto?"**
> "Porque hay mucho trabajo paralelizable. El PERT puro asume paralelismo ilimitado y da 42 horas; el calendario real, con 18 horas semanales de capacidad, da 13 semanas. Esa brecha es exactamente la medida de que nuestra restricción es la capacidad, no la secuencia."

**"¿Cómo manejan que un dev dependa de otro?"**
> "Front-cargando. El backend arranca la semana con el modelo y los endpoints, y el front empieza por lo que no depende del back. Nos pasó en la semana 3 y 4: hubo tickets de frontend bloqueados por backend y lo registramos como incidente en el tablero. La mitigación fue coordinación diaria y quedó cerrado."

**"¿Qué pasa si se atrasa el servicio de notificaciones?"**
> "Se atrasa el proyecto, por definición: está en el camino crítico con holgura cero. Por eso la mitigación del R1 es arrancar el S2 por el módulo 11 completo y no por el mapa, que sí tiene holgura."

---

## Slide 7 — Presupuesto · ⏱ 1:30

### 🎤 Qué decir

> "El presupuesto está calculado sobre **13 semanas**, del 6 de agosto al 5 de noviembre, con la carga real: 4 horas semanales por cada lead y 6 por cada dev.
>
> Gestión —PM, PO y Tech Lead— son 156 horas-hombre a 20 dólares. Desarrollo, 234 horas a 10. QA, 52 horas a 20. Total **442 horas-hombre**, **6.500 dólares** de trabajo.
>
> Infraestructura y herramientas de IA suman **219 dólares**: Azure para el backend a 13,14 por mes desde el deploy, y las licencias de Claude Code y ChatGPT. Vercel, Neon, Firebase Auth y GitHub Actions están en plan gratuito, así que no cuestan.
>
> Sobre eso, **20 % de contingencia**, 1.344 dólares, que cubre los riesgos ya identificados. El **BAC del proyecto queda en 8.063 dólares**.
>
> Aparte de la contingencia está la **semana 14**, del 5 al 12 de noviembre, que no lleva trabajo planificado. Es reserva de gestión: absorbe atrasos antes de la entrega final y queda fuera del BAC."

### 🎯 Foco

Que el presupuesto sea **derivable**, no declarado. Cada número sale de multiplicar personas × horas × semanas × tarifa. Si te piden que lo reconstruyas en el pizarrón, tenés que poder.

### 📚 Teoría

**BAC (Budget at Completion)** — el presupuesto total autorizado para el proyecto. Es la línea base de costos contra la que se mide todo.

**Contingencia vs. reserva de gestión** — distinción clásica de PMBOK y una repregunta muy probable:

| | Contingencia | Reserva de gestión |
|---|---|---|
| Cubre | Riesgos **identificados** ("known unknowns") | Imprevistos **no identificados** ("unknown unknowns") |
| Quién la usa | El PM, sin aprobación extra | Requiere aprobación del sponsor |
| ¿Está en el BAC? | **Sí** | **No** |

En SportMatch: el 20 % ($1.344) es contingencia y está dentro del BAC. La semana 14 es reserva de gestión y está fuera.

**La aritmética completa, para reconstruirla en vivo:**

```
Gestión:    3 personas × 4 h/sem × 13 sem = 156 HH × $20 = $3.120
Desarrollo: 3 personas × 6 h/sem × 13 sem = 234 HH × $10 = $2.340
QA:         1 persona  × 4 h/sem × 13 sem =  52 HH × $20 = $1.040
                                            ───────        ───────
                                            442 HH         $6.500
Infra + IA (Azure 3 × $13,14 + IA 3 × $60)                 $  219,42
                                                           ───────
Subtotal                                                   $6.719,42
Contingencia 20 %                                          $1.343,88
                                                           ───────
BAC del proyecto                                           $8.063,30
```

### ❓ Si preguntan

**"¿De dónde salen las tarifas?"**
> "Son tarifas de referencia de mercado para perfiles junior y semi-senior, no salarios reales: el equipo es de estudiantes. Sirven para tener una unidad económica común y poder hacer EVM. Lo importante es que sean consistentes, no que sean exactas."

**"¿Por qué el 20 % de contingencia?"**
> "Es el estándar para proyectos con equipo sin experiencia previa en el stack. Y se consumió cero hasta ahora."

**"¿No falta el costo de las horas de ustedes cuatro?"**
> "No, están: son las 156 horas de gestión más las 52 de QA, 4.160 dólares. Lo que sí es cierto es que no entran en la curva de valor ganado, y eso lo explico en la próxima slide."

---

## Slide 8 — Valor ganado · ⏱ 3:00 ⭐ *la slide que define la nota*

### 🎤 Qué decir

> "Esta es la medición del proyecto. Tres curvas y cuatro indicadores.
>
> **El valor planificado, PV**: lo que el plan decía que íbamos a haber gastado al 17 de septiembre. **1.213 dólares**.
>
> **El costo real, AC**: lo que efectivamente se consumió. También **1.213**. Ya voy a explicar por qué dan iguales.
>
> **El valor ganado, EV**: **1.429 dólares**. Y este es el número importante. El EV no es cuánto gastamos, es **cuánto vale el trabajo que efectivamente entregamos**, valuado al precio del plan. Se calcula como porcentaje completo por la línea base: cerramos 123,7 horas de paquetes de la WBS sobre 221,6 de desarrollo, eso es 55,8 %, por 2.559 dólares de línea base, da 1.429.
>
> De ahí salen los dos índices. **SPI**, valor ganado sobre valor planificado, **1,18**. **CPI**, valor ganado sobre costo real, **1,18** también. Los dos por encima de 1: entregamos más valor del planificado y por cada dólar gastado obtuvimos 1,18 de valor.
>
> Y la proyección: **EAC**, línea base dividido CPI, **2.173 dólares** contra una línea base de 2.559. Un **VAC de más 386**: si mantenemos el ritmo, terminamos el desarrollo por debajo de la línea base.
>
> **Ahora, dos aclaraciones que quiero hacer yo antes de que me las pregunten.**
>
> **Una: por qué el AC es igual al PV.** No tenemos time tracking. El costo real no sale de horas cargadas sino de la **dedicación pactada**: 18 horas semanales del equipo de desarrollo que efectivamente se sostuvieron las 6 semanas, más la infraestructura, que se facturó exactamente como estaba planeada. Es un supuesto declarado, no una medición. La consecuencia es que **CPI y SPI dan idénticos**, y que ese ahorro de 386 dólares hay que leerlo como *"vamos 15,7 horas adelantados"*, no como *"nos sobró plata"*.
>
> **Dos: por qué la línea base es 2.559 y no los 8.063 del presupuesto.** El valor ganado necesita entregables medibles. Cada paquete de la WBS tiene horas estimadas y una fecha de cierre, entonces podés decir "esto se ganó". Gestión y QA son nivel de esfuerzo: se consumen con el calendario y no producen paquetes cerrables. Si los metiera en el EV, el avance se lo llevaría el simple paso del tiempo y el indicador dejaría de medir nada. Y la contingencia tampoco se puede ganar, porque no es trabajo planificado. Por eso la curva mide contra desarrollo más infra e IA."

### 🎯 Foco

Esta es **la** slide. Es donde se separa quien copió una plantilla de quien entiende la métrica. Los dos gestos que valen oro son:

1. **Anticipar el AC = PV.** Si lo decís vos, es rigor. Si te lo sacan, es un agujero.
2. **Distinguir los dos BAC.** Nunca digas "BAC" a secas para dos números distintos.

### 📚 Teoría — EVM completo

**Las tres variables base:**

| Sigla | Nombre | Qué es | Valor |
|---|---|---|---:|
| **PV** | Planned Value | Valor del trabajo **planificado** a la fecha | $1.213,14 |
| **EV** | Earned Value | Valor del trabajo **realmente completado**, valuado al plan | $1.428,57 |
| **AC** | Actual Cost | Costo **realmente incurrido** | $1.213,14 |

**Las variaciones** (positivo = bien):

- **SV = EV − PV = +$215** — *variación de cronograma*, en dinero.
- **CV = EV − AC = +$215** — *variación de costo*.

**Los índices** (> 1 = bien):

- **SPI = EV / PV = 1,18** — eficiencia de cronograma.
- **CPI = EV / AC = 1,18** — eficiencia de costo.

**Los pronósticos:**

- **EAC = BAC / CPI = $2.173** — cuánto va a salir el proyecto entero si el rendimiento se mantiene.
- **VAC = BAC − EAC = +$386** — desvío proyectado al cierre.
- *(ETC = EAC − AC = $960 — cuánto falta gastar. Lo sacamos de la slide por espacio, pero sabelo.)*

**Lo más importante que tenés que entender del SPI:**

> **SPI > 1 no significa "vamos a terminar antes".** Significa que **el trabajo entregado a la fecha vale más que el planificado a la fecha**. Es una medida de valor acumulado, no de fecha de fin. Un proyecto puede tener SPI = 1,18 y aun así atrasarse si lo que queda está en el camino crítico.

**Por qué la curva se llama "curva S":** en un proyecto típico el gasto acumulado arranca lento (arranque, setup), se acelera en el medio (pico de ejecución) y se aplana al final (cierre). Eso dibuja una S. **La nuestra es casi recta** porque la capacidad es fija —18 h/semana todas las semanas—; los escalones que se ven son los costos mensuales de Azure y de las licencias de IA.

**Por qué el EV arranca por debajo del PV las primeras semanas:** el EV sube **solo cuando un paquete cierra**, no mientras se trabaja. La semana 1 tiene SPI 0,26 porque se estuvo capacitando y no cerró casi nada; la semana 2 recupera a 1,05 cuando cierran 9 paquetes de una. Es el comportamiento normal de la regla 0/100.

**TCPI = 0,84** — *To-Complete Performance Index*: `(BAC − EV) / (BAC − AC)`. Es la eficiencia que necesitás de acá al final para terminar dentro del presupuesto. Como es menor que 1, alcanza con rendir al 84 % de lo planificado. Hay margen.

**Los dos EAC posibles** (por si te preguntan cuál usar):

| Método | Fórmula | Supuesto | Valor |
|---|---|---|---:|
| Típico | `BAC / CPI` | La eficiencia actual se mantiene | $2.173 |
| Atípico | `AC + BAC − EV` | Lo que falta sale según el plan original | $2.344 |

> Los dos quedan por debajo de la línea base de $2.559. Usamos el típico porque seis semanas de rendimiento sostenido ya son tendencia, no ruido.

### ❓ Si preguntan

**"¿Cómo miden el porcentaje completo?"**
> "Regla 0/100 sobre paquetes de la WBS. Un paquete aporta sus horas estimadas solo cuando cierra: PR mergeado, CI verde y criterios de aceptación cumplidos. Los parciales no suman nada. Hoy: 123,7 horas cerradas sobre 221,6."

**"El CPI mide eficiencia de costo, pero si el AC es un supuesto, ¿qué están midiendo realmente?"**
> *(La pregunta filosa. Ya la anticipaste, así que:)* "Exactamente lo que dije: al ser AC = PV por construcción, el CPI colapsa sobre el SPI. Lo que estamos midiendo de verdad es rendimiento de cronograma. Para tener un CPI independiente necesitaríamos time tracking real, y es una mejora que tenemos identificada para el S2."

**"¿Por qué el EV está por encima del PV si tienen menos plata gastada?"**
> "Porque el EV valúa entregables, no gasto. Gastamos exactamente lo planeado —1.213— pero con esa plata cerramos paquetes que valían 1.429. La diferencia es productividad."

**"¿Ese 1,18 no es simplemente que sobreestimaron?"**
> "Puede ser en parte, y lo tenemos medido. Separando la capacitación, que es el único paquete con costo real conocido, los otros 42 paquetes estaban estimados en 108,7 horas y entraron en las 93 horas de capacidad que quedaban: **14 % menos de tiempo del previsto**. Y es un piso, porque en esas mismas horas también se avanzó en otros 5 paquetes. La WBS quedó del lado conservador y lo asumimos."

---

## Slide 9 — Riesgos · ⏱ 1:30

### 🎤 Qué decir

> "Cuatro riesgos vivos, cada uno con dueño y mitigación.
>
> **R1, alto: el servicio de notificaciones está en el camino crítico.** De él cuelgan la invitación directa, la aceptación de invitación y el aviso de cancelación. Mitigación: arrancamos el Sprint 2 por el módulo 11 completo, no por el mapa. Dueño: Tech Lead y PM.
>
> **R2, alto: el panel de moderación obliga a introducir un rol de administrador** que hoy no existe ni en el modelo de usuario ni en el guard de autenticación. Es la dependencia oculta más cara que tenemos. Mitigación: resolver el rol al **inicio** del Sprint 3, no al final.
>
> **R3, medio: el mapa no tiene coordenadas en el modelo.** Hoy la ubicación de un partido es texto libre. Mitigación: sumar coordenadas a Partido y a Usuario en una sola decisión, antes de empezar la visualización.
>
> **R4, bajo: capacidad.** El Sprint 2 usa el 80 % de la capacidad y el Sprint 3 el 75 %. Quedan 12,38 horas de margen más la semana de reserva.
>
> Y del lado de las **oportunidades**: la incorporación del tercer desarrollador ya se materializó y es lo que nos permitió ampliar el alcance. El riesgo positivo se realizó.
>
> Lo que llevamos cerrado está en el tablero de estado: **cinco incidentes, los cinco cerrados**. El más caro fue una dependencia intersemanal entre frontend y backend en las semanas 3 y 4, que se resolvió con coordinación diaria."

### 🎯 Foco

Eje 4 de la guía: **identificar riesgos y oportunidades**. Tres cosas que la cátedra busca:

1. Que cada riesgo tenga **dueño**.
2. Que la mitigación sea **una acción concreta con fecha**, no "monitorear de cerca".
3. Que haya **riesgos positivos**, no solo amenazas. Casi ningún equipo los pone.

### 📚 Teoría

**Riesgo vs. incidente (problema).** Un riesgo es un evento **futuro e incierto** con impacto. Un incidente es un riesgo **que ya ocurrió**. Se gestionan en registros distintos: risk log y issue log. En el tablero tenemos los dos.

**Las cuatro respuestas a un riesgo negativo:** evitar, transferir, mitigar, aceptar.
**Las cuatro a un riesgo positivo:** explotar, compartir, mejorar, aceptar.

> El tercer dev fue una oportunidad que **explotamos**: en vez de aceptarla pasivamente (terminar antes), la usamos para ampliar alcance.

**Exposición al riesgo** = probabilidad × impacto. Es lo que ordena la lista y lo que dimensiona la contingencia.

### ❓ Si preguntan

**"¿Cuál les quita el sueño?"**
> "El R2, el rol de administrador. El R1 es un riesgo de secuencia y ya sabemos cómo ordenarlo. El R2 es una dependencia estructural: tocar el modelo de usuario y el guard de autenticación a esta altura afecta código que hoy está andando en producción. Por eso lo movimos al inicio del Sprint 3."

**"¿Cómo hacen el seguimiento semanal?"**
> "Tablero de estado con semáforo RAG por semana y por área. Cada semana en ámbar o rojo lleva motivo y acción tomada, escritos. Además el status report automático que consolida Linear y GitHub y se postea en Discord. La evidencia se genera del trabajo real, no como tarea aparte."

---

## Slide 10 — Próximos pasos · ⏱ 0:45

### 🎤 Qué decir

> "Sprint 2, seis semanas, hasta el 15 de octubre: cerrar gestión de partidos, terminar matchmaking y el mapa, y arrancar notificaciones, que es lo crítico. Ahí queda el **MVP funcional**, 15 días antes del compromiso del Charter.
>
> Sprint 3, hasta el 5 de noviembre: notificaciones completo y moderación. Después, la semana de reserva y la entrega final el 12 de noviembre.
>
> Del Sprint 2 salimos con el 44 % del desarrollo restante y los dos riesgos altos ya atacados, no pendientes."

### 🎯 Foco

Cerrar con compromisos fechados. Tres frases, no más. Si vas con el tiempo justo, esta es la que se comprime.

---

## Slide 11 — Demo · ⏱ 1:15

### 🎤 Qué decir

> "Cierro con el producto andando. Es producción, no local.
>
> Me registro con Google… entro al perfil… creo un partido con deporte, lugar, horario y cupo… y desde otra cuenta lo encuentro y mando la solicitud para unirme… y acá el organizador la acepta.
>
> Eso es el flujo completo de punta a punta, con 55,8 % del desarrollo hecho y en la semana 6 de 13."

### 🎯 Foco

Eje 2: **evidencia**. Una demo en vivo vale más que las diez slides anteriores. Dos reglas:

- **Tené el flujo ensayado y las dos cuentas ya logueadas en pestañas separadas.**
- **Si algo falla, no lo debuguees en vivo.** Decí "esto lo vimos funcionando hace diez minutos, lo reviso y les paso el video" y seguí. Pelearte con un bug adelante de la cátedra te come tres minutos y la calma.

---

# Anexos

## Anexo A — Hoja de números (para memorizar)

**Alcance**

| | |
|---|---:|
| WBS completa | 116 paquetes · 440,27 h |
| Alcance de desarrollo (3.0–12.0 sin 8.0) | **76 paquetes · 221,62 h** |
| Cerrados al corte | **43 paquetes · 123,70 h · 55,8 %** |
| Parciales | 5 paquetes · 13,79 h · 6,2 % |
| Pendientes | 28 paquetes · 84,13 h · 38,0 % |

**Calendario**

| | |
|---|---|
| Semanas de trabajo | 13 (06/08 → 05/11), jueves a jueves |
| Semana de reserva | 05/11 → 12/11 (fuera del BAC) |
| Sprints | S1 = sem 1-6 · S2 = 7-10 · S3 = 11-13 |
| Capacidad | 3 devs × 6 h/sem = **18 h/sem** |
| Calendario transcurrido | 6 de 13 = 46,2 % |
| **Adelanto** | **+9,7 puntos de avance sobre calendario** |

**Uso de capacidad por sprint**

| Sprint | Paquetes | Esfuerzo | Capacidad | Uso |
|---|---:|---:|---:|---:|
| S1 | 43 | 123,70 h | 108 h | **115 %** |
| S2 | 21 | 57,53 h | 72 h | 80 % |
| S3 | 12 | 40,39 h | 54 h | 75 % |
| **Total** | **76** | **221,62 h** | **234 h** | **95 %** |

**Dinero**

| | |
|---|---:|
| BAC del proyecto | **$8.063,30** (442 HH) |
| ├ Línea base EVM (devs + infra + IA) | **$2.559,42** |
| ├ Gestión + QA | $4.160,00 |
| └ Contingencia 20 % | $1.343,88 |

**EVM al corte 17/09**

| | |
|---|---:|
| PV | $1.213,14 (108 h plan) |
| EV | $1.428,57 (123,70 h ganadas) |
| AC | $1.213,14 (108 h reales) |
| SV = EV − PV | +$215,43 |
| CV = EV − AC | +$215,43 |
| SPI | **1,18** |
| CPI | **1,18** |
| EAC | $2.173,45 |
| ETC | $960,31 |
| VAC | **+$385,97** |
| TCPI | 0,84 |

**Camino crítico**

| | |
|---|---|
| Sobre desarrollo | 42,00 h · 9 paquetes · **19 % del esfuerzo** |
| Sobre WBS completa | 83,84 h · 16 paquetes |
| Cadena | setup → modelo de usuario → solicitudes → **notificaciones** → invitaciones |
| Recorrido | 6 de 9 paquetes cerrados |

---

## Anexo B — Las cinco preguntas de la guía docente

La cátedra evalúa cinco ejes (*"Implementar mecanismos básicos de gestión de proyecto que permitan a cada equipo organizar su trabajo, hacer visible el avance, registrar decisiones, identificar riesgos y sostener un seguimiento semanal con evidencias"*). Dónde responde cada slide:

| Eje | Slides | Respuesta en una línea |
|---|---|---|
| **1. Organizar el trabajo** | 4, 6 | Sprints de capacidad fija, un responsable por ticket, WBS de 116 paquetes con dependencias explícitas y camino crítico calculado. |
| **2. Hacer visible el avance** | 5, 6, 8, 11 | Tres fuentes verificables: tablero de Linear, PRs en GitHub, status report semanal. Más EVM y demo en vivo. |
| **3. Registrar decisiones** | 5, 7 | `AGENTS.md` del repo, descripciones de tickets con su RF/WBS, y el cambio de alcance documentado con impacto cuantificado. |
| **4. Riesgos y oportunidades** | 9 | Risk log con 4 riesgos vivos con dueño y mitigación, issue log con 5 incidentes cerrados, y una oportunidad explotada. |
| **5. Seguimiento semanal con evidencias** | 9 | Tablero de estado con RAG semanal, motivo y acción por cada semana ámbar; status report automático desde Linear + GitHub. |

**Si la pregunta es "¿cómo saben si realmente hubo avance?"**, la respuesta es siempre la misma:
> "Por la Definition of Done: PR mergeado, CI en verde, criterios de aceptación cumplidos. 'Casi listo' no cuenta. Es verificable en Linear y GitHub, no depende de lo que alguien diga."

---

## Anexo C — El tablero de estado (referencia por si lo piden)

El tablero tiene tres bloques y conviene tenerlo abierto en otra pestaña:

**1. Estado semanal (RAG).** Semáforo por semana y por área, con dos columnas obligatorias: *motivo* y *acción tomada*. Las semanas que registramos en ámbar y por qué:

| Semana | Motivo | Acción |
|---|---|---|
| Sem 01 | Reunión informativa a mitad de semana; mal manejo del tiempo de los devs | No derivó en atraso: buena predisposición del equipo |
| Sem 02 | Una API key de los workflows agénticos se quedó sin tokens | Se cubrió el período con revisión manual |
| Sem 03 | Incongruencia entre un ticket y su implementación | Se atacó al instante, se reforzó la comunicación QA–PO sobre el Definition of Done |
| Sem 03/04 | **Dependencia estructural: tickets de frontend bloqueados por backend** | Coordinación diaria y documentación de plazos |
| Sem 05 | Una PR estuvo tres días sin revisarse | No escaló porque no tenía dependencias, pero quedó registrado |
| Sem 06 | Exigencia universitaria mayor a la esperada; no se consideró la landing en el alcance de la demo | Se acomodaron las actividades evitando tocar las claves |

**2. Cronograma.** Actividades clave con fecha de fin de línea base, estimada y real, y el **desvío en días**. Los dos desvíos positivos grandes:

- **CI/CD y Deploy:** línea base 15/10, real **03/09** → **42 días de adelanto**.
- **Frontend de partidos:** línea base 05/11, real **10/09** → **56 días de adelanto**.

**3. Incidentes.** Cinco, todos cerrados, con criticidad y resolución escrita. Los de criticidad alta fueron la incongruencia en la corrección de un ticket y la falta de comunicación entre áreas.

> **Cómo usarlo en la exposición:** si te preguntan por evidencia de seguimiento semanal, abrilo y mostrá la fila de motivos. Es la prueba de que el semáforo no es decorativo.

---

## Anexo D — Glosario rápido

| Sigla | Significado | Fórmula |
|---|---|---|
| **WBS** | Work Breakdown Structure | — |
| **BAC** | Budget at Completion | Suma de la línea base de costos |
| **PV** | Planned Value | Valor del trabajo planificado a la fecha |
| **EV** | Earned Value | % completo × BAC |
| **AC** | Actual Cost | Costo realmente incurrido |
| **SV** | Schedule Variance | EV − PV |
| **CV** | Cost Variance | EV − AC |
| **SPI** | Schedule Performance Index | EV / PV |
| **CPI** | Cost Performance Index | EV / AC |
| **EAC** | Estimate at Completion | BAC / CPI |
| **ETC** | Estimate to Complete | EAC − AC |
| **VAC** | Variance at Completion | BAC − EAC |
| **TCPI** | To-Complete Performance Index | (BAC − EV) / (BAC − AC) |
| **ES / EF** | Early Start / Early Finish | Pasada hacia adelante del CPM |
| **LS / LF** | Late Start / Late Finish | Pasada hacia atrás del CPM |
| **Holgura total** | Total float | LS − ES |
| **PERT** | Estimación de tres puntos | (DO + 4·DM + DP) / 6 |
| **RAG** | Red / Amber / Green | Semáforo de estado |
| **DoR / DoD** | Definition of Ready / Done | — |

---

## Anexo E — Las cinco frases que no pueden faltar

Si te quedaras sin tiempo y solo pudieras decir cinco cosas:

1. **"43 de 76 paquetes cerrados, 123,7 de 221,6 horas, 55,8 % del desarrollo en la semana 6 de 13."**
2. **"SPI y CPI en 1,18, y el AC es dedicación pactada, no horas cargadas: por eso dan iguales."**
3. **"El camino crítico es el 19 % del esfuerzo: nuestra restricción es capacidad, no secuencia."**
4. **"El deploy estaba comprometido para noviembre y está operativo desde el Sprint 1."**
5. **"El alcance creció porque entró un tercer dev, y está cuantificado: de 6.719 a 8.063 dólares."**
