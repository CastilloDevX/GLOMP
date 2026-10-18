# Formato verificado de GDevelop

## Procedencia y estado

Editor instalado: `/home/castillo/Applications/GDevelop-5.6.283.AppImage`.
`gdVersion`: `{ "build": 283, "major": 5, "minor": 6, "revision": 0 }`.

La referencia se generó dentro de una sesión real del editor, mediante su fábrica
nativa de proyectos y su serializador. No se escribió el árbol de eventos en JSON.
La creación fue automatizada: **todavía requiere revisión humana**, incluida la
condición de referencia revisada por una persona de AGENTS.md §11.1. No se atribuye
su creación a una persona ni se declara cerrado el hito.

Archivos: `reference/empty.json`, `reference/templates.json` y
`reference/provenance.json`. El último registra procedencia y SHA-256; `check.js`
rechaza cambios de estas referencias hasta que se vuelva a verificar el esquema.

La referencia se obtuvo con estas operaciones del editor:

```js
const project = gd.ProjectHelper.createNewGDJSProject();
const scene = project.insertNewLayout('Boot', 0);
const event = scene.getEvents().insertNewEvent(
  project, 'BuiltinCommonInstructions::JsCode', 0
);
gd.castObject(event, gd.JsCodeEvent)
  .setInlineCode('// GLOMP:INJECT scene=Boot');
project.setFirstLayout('Boot');
const element = new gd.SerializerElement();
project.serializeTo(element);
const json = gd.Serializer.toJSON(element);
```

## Evento JavaScript real

```json
{
  "type": "BuiltinCommonInstructions::JsCode",
  "inlineCode": "// GLOMP:INJECT scene=Boot",
  "parameterObjects": "",
  "useStrict": true,
  "eventsSheetExpanded": false
}
```

`inlineCode` es un string, no una lista. El marcador es la primera línea del código.
`parameterObjects` es un string vacío y `useStrict` es booleano. No se añaden eventos
visuales ni eventos hijos. El código inyectado conserva el marcador y despacha
`onStart` una vez por escena y `onTick` con segundos transcurridos.

## Contenedores observados

- Escenas: array raíz `layouts`; primera escena mediante `firstLayout`.
- Recursos: `resources.resources`; objetos globales: `objects`.
- Cada escena tiene `objects`, `instances`, `events`, `layers`, `variables`,
  `objectsGroups`, `objectsFolderStructure` y `behaviorsSharedData`.
- La capa base tiene nombre vacío. Los objetos incluyen `behaviors`, `effects` y
  `variables`, aunque estén vacíos.
- Las instancias usan `name`, `x`, `y`, `layer`, `zOrder`, `persistentUuid`, tamaños
  y arrays de propiedades/variables iniciales.
- Las plantillas de texto y sprite también se obtuvieron con el editor. En texto,
  esta versión guarda propiedades tanto en raíz como dentro de `content`;
  `scaffold.js` mantiene ambas representaciones coherentes.

## Compilación y validación

`tools/scaffold.js` clona la referencia y crea objetos e instancias desde
`tools/project.manifest.json`. Al actualizar, conserva los eventos existentes.
`tools/build.js` concatena config, traducciones y Boot; usa `GLOMP.__loaded` para
evitar reinicializarlos cada fotograma. Los futuros módulos se incorporarán en
el orden definido por el plan conforme se implemente cada hito.

Ambas herramientas son idempotentes, crean backup antes de modificar un proyecto
existente y escriben mediante archivo temporal y renombrado. `check.js` valida
referencias, estructura, despachadores actualizados, sintaxis JS y assets presentes.
Esto no sustituye la prueba del editor ni las pruebas de diversión.

El proyecto generado se abrió en GDevelop y se ejecutó mediante Preview. Se
observó la pantalla Boot con sus tres textos, sin errores de ejecución capturados.

## Mandos

La Preview real expuso `navigator.getGamepads()` y devolvió **0 mandos conectados**.
La consola imprimió `[GLOMP] Mandos detectados: 0. Índices:`.

**No se ha comprobado el límite de seis mandos.** Cero dispositivos conectados no
demuestra un límite de cuatro: `config.maxPlayers` sigue en 6. Los ensayos de 2/6
mandos de `selftest.js` son simulados y no cuentan como validación física.

Para cerrar H0: una persona conecta seis mandos, pulsa un botón en cada uno y
comprueba simultáneamente los seis índices en el navegador de la exportación web.
Si una prueba física demuestra un máximo de cuatro, se baja `maxPlayers` a 4 y se
registra aquí el resultado. La exportación web y ese ensayo siguen pendientes.
