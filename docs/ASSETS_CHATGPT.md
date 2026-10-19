# GLOMP! — Producción pendiente de imágenes con ChatGPT

Lista operativa para ChatGPT, Codex y Claude Code. Es un plan de producción: las
rutas de las tablas no afirman que esos archivos existan. Generar por prioridad,
una imagen por solicitud; aprobar una muestra de cada categoría antes de su lote.

## Referencias y contrato de entrega

Reutilizar sin regenerar el cuerpo blanco, `title-glomp.png`, `happy.png`, `bite.png`
y el banner original aprobados. Su procedencia está en `assets/manifest.json`.
El fondo obligatorio es `assets/ui/menu-village.png`: ya está aprobado, pero su
fuente mide 1672×941, inferior al objetivo de producción Full HD.

Adjuntar en cada petición `assets/ui/menu-village.png` y `samples/banner.png`.
Añadir `samples/skins.png` y el cuerpo blanco para caras/cosméticos; para mapas,
añadir el `samples/map-*.png` del tema. Las referencias controlan estilo, luz y
perspectiva; no pedir que copie personajes, iconos o logos de Brawl Stars.

Contrato por archivo:

- PNG individual. Fondos 16:9 con resolución nativa mínima 1920×1080; aceptar una
  fuente mayor y conservarla. Sprites e iconos: tamaño solicitado o mayor, alfa
  real y sujeto completo, sin recortes. Verificar dimensiones devueltas.
- No llamar Full HD a una ampliación de una imagen menor. Si el generador no
  alcanza el tamaño solicitado, marcar pendiente de resolución, no aprobado FHD.
- Etiquetas, números, precios, [+], estados y reglas se dibujan desde i18n; los
  fondos y piezas nuevas no llevan texto. Se reutiliza el logotipo aprobado.
- Luz desde arriba izquierda, contorno chocolate suave, misma escala de detalle
  y saturación. Nada de halos, checkerboard pintado, fondos falsamente transparentes
  ni sombras de suelo incrustadas en caras/accesorios.
- Registrar id, archivo, prompt exacto completo, proveedor, referencias, dimensiones,
  estado y anclaje. Guardar versiones; integrar solo el archivo revisado.
- Foco, pulsación, deshabilitado, hover y tintes se producen por código usando la
  misma pieza. No pedir cuatro variantes que cambien su geometría por accidente.

## Cómo formar cada solicitud

Pegar el bloque base correspondiente y **una sola fila** de las tablas; añadir
su ruta, tamaño y referencias. No pedir toda una tabla en una única imagen.
El prompt exacto registrado debe incluir tanto el bloque base como el brief.

### Base F — fondos y mapas completos

> Create one production background image for GLOMP!, a local 2D slime-and-food
> party game. Use the attached images as style references: glossy candy palette,
> soft thick outlines, cheerful warm lighting, polished illustrated game art.
> Landscape 16:9, native resolution at least 1920 by 1080 pixels. No UI, text,
> logos, watermarks, players, characters or baked gameplay effects. Preserve
> clear readable space for the intended composition. Return the artwork itself,
> not a screenshot, device mockup or collage. Follow the single asset brief below.

### Base U — interfaz e iconos

> Create ONE isolated production UI asset for GLOMP!, cohesive with the attached
> village and banner references. Chunky rounded forms, glossy candy material,
> soft thick chocolate outline, warm cream highlights, light from upper left.
> True transparent background, crisp complete silhouette, generous clear padding.
> No words, letters, numbers, prices, UI mockup, watermark or surrounding objects.
> Do not include any icon or label unless the single asset brief requests it.
> Keep geometry readable at its final small display size. Follow the brief below.

### Base S — sprites, capas y objetos

> Create ONE isolated game sprite for GLOMP!, matching the attached style and
> alignment references. Glossy jelly/candy finish, soft thick outline, clear
> silhouette, slight overhead three-quarter view. Actual transparent background.
> No ground shadow, text, watermark, scenery or extra objects. All cosmetic layers
> use the SAME reference body shape, orientation, canvas and attachment anchors.
> When requesting a face or accessory, render ONLY that layer, never a full slime.
> Follow the single asset brief below.

## P0 — Fondo Full HD y otras plazas con el mismo estilo

No reemplazar el fondo canónico mientras se prepara una versión. Generar primero
`menu-village-fhd-v2.png`, compararlo con el aprobado y aprobarlo; solo durante la
integración promoverlo a `menu-village.png`, conservando el original. El menú
seguirá usando ese nombre canónico. Las otras plazas son variantes opcionales:
no desplazan al fondo elegido por el usuario ni bloquean la primera ronda.

| ID | Archivo | Base / tamaño | Brief individual |
|---|---|---|---|
| F01 | `assets/ui/menu-village-fhd-v2.png` | F / ≥1920×1080 | Recreate the reference village plaza at production Full HD detail: cream timber food shops at both edges, bright blue sky, distant towers, peach paving. Preserve its composition and quiet central sky. Lower center is an open stage for two large slimes; keep both side columns and lower UI band uncluttered. No characters. |
| F02 | `assets/ui/village-garden.png` | F / ≥1920×1080 | Same village world, camera, lighting and composition, now a cheerful strawberry-and-citrus garden plaza. Shops and trees only near edges, pale open center and broad peach paving for the character stage. |
| F03 | `assets/ui/village-evening.png` | F / ≥1920×1080 | Same plaza composition at warm sunset with soft peach sky and gentle food-shop lanterns; keep enough brightness and contrast for UI. Empty center stage, no night darkness or glowing clutter. |
| F04 | `assets/ui/village-kitchen-courtyard.png` | F / ≥1920×1080 | Same world and camera, a cozy outdoor cooking courtyard with wooden food stalls at the edges and a distant bakery. Broad empty central paving, warm blue sky, clear side and bottom UI areas. |
| F05 | `assets/ui/village-slime-garden.png` | F / ≥1920×1080 | Same friendly food village with a soft mint jelly garden, mossy stones and tiny mushrooms only at the outer edges. Bright daylight, open pale center and clean ground stage, not a dark cave. |

## P1 — Menú, [+] y confirmación de teclado

Producir primero U01–U09. U10–U15 completan el modal y las tarjetas. Componer la
pantalla y probarla con paneles dibujados por código mientras llegan las piezas;
no presentar placeholders como arte final.

| ID | Archivo | Tamaño | Brief individual con base U |
|---|---|---|---|
| U01 | `assets/ui/panel-user-card.png` | 640×200 | Wide cream and navy profile card, empty circular avatar socket at the left and clear label area at the right. No avatar or writing. |
| U02 | `assets/ui/btn-plus.png` | 256×256 | Rounded square mint-green add-player button, shallow chocolate extrusion and bright top highlight. Center entirely blank; the plus symbol will be drawn in the game. |
| U03 | `assets/ui/btn-play.png` | 768×240 | Wide chunky golden-yellow action button with orange lower bevel, chocolate border and a subtle cream highlight. Entire center blank. |
| U04 | `assets/ui/icon-shop.png` | 256×256 | One cute rounded shopping bag with a jelly-drop emblem; icon only, no button frame. |
| U05 | `assets/ui/icon-customize.png` | 256×256 | One small chef hat with a colorful cosmetic ribbon, icon only; no slime body or face. |
| U06 | `assets/ui/icon-settings.png` | 256×256 | One rounded pale-blue gear with a chocolate central hole, icon only. |
| U07 | `assets/ui/icon-credits.png` | 256×256 | One cream open storybook with a small candy star emblem, icon only; blank pages. |
| U08 | `assets/ui/icon-glomp.png` | 192×192 | One shiny golden coin with an embossed smiling jelly-drop emblem, no numbers or letters. |
| U09 | `assets/ui/pedestal.png` | 512×192 | One low oval cream stone display pedestal with wooden chocolate-colored trim, slight overhead angle, flat empty top. No detached ground shadow. |
| U10 | `assets/ui/panel-controls.png` | 1280×800 | Large cream modal panel with chocolate outline, blue corner accents, blank heading band and open interior for controls and buttons. No symbols or labels. |
| U11 | `assets/ui/icon-keyboard.png` | 320×192 | Compact stylized keyboard with blank keycaps, a few highlighted blue keys, no writing or letters. |
| U12 | `assets/ui/icon-gamepad.png` | 256×192 | Rounded mint gamepad with a dark directional cross and four plain candy buttons; no branded shape or written labels. |
| U13 | `assets/ui/pill-glomps.png` | 512×128 | Empty dark navy currency pill with gold outline and one empty round socket at the left for a separate coin. |
| U14 | `assets/ui/card-practice.png` | 768×256 | Empty wide navy activity card with a mint edge and cream inset, generous blank space for title and a separate button. |
| U15 | `assets/ui/card-mode.png` | 768×256 | Empty wide navy mode card with a yellow edge, empty round icon socket at the left and clean label space at the right. |

Los seis marcadores siempre identifican al jugador, incluso si todos equipan el
mismo color. Un PNG por solicitud, con la correspondencia de config actual:

| ID | Archivo | Tamaño | Brief individual con base U |
|---|---|---|---|
| U16 | `assets/ui/marker-circle.png` | 192×192 | One solid bubblegum-pink circle, thick cream outer stroke, chocolate lower edge. |
| U17 | `assets/ui/marker-square.png` | 192×192 | One golden-yellow square with slightly rounded corners, thick cream outer stroke, chocolate lower edge. |
| U18 | `assets/ui/marker-triangle.png` | 192×192 | One lime-green upward triangle, thick cream outer stroke, chocolate lower edge. |
| U19 | `assets/ui/marker-star.png` | 192×192 | One sky-blue five-pointed star, thick cream outer stroke, chocolate lower edge. |
| U20 | `assets/ui/marker-diamond.png` | 192×192 | One grape-purple diamond, thick cream outer stroke, chocolate lower edge. |
| U21 | `assets/ui/marker-hexagon.png` | 192×192 | One carrot-orange regular hexagon, thick cream outer stroke, chocolate lower edge. |

## P2 — Mapas reales de la primera ronda

No generar mapas completos con obstáculos en posiciones inventadas y después
intentar adivinar su colisión. El suelo es continuo y vacío; bloques, arbustos y
decoración se colocan en el editor/manifiesto desde una geometría compartida.
La cinemática reutiliza estas mismas capas. Empezar Candy; Cooking y Slime siguen
cuando la geometría ya sea jugable y puedan cambiar solo la apariencia.

| ID | Archivo | Base / tamaño | Brief individual |
|---|---|---|---|
| M01 | `assets/map/candy-floor.png` | F / ≥1920×1080 | Seamless-looking orange and cream checkerboard candy-arena floor seen from directly above. Uniform readable play surface edge to edge, no walls, food, obstacles, border, shadows or central decoration. |
| M02 | `assets/map/candy-wall.png` | S / 512×512 | One square block of glossy pink bubblegum, slight overhead view, flat readable sides. Standalone perimeter-wall tile, no surrounding floor. |
| M03 | `assets/map/candy-obstacle.png` | S / 512×512 | One square chocolate-and-wafer crate block, matching the candy reference map. Clean collision-readable footprint. |
| M04 | `assets/map/candy-bush.png` | S / 512×512 | One compact fluffy pink candy shrub, leafy jelly-like top, clean rounded footprint, suitable to hide a small slime. |
| M05 | `assets/map/candy-center.png` | S / 768×768 | One large pink-glazed donut with colorful sprinkles seen slightly from above, isolated arena centerpiece. |
| M06 | `assets/map/cooking-floor.png` | F / ≥1920×1080 | Same empty arena composition as approved candy floor, now clean warm cream kitchen tiles with very subtle variation. No tables, walls or objects. |
| M07 | `assets/map/cooking-wall.png` | S / 512×512 | One square perimeter block made of warm wood with a rounded steel top rim, same footprint as the approved candy-wall tile. |
| M08 | `assets/map/cooking-obstacle.png` | S / 512×512 | One square kitchen counter block with a plain cream top and wood front, same footprint as candy-obstacle. No loose food or cookware projecting outside. |
| M09 | `assets/map/cooking-bush.png` | S / 512×512 | One compact rounded bunch of leafy green kitchen herbs, same footprint and occluding function as candy-bush. |
| M10 | `assets/map/cooking-center.png` | S / 768×768 | One rounded covered cooking pot with glossy metal lid and warm wooden base, same visual footprint as the donut centerpiece. |
| M11 | `assets/map/slime-floor.png` | F / ≥1920×1080 | Same empty top-down arena composition, now soft mint-green stone and subtle damp jelly patches. No damaging-looking pools, rocks or objects. |
| M12 | `assets/map/slime-wall.png` | S / 512×512 | One rounded square mossy stone block with subtle mint slime sheen, same footprint as candy-wall. |
| M13 | `assets/map/slime-obstacle.png` | S / 512×512 | One rounded square rock block with a small mint crystal fully inside its footprint, same dimensions as candy-obstacle. |
| M14 | `assets/map/slime-bush.png` | S / 512×512 | One dense rounded teal shrub with tiny mushrooms contained inside its silhouette, same footprint as candy-bush. |
| M15 | `assets/map/slime-center.png` | S / 768×768 | One large friendly glowing mint crystal on a rounded stone base, same visual footprint as the other arena centerpieces. |

El centro será decorativo o sólido según la geometría común, de igual modo en
los tres temas. El arte no introduce cobertura o daño adicional. Los suelos pueden
repetir una textura aprobada; no hace falta fabricar una imagen por tamaño de arena.

## P3 — Presentación, HUD y estadísticas

No producir números 3/2/1, frases, timers ni una imagen por fotograma. Dibujar texto
y animaciones por código y reutilizar el logo aprobado para GLOMP!. Las reglas
aparecen sobre el mapa real, no sobre una imagen de otro nivel.

| ID | Archivo | Tamaño | Brief individual con base U |
|---|---|---|---|
| R01 | `assets/ui/panel-instructions.png` | 1400×480 | Wide cream presentation panel with a thick chocolate border and one blue corner accent; open blank center for mode title, one rule and one control line. |
| R02 | `assets/ui/panel-hud.png` | 640×176 | Compact semitransparent-looking cream HUD card, chocolate outline, blank round portrait socket, blank central area and small empty progress-bar recess. Keep actual background transparent. |
| R03 | `assets/ui/panel-results.png` | 1600×850 | Large cream results panel with blue corner trim, empty broad table region and blank curved top ribbon; no rows, words or numbers. |
| R04 | `assets/ui/slice.png` | 192×192 | One glossy slice of layered strawberry cake, tiny cream topping, clean simple silhouette. |
| R05 | `assets/ui/medal-gold.png` | 192×192 | One round gold jelly-style medal on a short cream ribbon, blank center. |
| R06 | `assets/ui/medal-silver.png` | 192×192 | Same approved medal shape in silver, blank center, identical canvas and anchor. |
| R07 | `assets/ui/medal-bronze.png` | 192×192 | Same approved medal shape in bronze, blank center, identical canvas and anchor. |
| R08 | `assets/ui/podium.png` | 1400×560 | Three-step podium made of cream and chocolate cake blocks, empty tops, no rank digits or characters. |
| R09 | `assets/ui/roulette-rim.png` | 1024×1024 | One circular glossy golden roulette rim with a fully transparent open center, no fixed sectors, icons or writing. |
| R10 | `assets/ui/roulette-pointer.png` | 192×256 | One chunky golden pointer arrow pointing downward, clean isolated silhouette. |
| R11 | `assets/ui/mode-eatem.png` | 320×320 | One round badge with a happy slime mouth and a small food bite, simple readable emblem. |
| R12 | `assets/ui/mode-pom.png` | 320×320 | Same badge frame with a glossy pink gum bomb and a small cream sparkle. |
| R13 | `assets/ui/mode-crazy.png` | 320×320 | Same badge frame with a single golden apple and a soft halo, no writing. |
| R14 | `assets/ui/mode-buffet.png` | 320×320 | Same badge frame with a cream plate and a small gold crown. |
| R15 | `assets/ui/mode-war.png` | 320×320 | Same badge frame with a glossy red tomato and a short curved motion swoosh. |

Dibujar sectores de ruleta según modos compatibles; un dibujo fijo de cinco
sectores no debe obligar a mostrar modos no implementados. Activar R12–R15
con sus modos, no solo por existir el PNG. Confeti simple puede dibujarse por código.

## P4 — Comida y efectos por modo

El bocadito aprobado se reutiliza. Los ocho tipos base más seis adicionales
permiten las catorce variedades de Crazy: no son 8 + 14 sprites distintos.

| ID | Archivo | Tamaño | Brief individual con base S |
|---|---|---|---|
| A01 | `assets/food/plate.png` | 384×384 | One small cream plate with three golden food bites arranged compactly, simple overhead game icon. |
| A02 | `assets/food/feast.png` | 512×512 | One impressive round golden feast pastry with a cream top and strawberry garnish, clearly more valuable and larger than a basic bite. |
| A03 | `assets/food/tomato.png` | 384×384 | One plump glossy red tomato with a compact green leaf crown, no face. |
| A04 | `assets/food/gum.png` | 384×384 | One rounded pink gum sweet with a pale central shine, compact throwable-food silhouette. |
| A05 | `assets/food/melon.png` | 384×384 | One small watermelon wedge, red flesh, few dark seeds and thick green rind, readable silhouette. |
| A06 | `assets/food/lettuce.png` | 384×384 | One compact fresh lettuce head in bright lime-green layers, no detached leaves. |
| A07 | `assets/food/banana.png` | 384×384 | One short curved golden banana with a little peel folded back, no extra fruit. |
| A08 | `assets/food/apple.png` | 384×384 | One shiny red apple with one compact green leaf, simple silhouette distinct from tomato. |
| A09 | `assets/food/carrot.png` | 384×384 | One short orange carrot with a compact green leafy top, no face. |
| A10 | `assets/food/cheese.png` | 384×384 | One triangular yellow cheese wedge with three round holes, distinct from the approved bread bite. |
| A11 | `assets/food/strawberry.png` | 384×384 | One plump red strawberry with tiny cream seeds and a short green crown. |
| A12 | `assets/food/donut.png` | 384×384 | One small pink-frosted ring donut with sprinkles, matching the arena centerpiece style. |
| A13 | `assets/food/cookie.png` | 384×384 | One round golden chocolate-chip cookie, few large chips and a crisp readable outline. |
| E01 | `assets/effects/sauce-patch.png` | 512×512 | One irregular glossy red tomato-sauce patch seen from above, no splashes outside its clear silhouette. |
| E02 | `assets/bombs/small.png` | 384×384 | One small blue inflated gum bomb, rounded shape and cream highlight, no fuse text or warning marks. |
| E03 | `assets/bombs/wide.png` | 512×384 | One wide pink inflated gum bomb, same material and lighting as the approved blue bomb. |
| E04 | `assets/bombs/tall.png` | 384×512 | One tall purple inflated gum bomb, same material and lighting as the approved blue bomb. |
| E05 | `assets/bombs/mystery.png` | 384×384 | One neutral lavender gum bomb with subtle candy-colored swirls, no question mark or lettering. |
| E06 | `assets/effects/gum-puddle.png` | 512×512 | One flat glossy pale-pink gum puddle, slight overhead view, transparent outside, visually sticky but not an explosion. |
| E07 | `assets/objects/ammo-crate.png` | 512×512 | One square wooden food-supply crate with rounded metal corners, empty top opening, simple footprint. |

Avisos, áreas de peligro, halo dorado, barras de cobertura, ✓, flechas y explosiones
simples se dibujan con geometría de la simulación; su tamaño debe coincidir con la
colisión. No pedir círculos de aviso con perspectiva que falseen el área real.
Proyectiles reutilizan comida, y gotas/migajas reutilizan formas o partículas.

## P5 — Completar las 31 piezas cosméticas

Mantener el cuerpo base aprobado como autoridad de silueta. Los ocho colores ya
están definidos en config y se pueden previsualizar con ese cuerpo tintado. Para
cumplir la entrega de piezas PNG de AGENTS.md §11, producir ocho variantes con el
mismo canvas/anclaje; no aceptar cambios de forma, tamaño, hitbox o animación.
Antes del lote, fijar esos anclajes en el manifiesto y aprobar un montaje completo.

| ID | Archivo | Tamaño | Brief individual con base S y cuerpo aprobado |
|---|---|---|---|
| C01 | `assets/body/lime.png` | mismo canvas base | Exact reference body, change only body tint to lime #7ED321. No face, shadow or accessories; identical silhouette and padding. |
| C02 | `assets/body/bubblegum.png` | mismo canvas base | Exact reference body, change only body tint to pink #FF4FA3; all geometry and padding unchanged. |
| C03 | `assets/body/custard.png` | mismo canvas base | Exact reference body, change only body tint to yellow #FFC933; all geometry and padding unchanged. |
| C04 | `assets/body/sky.png` | mismo canvas base | Exact reference body, change only body tint to blue #2FA8FF; all geometry and padding unchanged. |
| C05 | `assets/body/grape.png` | mismo canvas base | Exact reference body, change only body tint to purple #8E4DFF; all geometry and padding unchanged. |
| C06 | `assets/body/carrot.png` | mismo canvas base | Exact reference body, change only body tint to orange #FF8A2B; all geometry and padding unchanged. |
| C07 | `assets/body/mint.png` | mismo canvas base | Exact reference body, change only body tint to mint #40DBBA; all geometry and padding unchanged. |
| C08 | `assets/body/white.png` | mismo canvas base | Reuse the approved white base without generating a new image; export the catalogue piece with unchanged pixels and anchor. |
| C09 | `assets/face/wink.png` | 1024×1024 | Face layer only: one open chocolate eye, one winking curved eye, small happy mouth; preserve the approved face positions. |
| C10 | `assets/face/surprised.png` | 1024×1024 | Face layer only: two chocolate eyes and small round surprised mouth, preserve the approved face positions. |
| C11 | `assets/face/sleepy.png` | 1024×1024 | Face layer only: two gently closed curved eyes and a small sleepy mouth, same positions and canvas. |
| C12 | `assets/face/angry.png` | 1024×1024 | Face layer only: two determined eyes with gently angled brows and a tiny frown, same positions and canvas. |
| C13 | `assets/face/joyful.png` | 1024×1024 | Face layer only: two closed smiling eyes and a wide happy mouth, same positions and canvas. |
| C14 | `assets/accessory/chef.png` | 1024×1024 | Layer only: one puffy white chef hat at the reference forehead anchor; no face or body. |
| C15 | `assets/accessory/gentleman.png` | 1024×1024 | Layer only: one small chocolate top hat, round monocle and curled moustache aligned to the reference forehead and face anchors; no face or body underneath. |
| C16 | `assets/accessory/star-glasses.png` | 1024×1024 | Layer only: one pair of purple star-shaped glasses with a thin golden frame at the reference eye anchor. |
| C17 | `assets/accessory/ninja.png` | 1024×1024 | Layer only: one red ninja headband with a dark small plate and short trailing ends, fitted to the reference forehead. |
| C18 | `assets/accessory/wizard.png` | 1024×1024 | Layer only: one floppy purple wizard hat with small yellow stars, at the reference forehead anchor. |
| C19 | `assets/accessory/pirate.png` | 1024×1024 | Layer only: one rounded chocolate pirate hat with a cream jelly-drop emblem and red band, at the forehead anchor. |
| C20 | `assets/accessory/cowboy.png` | 1024×1024 | Layer only: one warm brown cowboy hat with a small gold star, at the reference forehead anchor. |
| C21 | `assets/accessory/helmet.png` | 1024×1024 | Layer only: one rounded silver knight helmet with a short red plume and open face area, fitted to the reference body. |
| C22 | `assets/accessory/crown.png` | 1024×1024 | Layer only: one rounded golden crown with small candy gems, at the reference forehead anchor. |
| C23 | `assets/accessory/headphones.png` | 1024×1024 | Layer only: one pair of rounded blue-and-purple gaming headphones, aligned to the sides and top of the reference body. |
| C24 | `assets/particles/star.png` | 192×192 | One tiny glossy four-point cream-and-yellow sparkle, clean particle silhouette. |
| C25 | `assets/particles/bubble.png` | 192×192 | One small translucent pale-blue jelly bubble with one cream glint. |
| C26 | `assets/particles/crumb.png` | 192×192 | One tiny golden pastry crumb with a simple rounded triangular outline. |
| C27 | `assets/particles/heart.png` | 192×192 | One small glossy bubblegum-pink heart, clear simple particle silhouette. |
| C28 | `assets/trail/jelly.png` | 512×192 | One short soft mint jelly ribbon segment seen from above, fading alpha at both ends, no ground shadow. |
| C29 | `assets/trail/candy.png` | 512×192 | One short curved pink-and-cream candy ribbon segment, fading alpha at ends, no ground shadow. |
| C30 | `assets/trail/sparkle.png` | 512×192 | One short trail segment made of three tiny cream sparkles, alpha fading along the segment, no shadow. |

Cuenta del catálogo: 8 cuerpos + cara happy existente y 5 caras nuevas + 10
accesorios + 4 partículas + 3 rastros = **31**. C08 es copia de catálogo, no una
petición nueva. El aspecto del bot se obtiene del cuerpo común con tinte gris.
Los squash/gulp se animan por código; no regenerar un cuerpo por fotograma.
La corona de líder debe distinguirse de la corona cosmética con un marcador de
estado independiente. No comprar ni ocultar identidad, señales de peligro o ventajas.

## Integración posterior a cada entrega

1. Inspeccionar PNG, alfa, dimensiones, anclaje y escala en un montaje real.
2. Registrar el archivo en `assets/manifest.json` con estado pendiente de revisión
   hasta su aprobación; no registrar un recurso ausente como listo.
3. Declarar recursos necesarios en `tools/project.manifest.json` y actualizar el
   índice de arte durante esa tarea de implementación.
4. Ejecutar scaffold, build, check y una prueba renderizada a 1920×1080; comprobar
   que los temas comparten geometría y los cosméticos no cambian mecánicas.
5. Retirar de esta cola la fila aceptada; conservar su prompt y procedencia en el
   manifiesto. No borrar el contrato de una categoría mientras siga utilizándose.

Orden de trabajo: F01 → U01–U09 → U10–U21 → M01–M05 → R01/R02/R03/R04/R11 →
comida de la primera ronda → completar ciclo jugable → POM/Crazy y sus assets →
tienda completa → variantes de fondo opcionales → Buffet/Guerra si quedan en alcance.
