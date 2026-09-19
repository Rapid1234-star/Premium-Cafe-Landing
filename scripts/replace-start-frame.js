import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

/**
 * Replaces scroll-story frame-001 with a custom empty-cup start image
 * so the hero bean handoff lands on a clean first frame (no double bean).
 *
 * Usage:
 *   node scripts/replace-start-frame.js
 *   node scripts/replace-start-frame.js path/to/start.png
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DEFAULT_SRC = path.resolve(ROOT, '../start.png');

const TARGETS = [
  { out: path.join(ROOT, 'public/frames/frame-001.webp'), width: 1920, height: 1080, quality: 82 },
  { out: path.join(ROOT, 'public/frames-mid/frame-001.webp'), width: 1280, height: 720, quality: 78 },
  { out: path.join(ROOT, 'public/images/scroll-start.webp'), width: 1920, height: 1080, quality: 82 },
];

async function convert(src, { out, width, height, quality }) {
  await fs.promises.mkdir(path.dirname(out), { recursive: true });

  await sharp(src)
    .resize({
      width,
      height,
      fit: 'cover',
      position: 'centre',
    })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(out);

  const kb = (fs.statSync(out).size / 1024).toFixed(1);
  console.log(`  ${path.relative(ROOT, out)} → ${width}x${height} @ q${quality} (${kb} KB)`);
}

async function main() {
  const src = path.resolve(process.argv[2] || DEFAULT_SRC);

  if (!fs.existsSync(src)) {
    throw new Error(`Start image not found: ${src}`);
  }

  const meta = await sharp(src).metadata();
  console.log(`Source: ${src} (${meta.width}x${meta.height}, ${meta.format})`);

  for (const target of TARGETS) {
    await convert(src, target);
  }

  console.log('Done — frame-001 updated for high + mid tiers.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
