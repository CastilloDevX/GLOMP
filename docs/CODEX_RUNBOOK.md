# Runbook operativo — GLOMP!

## Antes de trabajar

1. Leer AGENTS.md / CLAUDE.md, incluida §14; ambos deben permanecer idénticos.
2. Revisar cambios de otras sesiones sin descartarlos. Proyecto canónico para
   build/scaffold: `game.json`. No sobrescribir ni borrar `GLOMP!.json` si aparece
   como copia del editor; comparar antes de una futura unificación.
3. Tomar la siguiente tarea pendiente de [PLAN_MAESTRO.md](PLAN_MAESTRO.md) y los
   contratos visuales de [DISENO_JUEGO.md](DISENO_JUEGO.md).
4. El esquema real permanece en [GDEVELOP_NOTES.md](GDEVELOP_NOTES.md). Si difiere,
   detener la escritura y verificarlo en el editor.

## Imágenes

Proveedor activo autorizado: **ChatGPT**. Usar [ASSETS_CHATGPT.md](ASSETS_CHATGPT.md)
para los briefs, referencias, rutas y orden. Una imagen por solicitud. Las
herramientas de Google existentes son una alternativa suspendida por cuota; no
hace falta configurarlas ni repetir peticiones para continuar el plan activo.

- Generar muestra, inspeccionar alfa, dimensiones y estilo; aprobar antes del lote.
- Registrar prompt completo, proveedor, referencias, dimensiones reales, estado,
  anclajes y archivo en `assets/manifest.json`. Un resumen no sustituye el prompt.
- Conservar originales y versiones. No sobrescribir una muestra aprobada al
  preparar una variante. El índice `src/art.js` y el manifiesto del proyecto se
  actualizan durante la integración, cuando exista el PNG.
- Sprites: alfa real. El pipeline chroma existente solo se usa cuando haga falta.
- Full HD: comprobar tamaño nativo; no etiquetar como alta resolución un reescalado.
- No pedir a la IA colisiones, letras de botones ni un fotograma por cada tick.

La clave `GOOGLE_AI_STUDIO` sigue exclusivamente en `.env` o en el entorno: no se
imprime ni se añade a prompts, assets, exportación o commits. Si se recupera cuota,
revisar `tools/gen_assets.js` y obtener autorización para cambiar la categoría de
proveedor; no reemplazar silenciosamente el arte aprobado.

## Implementación y cierre de una tarea

- JavaScript ES2020, sin dependencias añadidas; lógica en src, balance en config,
  textos en i18n. Recursos y escenas mediante scaffold; eventos solo por build.
- Después de cambios de código/recursos: `node tools/scaffold.js` cuando aplique,
  luego `node tools/build.js && node tools/check.js` y selftest pertinente.
- Verificar render y controles en GDevelop. Registrar por separado pruebas
  simuladas, pruebas reales y aceptación humana; no intercambiarlas.
- Commit por tarea, en español. No incluir claves, copias del editor ni temporales.
- Al aceptar una tarea, retirarla del plan de pendientes. Mantener esquema,
  decisiones vigentes y pruebas todavía necesarias. Si solo cambian documentos,
  revisar enlaces, coherencia y diff; no regenerar el juego por rutina.
