# GLOMP! — Assets de la rework y producción restante

Proveedor utilizado: herramienta integrada de ChatGPT imagegen. Google/Nano
Banana sigue suspendido por cuota. No exponer ni trasladar claves de .env.

## Entrega integrada

35 PNG nuevos en assets/pixel, registrados con dimensiones y límites de alfa en
assets/manifest.json y src/art.js. No se usan las imágenes de samples como mapas
horneados: cada arena se monta con piezas independientes.

| Carpeta | PNG | Uso |
|---|---:|---|
| slime | 3 | small, medium, large; cuerpo blanco tintable con rostro legible |
| candy | 5 | floor, wall, obstacle, bush, center |
| cooking | 5 | floor, wall, obstacle, bush, center |
| slimegarden | 5 | floor, wall, obstacle, bush, center |
| food | 17 | bocadito, 13 ingredientes, banana, chicle y sandía |

Los prompts exactos por archivo están en:

- assets/pixel/prompts.json
- assets/pixel/food/prompts.json
- assets/pixel/food/projectile-prompts.json

Todas las piezas de personajes/objetos tienen transparencia; los suelos son
opacos y repetibles. Nearest en recursos y texturas. Los umbrales de detalle del
slime viven en config.art.tierThresholds. Los PNG fuente son grandes; las cuadrículas
lógicas solicitadas en los prompts describen detalle visual, no dimensiones reales.
Se conservan el banner/título aprobados y menu-village como fondo de la sala.

## Trabajo visual restante

1. Validar con el usuario el resultado dentro del juego, con movimiento y escala.
   Si una pieza falla, corregir esa pieza conservando perspectiva, paleta y pivote.
2. Crear caras, accesorios, partículas y rastros para completar las 31 piezas
   cosméticas. Cada pieza debe ser un PNG separado compatible con los tres cuerpos;
   si requiere deformación, validar sus puntos de anclaje en los tres tamaños.
3. Los fondos de otras plazas y variaciones de clima son opcionales posteriores a
   la demo. No regenerar los tres mapas ni el menú como requisito pendiente.

Prompt base para próximas piezas: «Sprite independiente de GLOMP!, pixel art
16-bit con píxeles cuadrados visibles, contorno escalonado morado oscuro, sombras
agrupadas, luz superior izquierda, vista cenital ligeramente frontal. Una sola
pieza centrada, sin texto ni marca, transparencia real, sin antialiasing. Mantener
escala y anclaje del cuerpo de referencia». Añadir tema, pieza y tamaño lógico.
No generar audio con herramientas de imagen.
