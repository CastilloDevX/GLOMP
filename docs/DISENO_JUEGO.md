# GLOMP! — Diseño vigente de la rework

Dirección del usuario: composición de lobby inspirada en Brawl Stars, personajes
personalizables como en una selección de luchadores e identidad propia de GLOMP!.
Arte de las arenas y slimes en pixel art. La especificación de reglas detallada
sigue en AGENTS.md; este documento describe su implementación y decisiones nuevas.

## Sala y controles

Menu es la sala principal; Lobby y Customize conservan rutas compatibles hacia
la misma selección. Fondo: assets/ui/menu-village.png. Perfil/logo pequeño arriba,
accesos laterales, personajes en el centro, Práctica y JUGAR abajo.

Los dos [+] ofrecen la siguiente plaza de teclado libre. Antes de ocuparla se
muestran movimiento y Acción, se permite cambiar Acción sin duplicar teclas y se
exige confirmar. E y Shift derecho también abren esta confirmación, salvo que el
perfil conserve otra Acción remapeada; siempre se muestra la tecla real.

Máximo dos teclados: WASD y flechas. Tres o más participantes exigen mandos en
todas las plazas. A incorpora cada mando. Cada participante cambia su propio
color con izquierda/derecha y confirma con Acción; cambiarlo retira su estado
Listo. Hay ocho colores libres de identificación y marcadores de forma por plaza.
Todos son mecánicamente idénticos. El anfitrión usa arriba/abajo para los accesos;
Enter inicia la copa. Con mandos, A del anfitrión inicia cuando todos están listos.

JUGAR solo abre Arena con al menos dos plazas conectadas y confirmadas. Nunca
abre Sandbox. Práctica es una ruta explícita y no entrega moneda ni rebanadas.

## Mapas, cámara y pixel art

Resolución objetivo 1920×1080. En 16:9 el mapa entero cubre el canvas sin marco
externo. Otras proporciones conservan la geometría y encuadran el mapa. Para 5/6
personas se amplía el mundo manteniendo 16:9. La cámara queda fija durante juego.

Tres temas adaptados de samples/maps: Dulcería, Cocina Revuelta y Jardín de Slime.
Cada uno tiene suelo repetible, muro, obstáculo, arbusto y pieza central separados;
sus distribuciones difieren. Los obstáculos tienen una huella de colisión y una
imagen que sobresale hacia arriba para mostrar volumen. El orden por altura
permite pasar delante/detrás. La vegetación se transparenta si tapa a alguien en
los modos que no usan ocultación. Los avisos de peligro quedan encima de ella.

Los slimes usan tres PNG originales independientes: small, medium y large.
Cambian por tamaño visible en pantalla, con filtrado nearest. Son tres niveles de
detalle generados, no una promesa de lienzos físicos de 48/96/192 píxeles: sus PNG
fuente tienen mayor resolución. Cambiar imagen o color no altera la hitbox.

HUD superpuesto: J1 izquierda/J2 derecha, J3/J4 debajo y J5/J6 en la tercera fila.
Cronómetro arriba al centro, aviso único abajo y marcadores sobre los slimes.
No se dibuja el logo de marca durante el juego; GLOMP! aparece como inicio de ronda.

## Ronda y copa

Sala → presentación del mapa real con desplazamiento/zoom y explicación (5 s) →
3, 2, 1 → GLOMP! → simulación → estadísticas (8 s) → otro minijuego y otro tema.
Durante presentación/cuenta no se avanza la simulación ni se consume Acción.
Las rondas están limitadas a 180 s, incluido Crazy Ingredients por indicación
nueva del usuario. Al llegar a cinco rebanadas se muestran resultados finales y
se vuelve a la sala al aceptar; no continúa esa misma copa.

Rotación compatible, sin repetición consecutiva:

| Modo | Personas | Máximo | Resultado |
|---|---:|---:|---|
| Come y crece | 2–4 | 150 s | masa |
| Bubble POM! | 2–6 | 75 s | supervivencia |
| Ingredientes locos | 2–6 | 180 s | supervivencia; empate de supervivientes al límite |
| Buffet Blitz | 3–6 | 120 s | masa; desempate por Manjares |
| Guerra de Comida | 2–6 | 120 s | supervivencia; vida al límite |

Primero +2 rebanadas, segundo +1, empates comparten posición. En llegada simultánea
a cinco decide la posición de esa ronda; empate exacto comparte victoria. Los
Glomps se acreditan una vez por reparto y una vez al completar la copa. Perfil y
cartera locales compartidos, equipo independiente por plaza. Perder también paga.

POM garantiza aviso mínimo, límite conservador de cobertura y una cruz central
transitable de al menos 120 px. Crazy limita el suministro total del pedido a
vivos−1 tras tres pedidos sin eliminaciones; recoger no repone ese suministro.
Guerra muestra una trayectoria de preparación de 0.8 s antes de lanzar, para
respetar el aviso mínimo también a corta distancia. Curar/acelerar gasta un hueco
y la misma Acción. La Salsa no elimina; un desconectado conserva su plaza con
sustituto gris y vuelve al recuperar el mando.

## Implementación y aceptación

Lógica en src/minigames, maps, match y hud; números en config, texto en i18n,
recursos en art y el manifiesto. Scaffold/build utilizan el contrato nativo
verificado; no editar eventos JSON a mano. Audio y cosméticos completos siguen
en PLAN_MAESTRO. Ver TESTING y EDITOR_TODO antes de aceptar hitos.
