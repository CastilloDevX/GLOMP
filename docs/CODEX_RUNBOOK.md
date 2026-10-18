# Runbook para Codex — GLOMP!

Lee primero `AGENTS.md` completo (incluida §11 Enmiendas).

## Generación de imágenes (Nano Banana / Gemini)
- Clave: variable de entorno `GOOGLE_AI_STUDIO` (archivo `.env`, ignorado por git). No la muestres ni la escribas en ningún archivo.
- Modelos (verificados con la clave):
  - `gemini-3-pro-image` (Nano Banana Pro): banner, logo, mapas, hoja de skins.
  - `gemini-3.1-flash-image` (Nano Banana 2): sprites en lote, comida, UI.
  - `gemini-2.5-flash-image`: respaldo.
- Endpoint REST: `POST https://generativelanguage.googleapis.com/v1beta/models/<modelo>:generateContent?key=$GOOGLE_AI_STUDIO` con `contents[].parts[]` = texto + `inline_data` (imágenes de referencia en base64). La imagen sale en `candidates[0].content.parts[].inlineData.data`.
- Referencias de estilo OBLIGATORIAS en cada llamada: `samples/banner.png`, `samples/skins.png` (slimes/UI) o `samples/map-*.png` (mapas).
- Prompt base fijo: "chibi glossy jelly slime, thick soft outline, candy-saturated palette, cohesive with the reference images". Mapas: "top-down Brawl-Stars-style arena, symmetric layout, flat checkered floor, tileable obstacles".
- Transparencia: Gemini no da alfa. Pide fondo plano `#FF00FF` y recorta con `tools/chroma.js` (sin halo en bordes). Revisa cada muestra.
- Todo se registra en `assets/manifest.json` (id, prompt, modelo, referencias, tamaño, estado). El generador (`tools/gen_assets.js`) es idempotente: no regenera lo ya hecho; soporta `--dry-run`.
- Nombres: `assets/<categoria>/<id>.png` (`slime/`, `body/`, `face/`, `accessory/`, `particles/`, `trail/`, `food/`, `map/`, `ui/`).
- Genera solo los assets que necesita el hito actual.

## Lote de assets (31 piezas §5.8 + resto)
slime base blanco tintable (idle, squash, stretch, comer, muerte) · 8 cuerpos · 6 caras · 10 accesorios · 4 partículas · 3 rastros · 8 comidas (§5.3) · obstáculos · 3 mapas (candy, cooking, slime) con arena cuadrada 1400/1700/2000 · logo, botones, paneles, iconos de marcador ⬤ ■ ▲ ★ ◆ ⬢, tarjetas, fondos de menú/lobby.

## Modelo de trabajo
- Un hito por sesión. Al terminar: `node tools/build.js && node tools/check.js`, resumen, y esperar confirmación.
- Un humano abre GDevelop al cierre de cada hito para confirmar "sin avisos" y jugar (§8 no marca hito cerrado sin esto).
- Mensaje de arranque: "Lee AGENTS.md y docs/CODEX_RUNBOOK.md. Haz el Hito 0. Cuando termines, dime qué encontraste y espera."

## Pendiente humano (única vez)
Crear en GDevelop 5 un proyecto vacío con una escena `Boot` que tenga un evento "Código JavaScript" y guardarlo como `reference/empty.json` (Archivo > Guardar como `.json`/carpeta del proyecto).
