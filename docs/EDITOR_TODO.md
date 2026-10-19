# Validaciones humanas y trabajo de editor pendientes

Solo tareas todavía necesarias. Los assets aprobados y el andamio existente no
se vuelven a crear. La implementación prevista está en PLAN_MAESTRO.md.

## Base existente

- Revisar `reference/empty.json` y confirmar su único evento JsCode. Su procedencia
  fue automatizada con el serializador del editor; falta la revisión humana.
- Abrir `game.json` en GDevelop y verificar Boot → Menu, recursos disponibles,
  cambios de escena sin texturas descargadas y ausencia de avisos. Si existe
  `GLOMP!.json`, conservarlo y comparar antes de unificar copias.
- Probar exportación web en un navegador de destino. Registrar versión real del
  editor/navegador, resultado y consola; no asumir que una prueba simulada la cubre.

## Tras implementar menú integrado y Full HD

- Probar ambos `[+]`: abrir modal, cancelar, elegir WASD/flechas, revisar Acción,
  confirmar, editar y quitar invitado. Con teclado no puede aparecer un tercero.
- Probar dos personas simultáneamente: WASD + E y flechas + Shift derecho, y otra
  Acción confirmada sin colisión. Revisar combinaciones que el teclado físico
  pueda omitir por ghosting y ofrecer otra Acción cuando sea necesario.
- Verificar foco al abrir/cerrar modal; navegar sin ratón; volver con Esc/B.
- En Full HD 1920×1080, revisar fondo, bordes del mapa, UI y HUD sin recortes;
  comprobar ventana y pantalla completa, y salida/entrada de ese modo.
- Jugar Práctica, comer y crecer contra esquinas y muros. Registrar sensación y
  problemas concretos; no cerrar H1 solo por que el código se ejecuta.

## Tras implementar la ronda

- Comprobar mapa real y explicación, 3 → 2 → 1 → GLOMP!, y que antes de jugar no
  haya movimiento, consumo de Acción ni daño.
- Completar una ronda, revisar estadísticas/premios y esperar la siguiente sin
  pulsar botones. Pausar y volver a enfocar no deben saltar estados.
- Terminar una partida: resultados finales, recompensa única y revancha con el
  mismo grupo. Probar los criterios humanos de cada modo según TESTING.md.

## Mandos y audio

- Cuando haya hardware, conectar seis mandos y activar cada uno; registrar los
  índices simultáneos. Cero conectados no demuestra un límite. Si se demuestra
  un máximo de cuatro, actualizar config y notas, sin rediseñar el proyecto.
- Probar desconexión/reconexión durante menú, cuenta y juego; el bot sustituto no
  crea otro participante ni recibe premios como una identidad nueva.
- En H8, incorporar música/efectos con licencia y registrar origen y permisos.
  Los placeholders actuales son silenciosos; la IA de imagen no produce audio.
