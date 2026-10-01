# QA

El rol de QA protege la calidad del producto antes del merge y deja evidencia accionable para el equipo. Las fuentes de verdad del rol son:

- [DEUDA_TECNICA.md](DEUDA_TECNICA.md): hallazgos vigentes de la auditoría manual.
- [skills/pr-review/SKILL.md](skills/pr-review/SKILL.md): checklist usado para revisar pull requests.
- [PENDIENTES.md](PENDIENTES.md): mejoras futuras del rol; no son trabajo comprometido del sprint actual.

## API Test Agent

El agente toma un ticket de Linear, levanta PostgreSQL y las migraciones en un runner de GitHub Actions, precarga el contexto del módulo y genera tests e2e para la API. Puede escribir únicamente specs bajo `back/test/*.e2e-spec.ts`. Después ejecuta Jest, TypeScript y ESLint, valida el resultado y abre una PR draft desde una rama `bot/tests-<ticket>` hacia `dev`.

El loop tiene límites duros: hasta 5 iteraciones, 3 corridas de tests y 600 segundos. Si encuentra un posible bug del producto, no debilita el test: lo conserva como `it.failing(...)`, lo documenta en la PR y, si Linear está disponible, también en el ticket. El historial y el resumen de cada corrida quedan como artifact durante 14 días.

### Cómo ejecutarlo

Requisitos previos en el repo `SportmatchOrg/sportmatch`:

- El workflow `.github/workflows/test-agent.yml` y el harness de `back/test/` están instalados.
- Existe el secret `LLM_API_KEY`.
- `LINEAR_API_KEY` es recomendable para leer criterios de aceptación y comentar bugs; `LLM_API_KEY_FALLBACK` es opcional.

Ejecución normal:

1. Abrir **GitHub → Actions → API Test Agent → Run workflow**.
2. Seleccionar la rama que contiene el workflow, se puede omitir.
3. Completar `ticket` con el identificador de Linear, que sea de backend, por ejemplo: `SPO-168`.
4. Completar `rf` solo si no se puede deducir del ticket. Dejar `llm_model_chain` vacío salvo que se quiera sobrescribir la cadena configurada, lo que permite es elegir el modelo que se usa y sus fallbacks. Si se carga crédito se pueden usar modelos pagos también.
5. Ejecutar y revisar el resumen del job, el artifact y la PR draft resultante. Un run fallido o una salida no validada no se toma como evidencia de QA.

Para diagnosticarlo localmente desde el repo `agents-copilot`:

```bash
LLM_API_KEY=... .github/scripts/test-agent/run-local.sh /ruta/a/sportmatch SPO-168 RF-03
```

La ejecución local no abre una PR automáticamente.

## QA PR Review Agent

Se ejecuta al abrir, actualizar, reabrir o marcar como lista una PR no draft contra `dev` o `main`. Prepara una review en estado `PENDING` con hasta cinco hallazgos; la persona a cargo de QA debe quitar falsos positivos, editar lo necesario y enviarla. El agente no aprueba, solicita cambios, mergea ni modifica código por sí solo.

La review pendiente solo es visible para la cuenta que la creó. Por eso `QA_GITHUB_TOKEN` debe pertenecer a quien ejerce QA durante la rotación y tener permisos mínimos de lectura de contenido y lectura/escritura de pull requests. Al rotar el rol, verificar el token y hacer una corrida de prueba.