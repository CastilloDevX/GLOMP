# GLOMP!

Party game local de slimes y comida para GDevelop 5 y exportación HTML5.

Existe el andamio, un shell de ocho escenas y una arena de práctica. Todavía no
hay minijuegos completos ni ciclo automático de partida. La nueva dirección de
menú integrado y Full HD está planificada; no se presenta como implementada.

## Documentación vigente

- [AGENTS.md](AGENTS.md) / [CLAUDE.md](CLAUDE.md): especificación; §12 recoge la dirección actual.
- [Plan de pendientes](docs/PLAN_MAESTRO.md): orden, módulos y aceptación.
- [Diseño](docs/DISENO_JUEGO.md): menú con [+], controles, Full HD y flujo de ronda.
- [Assets para ChatGPT](docs/ASSETS_CHATGPT.md): prompts individuales y producción por prioridad.
- [Pruebas](docs/TESTING.md) y [validación humana](docs/EDITOR_TODO.md).
- [Contrato de GDevelop](docs/GDEVELOP_NOTES.md) y [runbook](docs/CODEX_RUNBOOK.md).

## Abrir y reconstruir

Abrir `game.json` en GDevelop 5 y pulsar Preview. Las herramientas requieren
Node.js 22 o superior; el juego usa ES2020 y no añade dependencias.

```sh
node tools/scaffold.js
node tools/build.js && node tools/check.js
node tools/selftest.js
```

Lógica en src, balance en config, textos en i18n y recursos/escenas en el
manifiesto. No editar eventos a mano. No sustituir el proyecto canónico por una
copia del editor sin compararla primero.

Arte activo: ChatGPT, autorizado por el usuario; Nano Banana queda suspendido
por cuota. Reutilizar los PNG aprobados. La clave de Google permanece en `.env`
y no forma parte del juego ni de Git. Ningún hito se acepta solo por pasar selftest.
