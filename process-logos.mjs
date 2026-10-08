const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const LOGOS_DIR = 'F:/rvios-next/public/logos';

// Target output size for all logos
const OUTPUT_SIZE = 256;

async function processLogo(file) {
  const inputPath = path.join(LOGOS_DIR, file);
  const outputPath = path.join(LOGOS_DIR, file); // overwrite in-place

  try {
    // Get metadata first
    const meta = await sharp(inputPath).metadata();
    console.log([] x);

    // Step 1: auto-trim whitespace/transparency
    // Step 2: resize with padding to OUTPUT_SIZE x OUTPUT_SIZE
    // Step 3: compress as PNG (quality settings)
    await sharp(inputPath)
      .trim({ background: { r: 255, g: 255, b: 255, alpha: 0 }, threshold: 30 })
      .resize(OUTPUT_SIZE, OUTPUT_SIZE, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png({ compressionLevel: 9, effort: 10 })
      .toFile(outputPath + '.tmp.png');

    fs.renameSync(outputPath + '.tmp.png', outputPath);
    const stat = fs.statSync(outputPath);
    console.log(  -> saved  KB);
  } catch (err) {
    console.error(  ERROR: );
  }
}

async function main() {
  const files = fs.readdirSync(LOGOS_DIR).filter(f => f.endsWith('.png'));
  console.log(Processing  logos...);
  for (const file of files) {
    await processLogo(file);
  }
  console.log('Done!');
}

main();
