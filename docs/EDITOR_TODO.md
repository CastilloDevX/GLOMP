# Pendientes del editor y validación humana

## Hito 0 — antes de avanzar al shell

- Abrir `/home/castillo/Gdevelop/GLOMP/reference/empty.json` en GDevelop 5 y revisar
  que Boot contiene exactamente un evento Código JavaScript con su marcador.
  La referencia fue obtenida automáticamente con el motor del editor; falta la
  revisión humana exigida en AGENTS.md §11.
- Abrir `/home/castillo/Gdevelop/GLOMP/game.json`. Confirmar que no hay avisos de
  compatibilidad o recursos. Pulsar Preview: deben verse el título, el contador
  de mandos y las instrucciones. Ya se ejecutó automáticamente en GDevelop,
  pero la aceptación de una persona permanece pendiente.
- Exportar a web desde el editor y abrir la exportación en el navegador de destino.
- Conectar seis mandos, pulsar un botón en cada uno y verificar los seis índices
  simultáneos en la consola y el contador. Registrar navegador, sistema y mandos
  usados en GDEVELOP_NOTES.md. No interpretar 0 conectados como un límite técnico.
- Si se demuestra un límite de cuatro, modificar únicamente `maxPlayers` y
  documentarlo; después ejecutar build y check.

H0 no está cerrado. No hay todavía menú, lobby ni minijuegos implementados.

## Arte

- Estilo del cuerpo base blanco aprobado por el usuario.
- Uso temporal de ChatGPT aprobado tras errores HTTP 429 de Google AI Studio.
- El PNG aprobado está en `assets/slime/base-white-chatgpt-v1.png`; conserva alfa.
- El manifiesto registra prompts, referencias, proveedor y estado de revisión.
- Nano Banana principal y respaldo rechazaron la generación por cuotas FreeTier.
  Retomar su pipeline cuando haya cuota; no se obtuvo ninguna imagen de Google.
- No lanzar el lote de los siguientes hitos ni considerarlo terminado durante H0.
  Antes de producir las capas, fijar y revisar anclajes comunes del cuerpo, cara y
  accesorios. Las imágenes de `samples/` siguen siendo referencias de estilo.

## Audio — Hito 8

No hay audio generado ni referencias a archivos inexistentes. El arranque es
silencioso. Sustituir los placeholders silenciosos por música y efectos con
licencia documentada durante H8, según el runbook.
