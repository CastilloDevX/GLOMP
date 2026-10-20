# Contrato técnico verificado de GDevelop

Conservar este documento: el trabajo de crear el andamio ya no está en la cola,
pero el esquema sigue siendo necesario para no corromper el proyecto.

## Referencias y versión

- `reference/empty.json`: proyecto generado con la fábrica/serializador nativos de
  GDevelop 5.6.283; `gdVersion` = build 283, major 5, minor 6, revision 0.
- `reference/templates.json`: plantillas de objetos e instancia de esa sesión.
- `reference/provenance.json`: método y hashes SHA-256 que verifican las herramientas.
- `reference/image-resource.json`: plantilla de recurso de imagen obtenida del
  editor 5.6.284. La versión del editor instalado debe verificarse al ejecutar;
  no es una razón para cambiar a mano los hashes o el formato del proyecto.
- La creación fue automatizada dentro del editor real; sigue pendiente revisión
  humana. El guardado del editor puede actualizar versiones: comparar el esquema
  y revalidar antes de aceptar una referencia nueva.

## Único evento por escena

```json
{
  "type": "BuiltinCommonInstructions::JsCode",
  "inlineCode": "// GLOMP:INJECT scene=Boot",
  "parameterObjects": "",
  "useStrict": true,
  "eventsSheetExpanded": false
}
```

`inlineCode` es string; el marcador es su primera línea y debe nombrar la escena.
No añadir eventos visuales ni eventos hijos. Build concatena los módulos del
manifiesto y conserva `GLOMP.__loaded` para no reiniciar el namespace en cada tick.
Cada escena solo despacha onStart y onTick; la lógica permanece en src.

## Contenedores y herramientas

- Escenas: `layouts`; primera escena: `firstLayout`; objetos globales: `objects`.
- Recursos: `resources.resources`.
- Escena: `objects`, `instances`, `events`, `layers`, `variables`, `objectsGroups`,
  `objectsFolderStructure`, `behaviorsSharedData`. La capa base se llama `""`.
- Instancia: `name`, `x`, `y`, `layer`, `zOrder`, `persistentUuid`, tamaños y
  propiedades/variables iniciales. Objetos: behaviors, effects y variables.
- TextObject conserva propiedades en raíz y en `content`; scaffold debe mantener
  ambas representaciones coherentes.
- Scaffold crea recursos/objetos/escenas desde el manifiesto; build solo rellena
  los JsCode. Son idempotentes y crean backup antes de escrituras reales.
- Check valida formato, referencias, sintaxis y build actualizado; no certifica
  que una persona haya jugado ni que el hardware admita seis mandos.

## Mandos: evidencia y pendiente

La Preview comprobada expuso `navigator.getGamepads()` y devolvió **0 conectados**.
No demuestra límite de cuatro. Los casos 2/6 de selftest son simulados.
Conservar maxPlayers en 6 hasta la prueba real. Registrar navegador, sistema,
modelos e índices al probar seis a la vez; solo si se demuestra límite de cuatro
se baja config a 4. Exportación y prueba física siguen pendientes.

## Rework de octubre de 2026

Nueve escenas; Arena despacha GLOMP.match y Sandbox solo práctica. Recursos pixel
con smoothed=false y texturas PIXI nearest. El mapa se dibuja mediante el PIXI 7
incluido en GDevelop, sin dependencias añadidas. Capas por altura para obstáculos,
personajes y HUD. El root personalizado no participa en los eventos federados de
PIXI: los botones usan hit testing DOM, coordenadas lógicas y foco bajo GLOMP.
Esto evita «Cannot find propagation path to disconnected target» en Preview.

Build y scaffold exponen main para probar idempotencia sin procesos hijos. No se
ha relajado la validación del esquema ni se han modificado hashes de referencia.

## Dirección vigente del 19 de octubre

El apartado pixel art anterior documenta la versión sustituida. Arte activo:
mapas originales completos, un cuerpo tintable y cara separada. PIXI 7 incluido
expone SimplePlane y NineSlicePlane: ambos se comprobaron en Preview nativa.
La malla usa aVertexPosition y actualiza su buffer desde onTick; no se añade
requestAnimationFrame ni motor externo. Cámara propia compartida bajo GLOMP.

Se creó una FontResource mediante la API nativa de GDevelop 5.6.284 y se serializó
con Project, sin adivinar campos. Plantilla: reference/font-resource.json. Contiene
file, kind="font", metadata, name y userAdded. Scaffold la clona para el TTF;
FontManager.loadResource/getFontFamily y document.fonts.load esperan su carga.
La exportación conserva el nombre del recurso aunque aplane la ruta del archivo.
Los hashes y el esquema original de eventos permanecen sin modificar.
