# GLOMP!

Party game local de slimes y comida en GDevelop 5. La rework incluye sala con
selección individual de color, tres mapas por piezas en pixel art, cinco
minijuegos, presentación/cuenta y avance automático entre rondas.

Abrir **game.json** en GDevelop y pulsar Preview. `GLOMP!.json` es una copia vacía
creada desde el editor: no es el proyecto que contiene el juego.

Dos teclados: WASD + E y flechas + Shift derecho; se revisa y confirma Acción antes
de entrar. Se respetan acciones remapeadas del perfil. Cambia color con izquierda/
derecha y confirma con Acción. Enter inicia cuando todos están listos. Tres a seis
personas requieren mandos. Práctica permanece separada de la copa.

```sh
node tools/scaffold.js
node tools/build.js && node tools/check.js
node tools/selftest.js
```

JavaScript ES2020 sin dependencias añadidas; herramientas con Node 22+. Balance en
src/config.js, texto en src/i18n.js y lógica en src. No editar eventos a mano.
Proyecto/UI 1920×1080, mapa completo, HUD superpuesto y cámara fija durante juego.

- [Diseño vigente](docs/DISENO_JUEGO.md) y [pendientes](docs/PLAN_MAESTRO.md).
- [Assets y prompts](docs/ASSETS_CHATGPT.md): 35 PNG nuevos con ChatGPT.
- [Pruebas](docs/TESTING.md), [aceptación humana](docs/EDITOR_TODO.md).
- [Contrato de GDevelop](docs/GDEVELOP_NOTES.md) y [runbook](docs/CODEX_RUNBOOK.md).
- [Especificación](AGENTS.md), también disponible en CLAUDE.md.

Faltan aceptación con personas, prueba física de seis mandos, audio y catálogo
cosmético completo. Ningún hito se da por aceptado solo por pasar pruebas automáticas.

Para jugar la exportación HTML5 local: en GDevelop, Share → Browser → HTML5,
exporta a `.cache/export-web` y ejecuta `node tools/serve.js`. Abre
http://127.0.0.1:8080. La exportación de esta sesión ya está en esa carpeta;
no abrir index.html directamente con file://.
