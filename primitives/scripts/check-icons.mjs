import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const iconDirectory = `${root}/icons`;
const iconFiles = (await readdir(iconDirectory)).filter((file) => file.endsWith(".svg"));
const errors = [];

if (!iconFiles.length) {
  errors.push("icons directory contains no SVG files");
}

for (const file of iconFiles) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.svg$/.test(file)) {
    errors.push(`${file} must use a kebab-case name`);
  }

  const svg = await readFile(`${iconDirectory}/${file}`, "utf8");
  if (!/<svg\b[^>]*\bwidth="24"[^>]*\bheight="24"[^>]*\bviewBox="0 0 24 24"/.test(svg)) {
    errors.push(`${file} must be a 24 × 24 SVG with viewBox "0 0 24 24"`);
  }
}

if (errors.length) {
  console.error("Icon check failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`${iconFiles.length} icons are valid 24 × 24 SVGs.`);
}
