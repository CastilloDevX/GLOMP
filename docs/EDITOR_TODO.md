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

## Cierre de H0 y H0.5 — checklist exacta para una persona

1. Abrir `game.json` en GDevelop 5.6.284 sin avisos de compatibilidad ni de recursos.
   Deben existir 8 escenas: Boot, Menu, Lobby, Customize, Shop, Settings, Credits, Sandbox.
2. Pulsar Preview en Boot. Tras la carga (≈0,2 s) debe pasar sola a Menu.
   Si se queda en "Cargando" o aparece el aviso de imágenes: anotar el error de consola.
   Vigilar que las texturas sigan válidas al cambiar de escena (GDevelop podría
   descargar recursos no usados por objetos; si pasa, hay que pasarlos a recursos globales).
3. Conectar mandos, pulsar A en cada uno en la Sala; probar con 6 a la vez.
   Registrar el resultado en `docs/GDEVELOP_NOTES.md` (sección Mandos).
4. Exportar a web y repetir 2-3 en Chrome o Firefox.
5. Si todo pasa: marcar H0 y H0.5 como aceptados en `docs/TESTING.md`.

Arte pendiente de Google (cuota 429): solo existe la cara `happy`, el bocadito y el
cuerpo base (ChatGPT). Faltan las caras 2-6, accesorios, partículas y rastros (H5).
