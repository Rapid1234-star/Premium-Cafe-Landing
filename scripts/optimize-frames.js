import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const INPUT_DIR = path.resolve(ROOT, '../ezgif-30287a048f58d8af-jpg (1)');
const HIGH_DIR = path.join(ROOT, 'public/frames');
const MID_DIR = path.join(ROOT, 'public/frames-mid');

const HIGH = { maxWidth: 1920, quality: 72, step: 2 };
const MID = { maxWidth: 1280, quality: 68, step: 4 };

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function listJpgFrames(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.jpg'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });
}

async function writeSet({ files, step, maxWidth, quality, outputDir, label }) {
  await ensureDir(outputDir);

  const selected = [];
  for (let i = 0; i < files.length; i += step) {
    selected.push(files[i]);
  }

  console.log(`\n[${label}] ${selected.length} frames → ${outputDir} (max ${maxWidth}px, q${quality})`);

  let totalOutputSize = 0;

  for (let i = 0; i < selected.length; i += 1) {
    const inputFile = selected[i];
    const outputFile = `frame-${String(i + 1).padStart(3, '0')}.webp`;
    const inputPath = path.join(INPUT_DIR, inputFile);
    const outputPath = path.join(outputDir, outputFile);

    await sharp(inputPath)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toFile(outputPath);

    totalOutputSize += fs.statSync(outputPath).size;

    if ((i + 1) % 20 === 0 || i === selected.length - 1) {
      console.log(`  ${i + 1}/${selected.length} - ${outputFile}`);
    }
  }

  console.log(`[${label}] done — ${(totalOutputSize / 1024 / 1024).toFixed(2)} MB total`);
  return selected.length;
}

async function optimizeFrames() {
  if (!fs.existsSync(INPUT_DIR)) {
    throw new Error(`JPG source folder not found: ${INPUT_DIR}`);
  }

  const files = listJpgFrames(INPUT_DIR);
  console.log(`Found ${files.length} JPG frames`);

  const highCount = await writeSet({
    files,
    step: HIGH.step,
    maxWidth: HIGH.maxWidth,
    quality: HIGH.quality,
    outputDir: HIGH_DIR,
    label: 'high',
  });

  const midCount = await writeSet({
    files,
    step: MID.step,
    maxWidth: MID.maxWidth,
    quality: MID.quality,
    outputDir: MID_DIR,
    label: 'mid',
  });

  console.log('\n--- Summary ---');
  console.log(`High: ${highCount} frames @ max ${HIGH.maxWidth}px → public/frames`);
  console.log(`Mid:  ${midCount} frames @ max ${MID.maxWidth}px → public/frames-mid`);
}

optimizeFrames().catch((err) => {
  console.error(err);
  process.exit(1);
});
