# GLOMP! — Pendientes después de la rework pixel art

La sala integrada, selección individual de color, arena Full HD, presentación,
cuenta, cinco modos, reparto y avance automático ya tienen implementación.
No volver a planificarlos como funciones inexistentes. Las reglas vigentes están
en DISENO_JUEGO.md; las pruebas automáticas no sustituyen la aceptación humana.

1. Jugar con dos personas reales: confirmar teclas, seleccionar colores distintos,
   terminar una copa, volver a la sala y repetir. Registrar ghosting del teclado.
2. Validar movimiento y diversión de cada modo. Ajustar balance solo en config.js.
   En POM el generador reserva pasillos centrales seguros: medir si permiten
   esperar quieto demasiado tiempo antes de ampliar el generador con rutas variables.
3. Conectar seis mandos físicos y registrar navegador e índices. Hay cobertura
   simulada de 2/6, pero eso no certifica hardware. Si el límite probado es cuatro,
   bajar maxPlayers; no rediseñar la arquitectura.
4. Validar la exportación HTML5 en otro PC/navegador, pantalla completa y
   desconexión/reconexión de mandos durante todas las fases.
5. Completar cosméticos por capas en pixel art. Los ocho colores de identificación
   de sala son libres; quedan pendientes caras intercambiables, accesorios,
   partículas, rastros y el catálogo completo de 31 piezas. No mezclar el antiguo
   cuerpo ilustrado con los nuevos sprites durante una partida.
6. Incorporar audio con licencia y comprobar los controles de volumen con audio
   real. Actualmente no hay música ni efectos sonoros.
7. Congelar funciones y corregir los defectos encontrados en pruebas externas.

H1–H8 no se declaran aceptados: faltan sus sesiones humanas y pruebas físicas.
