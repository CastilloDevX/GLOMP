# GLOMP!

Party game local de slimes y comida, para GDevelop 5 y exportación HTML5.
La especificación está en AGENTS.md; §11 prevalece sobre sus reglas anteriores.

**Estado: andamio del Hito 0 implementado, pendiente de aceptación humana y de
prueba física de seis mandos. Todavía no es un juego jugable.**

## Abrir

Abrir `game.json` con GDevelop 5.6.283 y pulsar Preview. Boot muestra el diagnóstico
de mandos. Para detectar un mando puede ser necesario pulsar un botón en él.

## Reconstruir

Requiere Node.js 22 o superior para las herramientas; no se instala ninguna
dependencia. El código del juego usa JavaScript ES2020.

```sh
node tools/scaffold.js
node tools/build.js && node tools/check.js
node tools/selftest.js
```

Editar lógica en `src/`, textos en `src/i18n.js` y balance en `src/config.js`.
No editar los eventos de `game.json`. El manifiesto de scaffolding vive en
`tools/project.manifest.json`. Las herramientas conservan backups ignorados por Git.

## Arte

`assets/slime/base-white-chatgpt-v1.png` es el cuerpo blanco tintable aprobado.
Se generó con la herramienta de imagen de ChatGPT, con transparencia real.
Prompts y procedencia están en `assets/manifest.json`.

Google AI Studio respondió HTTP 429 por cuota tanto para Nano Banana 2 como
para el respaldo. El usuario autorizó usar ChatGPT temporalmente. No hay assets
de Google generados todavía.

Para revisar el pipeline sin consumir cuota:

```sh
node tools/gen_assets.js --milestone 0 --dry-run
```

Cuando exista cuota, el generador REST usa `GOOGLE_AI_STUDIO` desde `.env` o el
entorno. Nunca copia la clave al juego, a prompts ni al manifiesto:

```sh
node tools/gen_assets.js --id slime-base-nanobanana-v1
```

La implementación sigue la [API oficial de generación de imágenes de Google](https://ai.google.dev/gemini-api/docs/generate-content/image-generation).
Los originales con fondo magenta se conservan. `tools/chroma.js entrada.png
salida.png` crea PNG RGBA sin dependencias; todo recorte requiere revisión visual.

## Siguiente validación

Consultar `docs/EDITOR_TODO.md`, `docs/GDEVELOP_NOTES.md` y `docs/TESTING.md`.
No se declara cerrado ningún hito por pasar únicamente las pruebas automáticas.
