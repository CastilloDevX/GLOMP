# Pruebas y estado de aceptación

## Hito 0

Entorno probado: Node.js 26.8.1 y GDevelop 5.6.283 para Linux.

```sh
node tools/scaffold.js
node tools/build.js && node tools/check.js
node tools/selftest.js
node tools/gen_assets.js --milestone 0 --dry-run
```

Resultados automáticos:

- Build y check pasan. Build comprueba sintaxis antes de escribir.
- Build y scaffold mantienen idéntico SHA-256 y no crean backups adicionales
  cuando no hay cambios. Antes de escrituras reales crean copia del proyecto.
- Selftest: 13 comprobaciones de esquema, rechazo de eventos no permitidos,
  mandos simulados 2/6, índices dispersos, conexión/desconexión, API ausente o que
  falla, acumuladores a 30/144 fps, inicialización única, CRC/lectura PNG y chroma.
- El dry-run no envía peticiones ni necesita la clave. El generador conserva
  archivos existentes y permite reutilizar originales sin volver a cobrarlos.

Prueba de integración real: abrir game.json en GDevelop → Preview → pantalla Boot
con título, estado e instrucciones. Se capturó pantalla y se verificó el log de
arranque tras recargar, sin excepciones ni mensajes de error de consola.
La evidencia temporal está ignorada en `.cache/`, no forma parte del juego.

El contador mostró 0 y la API de mandos estaba disponible. No se conectaron mandos
físicos. El caso de API no disponible también está cubierto por selftest y muestra
un aviso explícito, sin confundirlo con ausencia de dispositivos.

## Pendiente para aceptar H0

1. Revisión humana de la referencia y apertura del proyecto sin avisos.
2. Exportación web y prueba física de seis mandos simultáneos.
3. Registrar resultados de esa prueba y confirmar el cierre del hito.

No hay partidas ni minijuegos implementados. Las 50 rondas de POM y las demás
invariantes de juego no se han ejecutado ni se presentan como aprobadas.

## Comprobaciones de los siguientes hitos

- H0.5: navegación completa con teclado y con mando, volver, listo y foco.
- H1: persona mueve, come, crece y aprueba la sensación de control.
- H2: dos personas completan 2:30 y cada una devora o es devorada dos veces.
- H3: cuatro personas completan una partida a cinco rebanadas.
- H4: 50 rondas de POM verifican aviso, cobertura y ruta; Crazy termina y activa
  el antibloqueo. Implementar simulación de esos modos cuando existan.
- H5: comprar, equipar, cerrar y abrir conserva el accesorio; cosméticos no
  modifican configuración ni mecánicas.
- H6/H7: rondas completas con los números de jugadores compatibles.
- H8: Chrome/Firefox de otra persona, rendimiento y pruebas de diversión.

## Hito 0.5 y base del Hito 1 (verificación automática)

- `node tools/selftest.js`: 18 comprobaciones. Añade: claves de i18n completas,
  sandbox con 2 y 6 jugadores (30 s simulados, sin salir de la arena ni NaN),
  resultado idéntico a 30 y 144 fps, y tienda que no altera `GLOMP.config`.
- El código real de `view.js`, `ui.js` y `sandbox.js` se ejecutó en Chromium sin
  interfaz con PIXI 7.4.2 (el mismo de GDevelop 5.6.284) y un escenario simulado.
  Menú, Sala (2 jugadores de teclado listos), Personalizar (compra y vista previa),
  Ajustes y Arena se dibujaron sin errores de consola y la navegación pidió
  la escena correcta. Esto NO sustituye abrir el proyecto en GDevelop.

## Pendiente humano (no se declara cerrado ningún hito)

1. H0: abrir `game.json`, Preview, exportar a web, probar seis mandos físicos.
2. H0.5: recorrer Menú → Sala → Personalizar → Arena con mando y con teclado;
   B vuelve; el foco nunca se pierde; comprar y equipar un color conserva el
   cambio tras recargar la página.
3. H1: mover el slime en Práctica 5 minutos y decir si se siente bien.
   Si se ve pequeño en la arena de 1400 px, decidir si se reduce el margen de cámara.
