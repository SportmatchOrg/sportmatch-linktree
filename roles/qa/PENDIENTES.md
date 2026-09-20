# Pendientes - QA

Estas iniciativas quedan registradas para futuros sprints, algunas opcionales otras importante que estén. Antes de implementarlas hay que convertirlas en tickets con alcance, responsable y criterio de aceptación.

## 1. Automatizar controles de accesibilidad

Un nice to have para chamuyar puede ser definir un workflow de accessibility guidelines para pull requests, acordar el estándar WCAG y establecer qué hallazgos bloquean el merge. Referencias para evaluar:

- [Accessibility Analysis](https://github.com/marketplace/actions/accessibility-analysis)
- [CI/CD Accessibility Best Practices](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/CI_CD_ACCESSIBILITY_BEST_PRACTICES.md)
- [Axle — a11y/WCAG accessibility CI](https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci)

## 2. Workflow que proponga correcciones

Además del workflow `qa-review`, que deja comentarios, evaluar otro workflow que prepare una PR draft con cambios corregibles automáticamente. Debe usar una cuenta bot o GitHub App distinta de las cuentas personales de los leads, permisos mínimos y revisión humana obligatoria antes del merge.

## 3. Automatizar EVM con Linear

Mejorar las herramientas de gestión del proyecto para calcular valor planeado (PV), valor ganado (EV) y costo real (AC) a partir de Linear, reduciendo la carga y conciliación manual.

## 4. Resumen semanal por audio

Evaluar [open-wa](https://www.open-wa.org/) para enviar por WhatsApp un audio con el resumen semanal. Si el canal elegido es Discord, definir la integración equivalente mediante bot o webhook. Acordar fuente del resumen, destinatarios, horario, manejo de credenciales y aprobación previa al envío.

## 5. MCP propio para skills

Crear un MCP del equipo que exponga skills. Empezar por los criterios de QA y relevar qué otras skills aportarían valor a cada rol.

## 6. Recuperar workflows fallidos

Revisar los mensajes de error enviados a Discord, identificar qué workflows están fallando y registrar para cada uno: último run, causa raíz, responsable y acción de recuperación. Agregar una verificación periódica para que un workflow que deja de dispararse no pase inadvertido.

Comprobar si están fallando o funcionando bien.

### **Kun Agent APP — 17/9/26, 13:25**

![🚦](https://discord.com/assets/4a6863b0c517dba6.svg) Sprint Health — SportMatch — 2026-09-04 | Estado ![🟡](https://discord.com/assets/621a7aa2fab475e2.svg) | Burndown: DESCONOCIDO, WIP: DESCONOCIDO, Blockers: DESCONOCIDO  
![📌](https://discord.com/assets/c7ba45651998dd2c.svg) Linear: `sin_ciclo_activo`; no hay tickets del ciclo activo, por eso no infiero WIP/burndown/sin movimiento.  
![🔎](https://discord.com/assets/a3fe372089097f3f.svg) PRs esperando review: 4 (#27, #25, #23, #21); 1 >48h (#21), 0 >72h.  
![⚠️](https://discord.com/assets/fb6fd920c79bd504.svg) Sin movimiento: DESCONOCIDO (Linear sin ciclo activo).  
![🎯](https://discord.com/assets/8683903b8675f909.svg) Atención hoy: revisar PR #21; activar/verificar ciclo en Linear.



### **Lionel AgentAPP — 14:37**

![📄](https://discord.com/assets/1edcd854c11d1317.svg) El Curador de contexto actualizó el issue de drift existente. Issue: [https://github.com/SportmatchOrg/sportmatch/issues/28](https://github.com/SportmatchOrg/sportmatch/issues/28)