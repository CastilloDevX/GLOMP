# GLOMP! — Diseño vigente

La dirección del 20 de octubre de 2026 conserva el rework ilustrado y sustituye el pixel art, la cámara fija,
las bombas de Bubble POM y los disparos de Guerra de Comida. El juego sigue siendo
local, con slimes mecánicamente idénticos y dos entradas: Mover y Acción.

## Sala y accesos

El arranque muestra únicamente el fondo azul oscuro existente, sin título, texto
de carga ni diagnóstico de mandos en pantalla; estos permanecen en consola.

Menu es la sala principal, con la nueva versión `assets/cartoon/ui/village.png`
registrada como menu-village, logo aprobado,
personajes sobre plataformas, accesos laterales y JUGAR abajo. Cabecera y
monedero en cápsulas azules, iconos propios y botones de colores. Tienda abre los
seis destacados diarios y todo el catálogo; Armario abre las caras. Ajustes,
Créditos y Práctica tienen entrada y regreso con foco, teclado, ratón y mando.

Los [+] incorporan hasta dos teclados, después de confirmar sus controles:
WASD + E y flechas + Shift derecho, con Acción remapeable sin duplicados. Desde
la tercera persona todas las plazas requieren mandos. Cada participante cambia
su color y confirma Listo por separado. Cambiar color retira Listo. Enter inicia;
el anfitrión de mando también inicia con A. JUGAR abre Arena, Práctica Sandbox.

Los ocho iconos de Tienda, Armario, Ajustes, Práctica, Copa, Jugar, Glomps y
Créditos son PNG generados individualmente, con volumen cartoon, contorno oscuro
y medallones cian/dorados. Las siete categorías, controles, ajustes e indicadores
comparten esa dirección: 28 imágenes independientes en assets/icons. Los botones
con texto usan una superficie redondeada coherente; [+], cruz roja y flechas usan
su imagen completa sin una segunda superficie que duplique sus bordes. Conservan
foco, pulsación y estado desactivado. Cada cabecera de jugador incluye una cruz
roja visible de 52×52; al quitar una plaza se conserva el dispositivo de las demás.
Las cintas centran un único texto y ajustan sus dimensiones al espacio disponible.

Armario/Tienda permiten previsualizar, comprar, equipar y retirar adornos, elegir
la plaza y combinar piezas. Hay 8 colores, 6 caras, 10 accesorios, 4 partículas y
3 rastros: 31 piezas, más cuatro combinaciones de set. Los sets compran las piezas
sueltas; no bloquean combinaciones ni cobran de nuevo las piezas ya compradas.
Galería de seis tarjetas en tres columnas y dos filas, páginas para las categorías
largas y vista previa grande a la izquierda. Seleccionar o cambiar de página no
compra. Compras, equipo por plaza y teclas se guardan en localStorage. Ningún cosmético
modifica velocidad, escala, hitbox, retroceso o puntuación.

## Arte, mapas y cámara

Canvas objetivo: 1920×1080. Todos los mundos miden 3200×1800, proporción 16:9.
Dulcería, Cocina y Jardín se reconstruyen con fondos horizontales de suelo y
perímetro en `assets/cartoon/maps`, inspirados en samples/maps. Los obstáculos,
vegetación y objeto central son PNG independientes en `assets/cartoon/props`.
Sus huellas físicas normalizadas están en config; el orden de dibujo depende
de la base de cada pieza. La vegetación es transitable; los objetos centrales
son sólidos. Los alimentos evitan tanto las huellas como el volumen visual
superior de los obstáculos. Lava conserva su ilustración horizontal y plataforma.

La cámara compartida sigue al grupo de humanos vivos y ajusta zoom sin salir
del escenario ni dejar bandas vacías en 16:9. Excluye NPC y mantiene visibles a
los supervivientes; Sumo limita el acercamiento para mostrar la lava. La
presentación recorre y abre el mapa completo; la cuenta acerca la cámara al
grupo sin avanzar la simulación. Ningún fondo cuadrado se estira a panorámico.

Una sola base cartoon blanca, `assets/cartoon/slime/body.png`, sirve para todos
los tamaños; no cambia la silueta al crecer. La malla respira, rebota y se inclina
hacia el movimiento. Un filtro aplica color solo al cuerpo y conserva reflejos
blancos. La cara es una capa vectorial separada: ojos pequeños oscuros, brillo
simple, mejillas, parpadeo y sonrisa sin dientes. Las seis expresiones siguen
siendo equipables. La cara conserva sus colores y acompaña el movimiento.
Accesorios sencillos anclados a la coronilla, partículas y rastros siguen siendo
cosméticos. Las skins y trajes completos quedan aplazados por indicación del
usuario; las referencias de personajes no implican fabricar esos trajes ahora.
El arte anterior se conserva como historial, sin cargarlo si ya no está activo.

Títulos: Lilita One local, licencia OFL incluida; no se afirma que sea la fuente
propietaria de otro juego. Logo original y cintas ilustradas conservan identidad
GLOMP!. HUD compacto alternado izquierda/derecha, hasta tres filas por lado,
cronómetro al centro y sin logo persistente durante el gameplay.

## Modos y rondas

Sala → presentación 5 s → 3, 2, 1 → GLOMP! → juego → reparto 8 s → otro modo.
No se repite minijuego consecutivo; los mapas se eligen de su conjunto compatible.
Al alcanzar cinco rebanadas termina la copa y aparece el regreso a la sala.
El reparto muestra un panel azul sobre el fondo del tema desenfocado, podios
para los dos a seis participantes, slimes equipados y pilas de rebanadas reales.
Entrada del panel, ascenso escalonado de podios, saltos de celebración, caída de
rebanadas, recuento de Glomps, confeti y barra de espera se animan con acumuladores
de dt. La vista solo lee los premios ya acreditados; no vuelve a pagar ni cambia
el balance. En el final de copa, el campeón encabeza el podio aunque haya terminado
segundo en la última ronda. Se conservan empates de ronda, estadísticas y regreso.
La pausa también funciona durante el reparto. Se muestran rebanadas que faltan,
no una predicción del número de rondas necesarias.

Primero +2 rebanadas y segundo +1; los empates comparten posición. Los premios
se acreditan una sola vez y terminar la copa siempre paga.

| Modo | Personas | Máximo | Regla |
|---|---:|---:|---|
| Come y crece | 2–4 | 150 s | Comer, devorar, reaparecer; gana la masa |
| Bubble POM! | 2–6 | 15 s | Portador inicial aleatorio; Acción pasa el chicle |
| Ingredientes locos | 2–6 | 180 s | Tocar el pedido; antibloqueo vivos−1 |
| Buffet Blitz | 3–6 | 120 s | Masa, Manjar, corona y Zampada |
| Sumo de lava (`war`) | 2–6 | 120 s | Empujar fuera; gana el último en pie |

Bubble POM usa **una mecha global** que no se reinicia con los pases. El portador
tiene una pequeña ayuda de velocidad; debe acercarse y mirar al rival para
pasarlo con Acción. La protección breve tras un pase evita devoluciones en el
mismo instante. Al agotarse los 15 s explota el portador y termina la ronda;
los demás comparten la primera posición. El cronómetro, anillo y tarjeta indican
quién lo lleva. Estadísticas: pases acertados.

Sumo de lava elimina apuntado, ratón de combate, munición y proyectiles. Acción
prepara un empujón frontal con enfriamiento. El retroceso se integra separado del
movimiento; mantener la dirección contraria no lo borra. Salir de la plataforma
elimina. Desde 65 s se anuncia subida de lava y después se reduce el suelo.
Todos los objetos caídos anuncian su zona al menos 0.8 s antes del impacto:
banana acelera 4 s; escudo bloquea un golpe durante 8 s; chicle ralentiza en un
charco 3 s; sandía produce una onda de empuje. No hay daño por roce. Al límite,
los supervivientes empatan; las caídas simultáneas conservan el empate.

## Límites de la entrega

Las dimensiones reales de los PNG están registradas en el manifiesto; el canvas
Full HD no implica que cada imagen fuente mida 1920×1080.
La calidad visual y el balance necesitan revisión jugando. No se declara calidad
AAA ni aceptación de hitos por pasar pruebas automáticas. Audio pendiente: las
opciones de volumen están preparadas, pero todavía no existen pistas ni efectos.
