# GLOMP! — Diseño vigente

La dirección del 19 de octubre de 2026 sustituye el pixel art, la cámara fija,
las bombas de Bubble POM y los disparos de Guerra de Comida. El juego sigue siendo
local, con slimes mecánicamente idénticos y dos entradas: Mover y Acción.

## Sala y accesos

Menu es la sala principal, con `assets/ui/menu-village.png`, logo aprobado,
personajes sobre plataformas, accesos laterales y JUGAR abajo. Tienda abre los
seis destacados diarios y todo el catálogo; Armario abre las caras. Ajustes,
Créditos y Práctica tienen entrada y regreso con foco, teclado, ratón y mando.

Los [+] incorporan hasta dos teclados, después de confirmar sus controles:
WASD + E y flechas + Shift derecho, con Acción remapeable sin duplicados. Desde
la tercera persona todas las plazas requieren mandos. Cada participante cambia
su color y confirma Listo por separado. Cambiar color retira Listo. Enter inicia;
el anfitrión de mando también inicia con A. JUGAR abre Arena, Práctica Sandbox.

Armario/Tienda permiten previsualizar, comprar, equipar y retirar adornos, elegir
la plaza y combinar piezas. Hay 8 colores, 6 caras, 10 accesorios, 4 partículas y
3 rastros: 31 piezas, más cuatro combinaciones de set. Los sets compran las piezas
sueltas; no bloquean combinaciones ni cobran de nuevo las piezas ya compradas.
Compras, equipo por plaza y teclas se guardan en localStorage. Ningún cosmético
modifica velocidad, escala, hitbox, retroceso o puntuación.

## Arte, mapas y cámara

Canvas objetivo: 1920×1080. Los tres mapas originales de `samples/maps` se copian
sin reinterpretar a `assets/illustrated/maps`; conservan su geometría cuadrada.
Las huellas de chocolate, mostradores, rocas y estanque central se trazan en
coordenadas normalizadas de config. La vegetación señalada se puede atravesar;
el estanque central es sólido. La arena de lava es una imagen original nueva,
con una plataforma redondeada despejada y peligros fuera de ella.

Los mapas de exploración miden 3000×3000 unidades; la arena de lava 3200×1800.
La cámara compartida sigue al grupo de humanos vivos, ajusta zoom y reserva
margen para el HUD. Excluye bots NPC y mantiene visibles a los supervivientes.
Sumo limita el acercamiento para conservar visibles los bordes de lava.
La presentación recorre y abre el mapa completo; la cuenta acerca la cámara al
grupo sin avanzar la simulación. El escenario conserva proporciones; los bordes
fuera del mundo muestran un ambiente del tema, nunca una arena estirada.

Todos los tamaños usan el mismo cuerpo blanco aprobado. Una malla articulada
se deforma hacia la velocidad, respira, rebota y responde al bocado. Ojos y boca
son PNG independientes sin tinte: mirada, parpadeo y gestos tienen movimiento
propio. Solo el cuerpo cambia de color. Accesorios acompañan la coronilla; brillos
y rastros son exclusivamente visuales. Los PNG pixel anteriores quedan como
historial y no se cargan en la exportación vigente.

Títulos: Lilita One local, licencia OFL incluida; no se afirma que sea la fuente
propietaria de otro juego. Logo original y cintas ilustradas conservan identidad
GLOMP!. HUD compacto alternado izquierda/derecha, hasta tres filas por lado,
cronómetro al centro y sin logo persistente durante el gameplay.

## Modos y rondas

Sala → presentación 5 s → 3, 2, 1 → GLOMP! → juego → reparto 8 s → otro modo.
No se repite minijuego consecutivo; los mapas se eligen de su conjunto compatible.
Al alcanzar cinco rebanadas termina la copa y aparece el regreso a la sala.
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

El arte generado no aumenta mágicamente la resolución de los mapas originales.
La calidad visual y el balance necesitan revisión jugando. No se declara calidad
AAA ni aceptación de hitos por pasar pruebas automáticas. Audio pendiente: las
opciones de volumen están preparadas, pero todavía no existen pistas ni efectos.
