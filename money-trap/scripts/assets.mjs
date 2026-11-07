import { mkdir, writeFile } from "node:fs/promises";
await mkdir("public/fonts", { recursive: true });
for (const [file, url] of [
  [
    "Inter.ttf",
    "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz,wght%5D.ttf",
  ],
  [
    "OFL.txt",
    "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt",
  ],
]) {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Asset download failed: ${response.status} ${url}`);
  await writeFile(
    `public/fonts/${file}`,
    Buffer.from(await response.arrayBuffer()),
  );
}
console.log(
  "Inter variable font and SIL Open Font License saved locally. Rendering needs no remote font request.",
);
