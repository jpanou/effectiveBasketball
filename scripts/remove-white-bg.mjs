import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const file = path.resolve(
  process.cwd(),
  "public/assets/basketball-coach-logo-transparent.png"
);

const img = sharp(file).ensureAlpha();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.from(data);

const THRESHOLD = 235;
let changed = 0;

for (let i = 0; i < out.length; i += channels) {
  const r = out[i];
  const g = out[i + 1];
  const b = out[i + 2];
  if (r >= THRESHOLD && g >= THRESHOLD && b >= THRESHOLD) {
    out[i + 3] = 0;
    changed++;
  }
}

await sharp(out, { raw: { width, height, channels } })
  .png({ compressionLevel: 9 })
  .toFile(file + ".tmp");

fs.renameSync(file + ".tmp", file);

console.log(`Converted ${changed} white pixels to transparent in ${file}`);
