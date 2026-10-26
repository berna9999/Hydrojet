/**
 * Genera favicon, icone, logo PNG e immagine Open Graph a partire dal
 * simbolo vettoriale e dalle foto originali. Da rilanciare solo se cambiano
 * logo o foto:  node scripts/generate-brand-assets.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const path = (p) => fileURLToPath(new URL(p, root));

const NAVY = '#051726';
const BLUE = '#0a4f80';

const markSvg = await readFile(path('src/assets/brand/hydrojet-mark.svg'), 'utf8');
const markPath = markSvg.match(/<path[^>]*\/>/)[0].replace('currentColor', '#ffffff');
const [, , vbW, vbH] = markSvg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);

/** Simbolo bianco centrato su quadrato blu arrotondato. */
const iconSvg = (size, radius, padding) => {
  const inner = size - padding * 2;
  const scale = inner / vbW;
  const y = (size - vbH * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${BLUE}"/><stop offset="1" stop-color="${NAVY}"/></linearGradient></defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#g)"/>
  <g transform="translate(${padding} ${y}) scale(${scale})">${markPath}</g>
</svg>`;
};

const favicon = iconSvg(64, 14, 9);
await writeFile(path('public/favicon.svg'), favicon);
await sharp(Buffer.from(favicon)).resize(32, 32).png().toFile(path('public/favicon-32.png'));
await sharp(Buffer.from(iconSvg(180, 0, 28))).png().toFile(path('public/apple-touch-icon.png'));
await sharp(Buffer.from(iconSvg(512, 0, 80))).png().toFile(path('public/icon-512.png'));
await sharp(Buffer.from(iconSvg(512, 96, 80))).png().toFile(path('public/logo-hydrojet.png'));

/* Immagine Open Graph 1200×630 con le foto reali prima/dopo */
const W = 1200;
const H = 630;
const photoW = 250;
const photoH = 400;
const photoY = (H - photoH) / 2 - 10;
const photo1X = 640;
const photo2X = photo1X + photoW + 16;

const photo = async (file) =>
  sharp(await readFile(path(file)))
    .resize(photoW, photoH, { fit: 'cover' })
    .composite([
      {
        input: Buffer.from(
          `<svg width="${photoW}" height="${photoH}"><rect width="${photoW}" height="${photoH}" rx="18" fill="#fff"/></svg>`,
        ),
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer();

const label = (text, x, light) => {
  const w = text.length * 13 + 36;
  return `<g transform="translate(${x + 16} ${photoY + 16})"><rect width="${w}" height="34" rx="17" fill="${light ? '#fff' : 'rgba(5,23,38,0.85)'}"/>
  <text x="${w / 2}" y="23" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="15" letter-spacing="1.5" fill="${light ? NAVY : '#fff'}">${text}</text></g>`;
};

const markScale = 96 / vbW;
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="r" cx="0.85" cy="0.1" r="0.8"><stop offset="0" stop-color="#0e62a0" stop-opacity="0.6"/><stop offset="1" stop-color="#0e62a0" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${NAVY}"/>
  <rect width="${W}" height="${H}" fill="url(#r)"/>
  <g transform="translate(72 96) scale(${markScale})">${markPath}</g>
  <text x="72" y="300" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="84" letter-spacing="-3" fill="#fff">HydroJet</text>
  <text x="72" y="362" font-family="Segoe UI, Arial, sans-serif" font-weight="600" font-size="34" fill="#8ec3e4">Pulizia con idropulitrice</text>
  <text x="72" y="410" font-family="Segoe UI, Arial, sans-serif" font-weight="600" font-size="34" fill="#ffffff" fill-opacity="0.85">Pesaro e Cattolica</text>
  <rect x="72" y="470" width="56" height="4" rx="2" fill="#8ec3e4"/>
  <text x="72" y="520" font-family="Segoe UI, Arial, sans-serif" font-weight="600" font-size="22" fill="#ffffff" fill-opacity="0.7">Foto reali di un nostro lavoro, prima e dopo</text>
</svg>`;

const labels = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${label('PRIMA', photo1X, false)}${label('DOPO', photo2X, true)}</svg>`;

await sharp(Buffer.from(ogSvg))
  .composite([
    { input: await photo('src/assets/lavori/muro-cemento-prima.jpg'), left: photo1X, top: photoY },
    { input: await photo('src/assets/lavori/muro-cemento-dopo.jpg'), left: photo2X, top: photoY },
    { input: Buffer.from(labels), left: 0, top: 0 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path('public/og-image.jpg'));

await writeFile(
  path('public/site.webmanifest'),
  JSON.stringify(
    {
      name: 'HydroJet',
      short_name: 'HydroJet',
      icons: [
        { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: NAVY,
      background_color: NAVY,
      display: 'browser',
    },
    null,
    2,
  ) + '\n',
);

console.log('Asset del brand generati in public/');
