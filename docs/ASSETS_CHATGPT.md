# GLOMP! — Arte cartoon vigente

Proveedor autorizado: ChatGPT imagegen. Google/Nano Banana sigue suspendido por
cuota. No leer, imprimir ni trasladar claves de .env.

## Contrato visual del 20 de octubre

- Una base blanca redondeada en assets/cartoon/slime/body.png; una sola silueta
  en todos los tamaños. Color aplicado solo al cuerpo, con reflejos blancos.
- Cara cartoon vectorial separada y animada: ojos simples, mejillas y boca sin
  dientes. No se cargan los ojos de cristal ni las bocas raster anteriores.
- Lobby luminoso, cápsulas, iconos propios, podios y títulos con Lilita One local.
  Logo aprobado conservado. El fondo nuevo es una versión de la plaza original.
- Tres mapas panorámicos por piezas: suelo/perímetro 16:9 más bloque, vegetación
  y objeto central transparentes. Geometría y colisiones en config. Lava conserva
  su imagen horizontal. No estirar los conceptos cuadrados de samples/maps.
- Accesorios simples existentes: corona, gorro, halo, lazo y similares. **Skins y
  trajes completos aplazados por el usuario.** Los sets solo combinan piezas.

## Procedencia y reproducción

assets/cartoon/prompts.json contiene las 18 solicitudes exactas de esta revisión:
base, cinco piezas UI, tres fondos y nueve props. Las dimensiones entregadas se
registran tal cual, sin fingir que el proveedor generó un lienzo Full HD. Los
fondos son 1672×941; la proporción difiere de 16:9 menos de 0.1 %. La base es
1536×1024 con un recorte alfa de 1164×704. No hay tres cuerpos distintos.

assets/manifest.json conserva prompt, referencias, proveedor, estado, dimensiones,
límites alfa y SHA-256. Generado/integrado no significa aprobado por el usuario.
tools/register-cartoon.js selecciona el nuevo arte y mantiene comida y accesorios
sencillos de la revisión anterior. No edita píxeles. src/art.js es el índice activo;
scaffold retira únicamente los recursos anteriores que pertenecen al manifiesto
y ya no se utilizan, conservando archivos históricos y recursos ajenos.

Pipeline: node tools/register-cartoon.js → node tools/scaffold.js →
node tools/build.js → node tools/check.js. La generación se hace con imagegen,
una pieza por solicitud; no volver a generar el lote para reconstruir el índice.
Los prompts anteriores siguen en assets/illustrated como historial.

Fuente local assets/fonts/LilitaOne-Regular.ttf, licencia OFL.txt y procedencia
SOURCE.md. Títulos y botones conservan texto real, no letras horneadas en imágenes.
Audio pendiente; no se genera con herramientas de imagen.
