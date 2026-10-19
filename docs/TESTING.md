# Criterios de prueba pendientes

Las comprobaciones de esta lista son criterios para la próxima implementación,
no resultados ya aprobados. La base existente dispone de selftest; las pruebas
simuladas no equivalen a validación física ni a aceptación humana.

## Herramientas durante implementación

```sh
node tools/scaffold.js
node tools/build.js && node tools/check.js
node tools/selftest.js
```

Ejecutar scaffold cuando cambien recursos/escenas. En revisiones exclusivamente
documentales comprobar enlaces, coherencia y diff; no regenerar game.json.

## Menú, incorporación y controles

| Caso | Resultado exigido |
|---|---|
| Abrir con teclado | Fondo elegido y slime central; ningún invitado ficticio |
| Ambos [+] | Mismo flujo y reglas; no altas duplicadas al pulsar rápido |
| Cancelar modal | Ninguna plaza/tecla consumida; foco al botón de origen |
| Host sin configurar | JUGAR pide confirmar controles, no inicia con fuente implícita |
| Confirmar WASD y flechas | Dos fuentes lógicas independientes; cada Acción afecta solo a su jugador |
| Repetir preset o Acción ocupada | Rechazo visible, sin sobrescribir al otro jugador |
| Tercer perfil de teclado | No se admite, aunque se use el otro [+] |
| Editar/quitar invitado | Cancelar conserva controles anteriores; quitar libera el preset |
| JUGAR con plaza pendiente | Inicio deshabilitado; no relleno con bots |
| Navegación | Ratón, teclado y mando cuando esté conectado; foco visible y B/Esc vuelven |
| Volver de tienda/ajustes | Grupo, controles y equipo conservados |

## Full HD, física y render

- Canvas y composición objetivo 1920×1080. Texturas de fondo con dimensiones
  nativas comprobadas. Ningún asset ausente se registra como final.
- Mapa entero en 16:9, de borde a borde y sin deformación; otra proporción conserva
  todo el mapa. Círculos siguen siendo círculos, también tras entrar/salir de fullscreen.
- No spawns ni objetivos necesarios detrás del HUD. Un jugador o peligro cubierto
  sigue siendo visible por la política de transparencia.
- Crecimiento contra paredes/esquinas no atrapa al slime. Cosméticos no cambian
  hitbox, velocidad, masa, daño ni config. Misma geometría en los tres temas.
- 30 y 144 fps con entradas equivalentes: resultado de simulación consistente,
  sin NaN, posiciones fuera de límites ni temporizadores duplicados.
- Prueba real de teclas simultáneas y de pantalla completa desde un gesto del usuario.

## Máquina de estados de la partida

1. Seleccionar modo/mapa/semilla una vez. Omitir la intro conserva esa selección.
2. Intro muestra el mapa real, objetivo y controles; no avanzan simulación,
   duración del modo, spawns peligrosos ni consumo de Acción.
3. Orden exacto 3, 2, 1, GLOMP!, juego; una pulsación retenida no salta todos los
   estados ni dispara el primer Chispazo/proyectil accidentalmente.
4. Reloj empieza una sola vez. Pausa/pérdida de foco detienen todos los acumuladores.
5. Fin simultáneo de condiciones entrega un solo resultado y paga una sola vez.
6. Estadísticas incluyen todos los participantes, empate correcto y cifras reales.
7. Agotada la espera, nueva ronda automática; ningún botón es obligatorio.
8. Victoria a cinco pasa a resultados finales; no ronda extra ni segundo premio.
9. Desconexión mantiene identidad y equipo; reconexión recupera el mismo jugador.
10. Partida completada siempre paga Glomps. Guardado conserva compras/equipo tras recargar.

## Aceptación por modo

| Fase | Prueba necesaria |
|---|---|
| H1 | Persona mueve, come, crece y aprueba sensación |
| Eat it Eat them | 2 personas, 2:30; cada una devora o es devorada al menos dos veces |
| Partida H3 | 4 personas alcanzan cinco rebanadas con flujo íntegro, premios y guardado; resolver antes la política de un solo modo |
| POM | 50 rondas automáticas: aviso ≥0,8 s, cobertura ≤60 %, ruta libre ≥120 px en cada estado relevante, incluido encogimiento |
| Crazy | 1000 rondas: antibloqueo limita suministro total del pedido, hay progreso y final; resolver eliminación simultánea de todos |
| Tienda H5 | Compra/equipo persisten; 31 piezas y mezcla de capas sin cambio mecánico |
| Buffet | Rondas con 3–6; liderazgo, Manjar, empujes y casos contra pared |
| Guerra | Rondas con 2 y 4; inventario limita decisiones, zona cierra y nadie vivo queda sin actuar más de 5 s |

Probar 2 y 6 participantes en los modos compatibles; verificar que la selección
excluye Eat it Eat them para 5–6 y Buffet para 2. Los tests de reglas deben comprobar
invariantes a lo largo de la simulación, no únicamente el estado final.

## Cierre y diversión

Exportar a Chrome y Firefox de otra persona. Verificar seis jugadores y carga
representativa de objetos en el equipo objetivo, sin errores de consola ni
recortes. Medir comprensión en diez segundos, revancha ≥70 %, remontada del
último ≥20 % y una ronda ganada por alguien nuevo. Si falla, revisar el diseño.
Registrar fecha, entorno, evidencia y resultado cuando se ejecute; mientras tanto
estos criterios permanecen pendientes.
