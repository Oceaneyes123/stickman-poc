const core = globalThis.FrameStudy;
export const canvasBlob = (canvas, type = "image/png") =>
  new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(
              new Error("Image encoding failed. Choose a smaller cell width."),
            ),
      type,
      0.95,
    ),
  );

export async function renderSheet(frames, { grid, cellWidth, title, load }) {
  if (![640, 960, 1280].includes(cellWidth))
    throw new Error("Invalid contact sheet resolution.");
  core.batches(frames, grid);
  if (!frames.length || frames.length > grid * grid)
    throw new Error("Invalid contact sheet frame count.");
  const gap = 12;
  const imageHeight = Math.round((cellWidth * 9) / 16);
  const labelHeight = 44;
  const headerHeight = 84;
  const canvas = document.createElement("canvas");
  canvas.width = grid * cellWidth + (grid + 1) * gap;
  canvas.height = headerHeight + grid * (imageHeight + labelHeight + gap) + gap;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Canvas is unavailable.");
  context.fillStyle = "#14243A";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#F8FAFC";
  context.font = "bold 28px system-ui";
  context.fillText(title, gap, 38, canvas.width - gap * 2);
  context.font = "20px system-ui";
  context.fillStyle = "#F3BE58";
  context.fillText(
    `${frames.length} frames | timestamps in HH:MM:SS.mmm | order as selected`,
    gap,
    66,
  );
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    const bitmap = await createImageBitmap(await load(frame.path));
    try {
      const x = gap + (i % grid) * (cellWidth + gap);
      const y =
        headerHeight + Math.floor(i / grid) * (imageHeight + labelHeight + gap);
      context.fillStyle = "#000000";
      context.fillRect(x, y, cellWidth, imageHeight);
      const scale = Math.min(
        cellWidth / bitmap.width,
        imageHeight / bitmap.height,
      );
      const width = bitmap.width * scale;
      const height = bitmap.height * scale;
      context.drawImage(
        bitmap,
        x + (cellWidth - width) / 2,
        y + (imageHeight - height) / 2,
        width,
        height,
      );
      context.fillStyle = "#F8FAFC";
      context.fillRect(x, y + imageHeight, cellWidth, labelHeight);
      context.fillStyle = "#14243A";
      context.font = "22px system-ui";
      context.fillText(
        `#${core.pad(frame.number)}   ${core.timestamp(frame.timestamp)}`,
        x + 12,
        y + imageHeight + 29,
      );
    } finally {
      bitmap.close();
    }
  }
  return canvas;
}
