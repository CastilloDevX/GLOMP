'use strict';
// Quita únicamente el magenta conectado con el borde; conserva detalles interiores.
const fs = require('node:fs');
const path = require('node:path');
const png = require('./png.js');

function removeBackground(image) {
  const { width, height } = image;
  const rgba = Buffer.from(image.rgba);
  const count = width * height;
  const marked = new Uint8Array(count);
  const queue = new Uint32Array(count);
  let head = 0, tail = 0;
  function visit(index) {
    if (marked[index]) return;
    const o = index * 4;
    const red = rgba[o], green = rgba[o + 1], blue = rgba[o + 2];
    if (rgba[o + 3] === 0 || (red - green > 18 && blue - green > 18 && Math.abs(red - blue) < 95)) {
      marked[index] = 1; queue[tail++] = index;
    }
  }
  for (let x = 0; x < width; x++) { visit(x); visit((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { visit(y * width); visit(y * width + width - 1); }
  while (head < tail) {
    const index = queue[head++], x = index % width, y = Math.floor(index / width);
    if (x) visit(index - 1);
    if (x < width - 1) visit(index + 1);
    if (y) visit(index - width);
    if (y < height - 1) visit(index + width);
  }
  let opaque = 0, removed = 0;
  for (let i = 0; i < count; i++) {
    const o = i * 4;
    if (marked[i]) {
      // Desmezcla el magenta del antialiasing del contorno.
      const contamination = Math.min(rgba[o] - rgba[o + 1], rgba[o + 2] - rgba[o + 1]);
      const alpha = Math.max(0, Math.min(1, 1 - contamination / 255));
      if (alpha < 0.12 || rgba[o + 3] === 0) {
        rgba.fill(0, o, o + 4); removed++;
      } else {
        rgba[o] = Math.max(0, Math.min(255, (rgba[o] - 255 * (1 - alpha)) / alpha));
        rgba[o + 1] = Math.min(255, rgba[o + 1] / alpha);
        rgba[o + 2] = Math.max(0, Math.min(255, (rgba[o + 2] - 255 * (1 - alpha)) / alpha));
        rgba[o + 3] = Math.round(rgba[o + 3] * alpha);
      }
    }
    if (rgba[o + 3] > 220) opaque++;
  }
  if (opaque < count * 0.01 || removed < count * 0.05) throw new Error('El recorte requiere revisión: fondo magenta no reconocido o sujeto vacío');
  return { width, height, rgba };
}

if (require.main === module) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output || path.resolve(input) === path.resolve(output)) {
    console.error('Uso: node tools/chroma.js entrada.png salida.png (rutas distintas)'); process.exitCode = 1;
  } else {
    try {
      const image = removeBackground(png.read(input));
      fs.mkdirSync(path.dirname(output), { recursive: true });
      fs.writeFileSync(output, png.encode(image));
      console.log(`PNG transparente: ${output} (${image.width}×${image.height})`);
    } catch (error) { console.error(error.message); process.exitCode = 1; }
  }
}
module.exports = { removeBackground };
