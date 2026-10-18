'use strict';
// El acceso a Google ocurre solo aquí, nunca dentro del juego exportado.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const png = require('./png.js');
const { removeBackground } = require('./chroma.js');
const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'assets/manifest.json');

function localFile(relative) {
  const file = path.resolve(root, relative);
  if (!file.startsWith(root + path.sep)) throw new Error('Ruta fuera del proyecto');
  return file;
}

function getKey() {
  if (!process.env.GOOGLE_AI_STUDIO) {
    try { process.loadEnvFile(path.join(root, '.env')); } catch { /* Se informa sin mostrar secretos. */ }
  }
  if (!process.env.GOOGLE_AI_STUDIO) throw new Error('Falta GOOGLE_AI_STUDIO en .env o en el entorno');
  return process.env.GOOGLE_AI_STUDIO;
}

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, { ...options, headers: { 'x-goog-api-key': getKey(), 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(180000) });
  } catch { throw new Error('No se pudo conectar con Google AI Studio; no se reintenta automáticamente'); }
  if (!response.ok) {
    let details = '';
    try {
      const data = await response.json();
      const quota = (data.error?.details || []).flatMap(item => item.violations || []).map(item => ({ metric: item.quotaMetric, id: item.quotaId, value: item.quotaValue }));
      details = quota.length ? `; cuota: ${JSON.stringify(quota)}` : '';
    } catch { /* Nunca se muestra el cuerpo remoto ni la clave. */ }
    const error = new Error(`Google AI Studio respondió HTTP ${response.status}${details}; no se reintenta automáticamente`);
    error.httpStatus = response.status;
    throw error;
  }
  return response.json();
}

async function main() {
  const args = process.argv.slice(2);
  const supported = new Set(['--dry-run', '--list-models', '--id', '--milestone']);
  for (let i = 0; i < args.length; i++) {
    if (!supported.has(args[i])) throw new Error(`Opción desconocida: ${args[i]}`);
    if (args[i] === '--id' || args[i] === '--milestone') {
      if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Falta valor para ${args[i]}`);
      i++;
    }
  }
  if (args.includes('--list-models')) {
    const data = await request('https://generativelanguage.googleapis.com/v1beta/models');
    for (const model of data.models || []) if (/gemini.*image/.test(model.name)) console.log(model.name);
    return;
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const value = flag => args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined;
  const id = value('--id'), milestone = value('--milestone');
  if (!id && !milestone) throw new Error('Selecciona --id <asset> o --milestone <hito>; usa --dry-run para revisar');
  const selected = manifest.assets.filter(asset => (!id || asset.id === id) && (!milestone || String(asset.milestone) === milestone));
  if (!selected.length) throw new Error('No hay assets con ese filtro');
  for (const asset of selected) {
    const output = localFile(asset.file);
    if (fs.existsSync(output)) {
      const bytes = fs.readFileSync(output), image = png.decode(bytes);
      const hash = crypto.createHash('sha256').update(bytes).digest('hex');
      if (asset.sha256 && asset.sha256 !== hash) throw new Error(`Archivo modificado: ${asset.id}; revisar el manifiesto`);
      if (image.width !== asset.width || image.height !== asset.height) throw new Error(`Dimensiones distintas: ${asset.id}`);
      console.log(`Conservado: ${asset.id}`); continue;
    }
    if (asset.provider !== 'google') throw new Error(`${asset.id} se genera con ChatGPT, no con este script`);
    if (!asset.model || !/^[a-z0-9.-]+$/.test(asset.model)) throw new Error('Modelo inválido');
    if (!asset.references.includes('samples/banner.png') || !asset.references.includes('samples/skins.png')) throw new Error('Faltan referencias de estilo obligatorias');
    const references = asset.references.map(file => ({ file, bytes: fs.readFileSync(localFile(file)) }));
    console.log(`${args.includes('--dry-run') ? 'Planificado' : 'Generando'}: ${asset.id} (${asset.model})`);
    if (args.includes('--dry-run')) continue;
    const rawPath = localFile(asset.rawFile);
    let bytes;
    if (fs.existsSync(rawPath)) {
      bytes = fs.readFileSync(rawPath);
      console.log(`Reutilizando original: ${asset.rawFile}`);
    } else {
      let data;
      try {
        data = await request(`https://generativelanguage.googleapis.com/v1beta/models/${asset.model}:generateContent`, {
          method: 'POST', body: JSON.stringify({ contents: [{ parts: [{ text: asset.prompt }, ...references.map(reference => ({ inline_data: { mime_type: 'image/png', data: reference.bytes.toString('base64') } }))] }], generationConfig: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '1:1', ...(asset.model.startsWith('gemini-2.5') ? {} : { imageSize: '1K' }) } } }),
        });
      } catch (error) {
        asset.status = error.httpStatus === 429 ? 'blocked_quota' : 'blocked_provider';
        asset.lastError = error.message;
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
        throw error;
      }
      const parts = data.candidates?.[0]?.content?.parts || [];
      const generated = parts.find(part => part.inlineData?.mimeType === 'image/png' && !part.thought)?.inlineData;
      if (!generated) throw new Error(`Google no devolvió PNG para ${asset.id}; revisar cuota o respuesta del modelo`);
      bytes = Buffer.from(generated.data, 'base64');
      fs.mkdirSync(path.dirname(rawPath), { recursive: true });
      fs.writeFileSync(rawPath, bytes);
    }
    fs.mkdirSync(path.dirname(output), { recursive: true });
    const image = asset.chroma ? removeBackground(png.decode(bytes)) : png.decode(bytes);
    const finalBytes = png.encode(image);
    fs.writeFileSync(output, finalBytes);
    Object.assign(asset, { width: image.width, height: image.height, sha256: crypto.createHash('sha256').update(finalBytes).digest('hex'), status: 'pending_visual_review', generatedAt: new Date().toISOString() });
    delete asset.lastError;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`Guardado: ${asset.file}; pendiente de revisión visual`);
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
