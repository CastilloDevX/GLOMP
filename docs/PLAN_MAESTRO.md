# GLOMP! — Trabajo pendiente

Plan para Codex y Claude Code, actualizado el 18 de octubre de 2026. La dirección
actual está en [AGENTS.md §12](../AGENTS.md). Esta revisión es planificación y
limpieza documental: no implementa las funciones descritas.

## Punto de partida

Ya existen build/check/scaffold, namespace, entrada, guardado básico, tienda
parcial, render, movimiento/comida y ocho escenas conectadas, incluida Sandbox.
El menú sigue enviando a Lobby; la ventana es 1280×720 y el lienzo UI 1600×900.
No existen todavía minijuegos ni un ciclo completo de partida. No rehacer esa
base ni confundir código existente con aceptación humana.

El esquema verificado permanece en [GDEVELOP_NOTES.md](GDEVELOP_NOTES.md).
Las validaciones humanas que aún faltan están en [EDITOR_TODO.md](EDITOR_TODO.md).
No se mantienen tareas de crear el andamio ni de regenerar los assets aprobados.

## 1. Menú principal y alta local

Resultado: entrar al juego, incorporar a otra persona y preparar la partida desde
la misma pantalla, siguiendo la composición de la captura aportada por el usuario.

| Trabajo pendiente | Implementación prevista | Aceptación |
|---|---|---|
| Composición Full HD | `src/ui.js`, `src/view.js`, `config.ui` y manifiesto a 1920×1080; fondo `menu-village.png`; slime principal grande sobre pedestal | Sin recortes, solapamientos ni bordes vacíos en 1920×1080 |
| Jerarquía de menú | Perfil local arriba izquierda, Glomps arriba derecha, Tienda/Personalizar a la izquierda, Ajustes/Créditos a la derecha, Práctica abajo izquierda y JUGAR abajo derecha | Foco evidente y accesos por ratón, teclado y mando; sin cuentas ni controles online |
| Grupo local integrado | Migrar `ui.lobby` a un modelo de participantes separado de la presentación; `[+]` a izquierda y derecha; tarjetas pequeñas al incorporarse | Ambas entradas abren el mismo flujo; sin dobles altas |
| Confirmación de teclado | Modal con preset libre, tecla de Acción y prueba breve; crear participante solo al confirmar | Máximo dos perfiles: WASD y flechas; cancelar no ocupa plaza |
| Límites y errores | Rechazar controles duplicados, plazas incompletas y tercer jugador de teclado; permitir editar/quitar un invitado | Mensaje claro; foco vuelve al `[+]` que abrió el modal |
| Migración de Lobby | Eliminar su paso del flujo cuando Menu sustituya todas sus funciones; retirar escena/despachador solo al verificar referencias | JUGAR no pasa por la antigua sala ni obliga a recorrer Personalizar |
| Preparación de partida | Todos los participantes tienen controles confirmados y están listos; JUGAR requiere dos humanos; Práctica admite uno | La práctica no rellena plazas con bots ni reparte premios de partida |

Orden interno: modelo de participantes → modal de controles → composición → foco
y estados → migración de navegación. Reutilizar las pantallas existentes de tienda,
personalización y ajustes; conservar equipo y controles al volver al menú.

El modal está definido en [DISENO_JUEGO.md](DISENO_JUEGO.md). El soporte futuro de
3–6 personas sigue limitado por los mandos y los modos compatibles. No bajar
`config.maxPlayers` por estar desarrollando con solo teclado.

## 2. Mapa completo a pantalla completa

Resultado: el mundo jugable es un rectángulo 16:9 que encaja de borde a borde en
1920×1080. Se elimina el cuadrado central de Sandbox y sus márgenes laterales.

1. Separar resolución de presentación, dimensiones del mundo y tamaño original
   de cada textura. No multiplicar velocidad, hitbox ni daño por resolución o DPR.
2. Migrar `world.size` a `width`/`height`: spawn, paredes, recogida, bots, colisiones
   y futuros peligros. Revisar player, food, sandbox, mapas, HUD y selftest.
3. Mantener proporción 16:9 mediante dimensiones configurables por número de
   jugadores. Revisar el balance por el cambio de superficie; no estirar el mundo
   cuadrado ni sus colisionadores para que parezca rectangular.
4. Crear `src/maps/` con geometría común y temas Candy, Cooking y Slime. El arte
   no decide las colisiones: sólidos y zonas libres salen de la descripción del mapa.
5. Crear `src/hud.js` como capa superpuesta compacta, con áreas reservadas en
   bordes para no ocultar spawn, comida necesaria ni rutas de escape.
6. Añadir Full HD real al canvas y los fondos. El fondo aprobado mide 1672×941:
   priorizar su versión nativa Full HD según ASSETS_CHATGPT. Ampliar el PNG no
   equivale a terminar la producción de arte Full HD.
7. Solicitar pantalla completa desde una interacción explícita. Sin ella, llenar
   el viewport disponible. En otras proporciones, encuadre uniforme sin recorte.

La cámara queda fija durante la acción. El movimiento de presentación pertenece
solo a la introducción y termina antes de la cuenta atrás.

## 3. Completar y validar la sensación del slime — H1

Revisar y afinar el código existente, en vez de reconstruirlo:

- Deslizamiento y crecimiento contra muros en el mapa rectangular.
- Deformación en ambas direcciones, frenado, gulp y capas con anclajes comunes.
- Recogida simultánea por distancia al centro, con desempate determinista.
- Escala máxima, velocidad desde config y comportamiento 30/144 fps.
- Dos humanos en el mismo teclado y reconexión de mandos.
- Comidas pendientes y geometría de prueba coherente con el arte.

Aceptación: una persona juega, come y crece y aprueba la sensación; registrar la
observación. Las pruebas automáticas no sustituyen este paso.

## 4. Primera ronda completa — H2 + base del flujo

Implementar `src/minigames/eat_em.js` según AGENTS.md: devorar, cobertura,
inmunidad, reaparición, cuatro bots de presa, salsa avisada, arbustos, Chispazo y
auras identificables en pantalla compartida. No añadir desempate por llegada a
una masa: conservar los empates de la especificación.

Junto con ese modo, construir `src/match.js` y las presentaciones comunes:

```text
Menu → Ruleta → Presentación del mapa y reglas → 3 → 2 → 1 → GLOMP!
     → Minijuego → Estadísticas y reparto
                    ├→ Ruleta → siguiente ronda automática
                    └→ Resultados de partida, cuando alguien gana
```

| Estado | Comportamiento y salida |
|---|---|
| Ruleta | Solo modos implementados, probados y compatibles; selección única de modo, mapa y semilla; giro automático |
| Presentación | Mapa real, objetivo y controles breves; jugadores/peligros congelados; omitir conduce a la cuenta atrás |
| Cuenta atrás | Un paso para cada número y golpe GLOMP!; mapa completamente encuadrado; entradas retenidas bloqueadas |
| Minijuego | Iniciar reloj, spawns peligrosos y control exactamente una vez; entregar resultado inmutable al finalizar |
| Estadísticas | Puestos, métricas del modo, rebanadas, Glomps y progreso hasta la próxima ronda; no esperar un botón |
| Resultados finales | Premios de partida una sola vez, revancha o menú; conservar grupo y controles |

Todos los tiempos nuevos se propondrán en config: intro 5 s, cada número 1 s,
golpe GLOMP! 0,6 s, estadísticas 6 s y ruleta 3 s. Son valores iniciales para
implementar y probar, no cambios ya aplicados. Pausa o pérdida de foco detienen
los acumuladores. No usar temporizadores del navegador.

Aceptación H2: dos personas completan 2:30 y cada una devora o es devorada dos
veces. Aceptación del flujo: intro, cuenta, ronda y estadísticas sin saltos,
repeticiones de premios ni entradas que atraviesen pantallas.

## 5. Partida completa y economía — H3

- Rebanadas 2/1/0, empates y victoria a cinco según AGENTS.md.
- Estadísticas de ronda y total acumulado, con un único registro de resultados.
- Glomps de ronda/partida, premio diario y multiplicador por grupo; guardado
  versionado. Una partida terminada paga aunque no se gane.
- Separar guardado persistente de estadísticas de sesión; reconexión no crea una
  identidad ni un premio nuevos.
- Probar una partida completa con cuatro humanos y recarga del guardado.

Decisiones que se deben resolver antes de cerrar H3:

| Caso | Decisión pendiente |
|---|---|
| Un solo modo compatible | H3 pide probar con un modo, pero la ruleta prohíbe repetir. Acordar una excepción limitada a demo o disponer de dos modos; no introducir repetición oculta |
| Empate también en la ronda decisiva | Definir victoria compartida o desempate; la regla solo resuelve posiciones distintas |
| Precio del set | Mantener 180; corregir la etiqueta antes de publicar: los cinco precios suman 310 y no corresponde a −25 % |

## 6. Tres minijuegos y tienda completa — H4/H5

- **POM:** validar aviso ≥0,8 s, cobertura ≤60 % y ruta ≥120 px; límites,
  charcos, banana y encogimiento según AGENTS.md. Sin Acción añadida.
- **Crazy:** pedidos, eliminación, recogida exclusiva y alimento pedido fuera de
  obstáculos; antibloqueo que limite el suministro durante todo el pedido,
  incluidas reposiciones. Definir resultado si todos son eliminados a la vez.
- **Pruebas:** 50 rondas de POM y 1000 de Crazy; no afirmar que una ronda terminó
  por haber cortado la simulación al superar un tiempo de prueba.
- **Tienda:** cinco capas y 31 artículos, catálogo, seis rotativos, sets, vista
  previa y persistencia. Reutilizar base, colores y guardado existentes.
  Ningún cosmético modifica config ni una medida mecánica.

Aceptación: tres modos en una partida automática completa, objetivo entendido en
diez segundos y compra/equipo conservados al reabrir.

## 7. Ampliación y entrega

| Fase | Pendiente | Condición |
|---|---|---|
| H6 | Buffet: corona, Manjar, Zampada, caída de comida, última comilona | H5 aceptado; rondas con 3–6 jugadores |
| H7 | Guerra: apuntado, inventario de tres, proyectiles, cajas, zona | H5 aceptado y tiempo disponible; primer corte |
| H8 | Audio con licencia, feedback, rendimiento, exportación, diversión | Sin funciones nuevas; otra persona prueba Chrome y Firefox |

La demo mínima conserva Eat it Eat them, POM y Crazy. Reducir más el alcance se
acuerda explícitamente; no presentar dos modos como el objetivo de tres cumplido.
Estimar el calendario después de validar la primera ronda, sin reiniciar una
promesa de tres semanas cada sesión.

## Método de ejecución de cada paquete

1. Tomar la tarea pendiente y sus assets de [ASSETS_CHATGPT.md](ASSETS_CHATGPT.md).
2. Generar muestra por categoría, revisar y aprobar; luego el lote de esa tarea.
   Registrar cada PNG y su prompt exacto.
3. Declarar recursos/escenas en el manifiesto y ejecutar scaffold; lógica en src,
   balance en config y textos en i18n. No editar eventos a mano.
4. Build, check y pruebas pertinentes de [TESTING.md](TESTING.md).
5. Prueba renderizada en GDevelop y con personas cuando corresponda.
6. Commit en español por tarea. Quitar del plan lo aceptado, conservar contratos
   técnicos y registrar en TESTING únicamente la evidencia vigente.
