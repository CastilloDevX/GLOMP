# GLOMP! — Arte ilustrado

Proveedor activo autorizado: ChatGPT `imagegen`. Google/Nano Banana permanece
suspendido por cuota. No leer, imprimir ni trasladar claves de `.env`.

## Contrato vigente

Un único cuerpo blanco aprobado en `assets/slime/base-white-chatgpt-v1.png` para
todos los tamaños, con deformación de malla. Cara por piezas y sin tinte; cuerpo
con color. Curvas suaves y luz superior izquierda, sin pixel art ni sprites de
slime alternativos que cambien la silueta. Accesorios anclados sobre la misma
coronilla, partículas y rastros sin efectos mecánicos.

Los mapas de Dulcería, Cocina y Jardín reutilizan los originales exactos de
`samples/maps`; las copias activas están en `assets/illustrated/maps`. Lava es una
ilustración nueva con plataforma libre. Las dimensiones reales y huellas están
registradas: no presentar los PNG como lienzos 3072×1728 si el proveedor entregó
otras medidas. El canvas Full HD es independiente de la resolución fuente.

## Recursos y procedencia

- `assets/illustrated/prompts.json`: 28 prompts exactos, una imagen por solicitud:
  ojo, cuatro bocas, plataforma, botón, cinta, panel, lava y 18 comidas.
- `assets/illustrated/cosmetic-prompts.json`: 17 prompts, diez sombreros, cuatro
  partículas y tres rastros, todos independientes y con alfa.
- `assets/manifest.json`: archivo, proveedor, prompt, estado, dimensiones, límites
  alfa y SHA-256. Los nuevos PNG están generados/integrados, no declarados aprobados
  por el usuario sin una revisión suya.
- `tools/register-illustrated.js`: calcula metadatos e índice, sin editar píxeles;
  `src/art.js` enumera únicamente el arte activo. Recursos anteriores conservados
  como historial, sin pixel art activo en el juego.
- `assets/fonts/LilitaOne-Regular.ttf` y OFL.txt: fuente local y licencia. Fuente
  oficial: https://github.com/google/fonts/tree/main/ofl/lilitaone .

Títulos y textos se dibujan con fuente real, no se hornean dentro de los botones.
Mantener el logo/título y menu-village aprobados. Para próximas revisiones usar la
imagen actual como referencia, cambiar una pieza por llamada y revisar el
resultado a escala de juego antes de incorporarlo. No generar audio con imagen.
