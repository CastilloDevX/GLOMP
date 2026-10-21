# Verificación de la revisión cartoon y panorámica

## Automatización

`node tools/build.js && node tools/check.js` y `node tools/selftest.js`:
53 comprobaciones. Esquema nativo sin eventos visuales añadidos, idempotencia,
PNG, mandos simulados 2/6, física 30/144 fps, límites, recogida exclusiva, tienda
sin mutación de config, confirmación de teclado/color, guardado, cámara y bloqueo
antes de GLOMP!, premios únicos, final de copa y rotación sin modo consecutivo.

- Bubble POM: 50 semillas, portador aleatorio, explosión al agotar la mecha,
  pase solo con Acción, protección de devolución, mecha conservada y reparto
  después de eliminar al portador también en el flujo real de match.
- Lava: 50 arenas, zonas de caída transitables y avisos ≥0.8 s, empujón orientado,
  retroceso frente a movimiento contrario, escudo, caída y empate simultáneo.
- Crazy: suministro vivos−1 y terminación incluso con jugadores perfectos.
- EatEm: devorar, masa repartida, reaparición y Salsa sin muerte a masa cero.
- Buffet: Zampada, aturdimiento, migas sin recogida inmediata del dueño, Manjar,
  última comilona y desempate.
- Rig: deformación orientada, parpadeo, gesto y un único cuerpo activo. Cámara:
  grupo visible y bots NPC excluidos. Cosméticos: 31 piezas, seis destacados,
  sets, mezcla, retirada, guardado y equivalencia de velocidad/hitbox.
- Mapas fuente 16:9, mundo horizontal, cámara cubre el viewport durante la
  presentación y el juego; comida evita el volumen elevado de los props.
- Arranque sin textos; guardado nativo multilínea válido y rechazo de líneas no string.
- Galería: paginar o previsualizar no compra ni cambia el equipo guardado.
- Todos los modos compatibles terminan dentro del máximo de 180 s con 2/6.

Las pruebas antiguas de bombas y munición se sustituyeron porque el usuario
cambió las reglas; no se presenta su antigua garantía de pasillos como aplicable
al nuevo quema la papa. Las invariantes de avisos de objetos caídos se mantienen.

## Editor y exportación reales

GDevelop instalado 5.6.284; referencia revalidada al esquema 5.6.284. Se verificaron
FontResource, SimplePlane, NineSlicePlane y filtro de color del cuerpo en el motor real. Exportación HTML5
nativa a `.cache/export-web`, servida localmente por `node tools/serve.js`.
86 imágenes y fuente local cargan sin error. No hay un renderizador alternativo
que sustituya GDevelop en estas comprobaciones.

QA con Chromium y eventos CDP reales, perfil de pruebas aislado:

- Armario, seis caras, equipamiento y regreso; Tienda, saldo insuficiente,
  Ajustes, remapeo de Acción, Créditos, Práctica y regreso con Esc.
- [+], confirmación, dos colores independientes, JUGAR → Arena con presentación,
  pausa, Continuar y regreso a la sala. Equipo/teclas sobreviven a recargar.
- Las diez vistas de accesorio, cuatro brillos, tres rastros y cuatro sets;
  compra, foco en Equipar, confirmación con Acción remapeada, mezcla, retirada y
  persistencia. El saldo artificial empleado pertenece solo al perfil de QA.
- Seis mandos **simulados** incorporados por A, confirmación por plaza y comienzo
  por el anfitrión. Render de los cinco modos en sus mapas, HUD y encuadre de
  supervivientes. Capturas a 1920×1080 y 1366×768.

El canvas puede conservar resolución lógica Full HD y escalarse por CSS en una
ventana menor: no se exige que la escala del root PIXI cambie. Se comprueba el
rectángulo visible del canvas, las proporciones y los controles.

Capturas y scripts temporales de QA fuera de los archivos entregables. Las
pruebas automatizadas no representan una partida jugada por dos personas.

## Pulido de iconos, botones y reparto

Comprobaciones nuevas sin render: contadores monótonos que no mutan el saldo,
campeón final correcto aunque sea segundo en la última ronda, y distribución de
columnas dentro del panel para dos a seis participantes. Los tiempos de
presentación viven en config.ui.polish; las recompensas conservan su lógica.

En la exportación nativa se verificaron los 28 PNG individuales, los botones [+], foco,
controles y títulos con una sola capa de texto. Capturas de podios con dos y seis
participantes y del final de copa. Pausa sobre el reparto, Continuar y regreso
final se ejercitaron mediante eventos de teclado/ratón CDP, sin excepciones.
Los mandos de esta comprobación son simulados; no certifican hardware físico.

Los 28 PNG tienen archivos y hashes distintos, alfa válido y recursos registrados.
La cruz de quitar jugador mide 52×52 y aparece dentro de su cabecera; se probó
quitar primero una plaza y después la última sin cambiar el dispositivo restante.
Los siete iconos de categorías quedan encima de sus títulos, sin superponerse a
las tarjetas. Se revisaron títulos en Créditos, Ajustes y Tienda y adaptación a
1366×768. Las capturas de sala/tienda usan el arte generado, sin iconos vectoriales
sustitutos.

## Aceptación humana pendiente

- Dos personas: movimiento, comer/crecer, devorar dos veces, gestos, ghosting,
  remapeo y copa completa con revancha. Revisar colisiones con cuerpos grandes.
- Mapas: correspondencia entre arte, zonas transitables, arbustos y estanque.
  Lectura de formas y colores con seis; cámara compartida cerca de los bordes.
- Bubble POM: persecución divertida, pase comprensible, mecha y devoluciones.
- Lava: lava visible, fuerza de empujón, objetos, avisos y remontadas justas.
- Crazy/Buffet: objetivo claro, pedidos exclusivos, antibloqueo, corona y Manjar.
- Seis mandos físicos, desconexión/reconexión, modelos, índices y navegador.
- Exportación en otro PC; pantalla completa, rendimiento y guardado al cerrar.
- Externos: entender en 10 s, ≥70% revancha, ≥20% remontadas y una persona nueva
  gana una ronda. Si fallan, revisar diseño y balance.
- Audio: incorporar pistas/efectos con licencia y después verificar sus volúmenes.

No declarar H1–H8 aceptados sin esas sesiones humanas y comprobaciones físicas.
