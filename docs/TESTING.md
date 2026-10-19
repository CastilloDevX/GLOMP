# Pruebas de la rework

## Verificación automática ejecutada

En esta sesión: `node tools/build.js && node tools/check.js` y
`node tools/selftest.js`. 37 comprobaciones: formato nativo, rechazo de eventos
no permitidos, idempotencia, PNG, diagnóstico simulado de mandos, física 30/144,
colisiones/límites, tienda sin mutación de config, confirmación de teclado y color,
conservación de colores, cámara y congelación antes del inicio, premios únicos,
fin de copa, rotación sin repeticiones y límites de todos los modos con 2/6.

POM se audita durante 50 rondas del generador: aviso ≥0.8 s, cobertura conservadora
≤60%, zona máxima de Misteriosa y pasillos continuos ≥120 px libres también de
obstáculos. Crazy prueba incluso jugadores perfectos y activa el suministro
vivos−1 hasta terminar. EatEm prueba devorar/reaparecer y Salsa a masa cero.
Buffet prueba empujón, inmunidad, migas sin recogida inmediata por el dueño,
Manjar continuo, multiplicador final y desempate. Guerra prueba tres huecos,
curación con coste, preparación de proyectil e inmunidad sin daño por contacto.

Esto no mide diversión, ghosting, seis mandos físicos ni aceptación de hitos.

## Navegador y editor

GDevelop instalado: 5.6.284. Proyecto de referencia: esquema 5.6.283. Se abrió
`game.json` y se ejecutó su Preview nativa, no un renderizador de prueba alterno.
La carga de los 41 recursos quedó lista y sin error. Capturas de QA fuera del
repositorio, en /tmp; no constituyen assets del juego.

Recorrido ejercitado mediante eventos CDP reales de teclado/puntero:

1. [+] → confirmar controles → J1 cambia color y confirma.
2. Shift derecho → confirmar controles → J2 cambia color y confirma.
3. Ambos listos → Enter → Arena; conserva los dos colores.
4. Ronda de Guerra → estadísticas → Bubble POM! automáticamente en Cocina.
5. Mapa entero a 1920×1080 y tarjetas arriba izquierda/derecha.

El tiempo de algunas rondas se adelantó por pasos de simulación para revisar
límites y reparto. No se presenta como una partida jugada por dos personas.
Se detectó y corrigió un fallo de propagación de eventos PIXI: los botones ahora
hacen hit testing DOM con las coordenadas del canvas y respetan el modal activo.

## Aceptación humana pendiente

- Dos personas simultáneas con teclado, incluida Acción remapeada sin colisiones;
  verificar ghosting, cancelación, retirada de plazas y navegación sin ratón.
- Pantalla completa Full HD y otra proporción; legibilidad de sprites pequeños,
  cambio de nivel de detalle, HUD con 6 y nombres detrás/delante de obstáculos.
- Come y crece: 2:30 con al menos dos devoradas por persona; sensación al comer,
  crecer, frenar y girar. Revisar auras y legibilidad dentro de arbustos.
- POM: aviso comprensible y rutas de escape. Medir si el pasillo central fijo
  favorece demasiado esperar quieto; no cambiar las pruebas para ocultarlo.
- Crazy: objetivo entendido en 10 s, recogida exclusiva y antibloqueo legible.
- Buffet: corona visible, Manjar interrumpible, remontadas y Zampada contra muros.
- Guerra: puntería con ratón, stick derecho y ocho direcciones de J2; munición,
  charcos, sandía, zona, proyectiles opuestos y eliminación simultánea.
- Copa a cinco rebanadas, empate, monedas/primera partida diaria una sola vez,
  guardado al cerrar navegador y revancha con el mismo grupo.
- Seis mandos físicos, desconexión/reconexión y exportación en otro PC.
- Externos: ≥70% pide revancha, último puesto remonta ≥20%, una persona nueva gana.
- Audio pendiente: comprobar volumen cuando existan pistas y efectos con licencia.

También se probó la exportación HTML5 nativa en Chromium independiente desde
http://127.0.0.1:8080, con perfil limpio: 41 recursos cargados, controles E y
Shift derecho, selección individual y Arena. Se inspeccionaron los tres temas,
los niveles pequeño/grande y el caso visual de 6 plazas con hardware simulado.
Se corrigieron etiquetas recortadas y se atenúa el HUD si tapa a un personaje.
La prueba 37 conserva pulsaciones de Acción que empiezan y terminan entre frames.
