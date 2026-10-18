'use strict';
// Lector/escritor PNG de 8 bits para el pipeline de arte, sin dependencias.
const fs = require('node:fs');
const zlib = require('node:zlib');
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const da = Math.abs(p - a), db = Math.abs(p - b), dc = Math.abs(p - c);
  return da <= db && da <= dc ? a : db <= dc ? b : c;
}

function decode(bytes) {
  if (!bytes.subarray(0, 8).equals(signature)) throw new Error('No es un PNG');
  let width, height, channels, color, palette, transparency;
  const compressed = [];
  for (let offset = 8; offset < bytes.length;) {
    const length = bytes.readUInt32BE(offset);
    if (offset + length + 12 > bytes.length) throw new Error('PNG truncado');
    const type = bytes.toString('ascii', offset + 4, offset + 8);
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    if (crc32(bytes.subarray(offset + 4, offset + 8 + length)) !== bytes.readUInt32BE(offset + 8 + length)) {
      throw new Error('CRC de PNG inválido');
    }
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4); color = data[9];
      channels = ({ 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 })[color];
      if (data[8] !== 8 || data[12] !== 0 || !channels) throw new Error('Se requiere PNG de 8 bits sin entrelazado');
      if (!width || !height || width * height > 16777216) throw new Error('Dimensiones PNG fuera de rango');
    }
    if (type === 'PLTE') palette = data;
    if (type === 'tRNS') transparency = data;
    if (type === 'IDAT') compressed.push(data);
    offset += length + 12;
    if (type === 'IEND') break;
  }
  if (!channels || !compressed.length) throw new Error('PNG sin cabecera o píxeles');
  const stride = width * channels;
  const raw = zlib.inflateSync(Buffer.concat(compressed), { maxOutputLength: (stride + 1) * height });
  if (raw.length !== (stride + 1) * height) throw new Error('Longitud PNG incorrecta');
  const pixels = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    if (filter > 4) throw new Error('Filtro PNG desconocido');
    for (let x = 0; x < stride; x++) {
      const i = y * stride + x;
      const a = x >= channels ? pixels[i - channels] : 0;
      const b = y ? pixels[i - stride] : 0;
      const c = y && x >= channels ? pixels[i - stride - channels] : 0;
      const predictor = [0, a, b, Math.floor((a + b) / 2), paeth(a, b, c)][filter];
      pixels[i] = (raw[y * (stride + 1) + x + 1] + predictor) & 255;
    }
  }
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const p = i * channels, o = i * 4;
    if (color === 3) {
      const index = pixels[p];
      if (!palette || index * 3 + 2 >= palette.length) throw new Error('Paleta PNG inválida');
      rgba[o] = palette[index * 3]; rgba[o + 1] = palette[index * 3 + 1]; rgba[o + 2] = palette[index * 3 + 2];
      rgba[o + 3] = transparency?.[index] ?? 255;
    } else {
      const gray = color === 0 || color === 4;
      rgba[o] = pixels[p]; rgba[o + 1] = pixels[p + (gray ? 0 : 1)]; rgba[o + 2] = pixels[p + (gray ? 0 : 2)];
      rgba[o + 3] = color === 6 ? pixels[p + 3] : color === 4 ? pixels[p + 1] : 255;
      if (color === 2 && transparency && pixels[p] === transparency.readUInt16BE(0) && pixels[p + 1] === transparency.readUInt16BE(2) && pixels[p + 2] === transparency.readUInt16BE(4)) rgba[o + 3] = 0;
      if (color === 0 && transparency && pixels[p] === transparency.readUInt16BE(0)) rgba[o + 3] = 0;
    }
  }
  return { width, height, rgba };
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const result = Buffer.alloc(data.length + 12);
  result.writeUInt32BE(data.length); name.copy(result, 4); data.copy(result, 8);
  result.writeUInt32BE(crc32(Buffer.concat([name, data])), data.length + 8);
  return result;
}

function encode({ width, height, rgba }) {
  if (rgba.length !== width * height * 4) throw new Error('Tamaño RGBA incorrecto');
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  return Buffer.concat([signature, chunk('IHDR', header), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

module.exports = { decode, encode, read: file => decode(fs.readFileSync(file)) };
