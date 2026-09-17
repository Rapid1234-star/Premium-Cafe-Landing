import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const INPUT_DIR = '../ezgif-30287a048f58d8af-jpg (1)';
const OUTPUT_DIR = 'public/frames';

async function optimizeFrames() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(INPUT_DIR)
    .filter(f => f.toLowerCase().endsWith('.jpg'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

  console.log(`Found ${files.length} JPG frames`);

  const selectedFrames = [];
  for (let i = 0; i < files.length; i += 2) {
    selectedFrames.push(files[i]);
  }

  console.log(`Processing ${selectedFrames.length} frames (every 2nd frame)...`);

  let totalInputSize = 0;
  let totalOutputSize = 0;

  for (let i = 0; i < selectedFrames.length; i++) {
    const inputFile = selectedFrames[i];
    const outputFile = `frame-${String(i + 1).padStart(3, '0')}.webp`;
    const inputPath = path.join(INPUT_DIR, inputFile);
    const outputPath = path.join(OUTPUT_DIR, outputFile);

    const inputStats = fs.statSync(inputPath);
    totalInputSize += inputStats.size;

    await sharp(inputPath)
      .webp({ quality: 70 })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    totalOutputSize += outputStats.size;

    if ((i + 1) % 20 === 0 || i === selectedFrames.length - 1) {
      console.log(`  ${i + 1}/${selectedFrames.length} - ${outputFile} (${(outputStats.size / 1024).toFixed(1)} KB)`);
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Frames processed: ${selectedFrames.length}`);
  console.log(`Input total: ${(totalInputSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Output total: ${(totalOutputSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Reduction: ${((1 - totalOutputSize / totalInputSize) * 100).toFixed(1)}%`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
}

optimizeFrames().catch(console.error);