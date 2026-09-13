(function () {
  "use strict";

  const DEFAULTS = Object.freeze({ maxDimension: 1440, quality: 0.8, targetMaxBytes: 350 * 1024, targetMinBytes: 250 * 1024 });

  async function decodeImage(file) {
    if (typeof createImageBitmap === "function") {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close?.() };
    }
    const url = URL.createObjectURL(file);
    try {
      const image = await new Promise((resolve, reject) => {
        const element = new Image();
        element.onload = () => resolve(element);
        element.onerror = () => reject(new Error("Não foi possível decodificar a imagem."));
        element.src = url;
      });
      return { source: image, width: image.naturalWidth, height: image.naturalHeight, close: () => {} };
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function dimensionsWithin(width, height, maxDimension) {
    const scale = Math.min(1, maxDimension / Math.max(width, height));
    return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
  }

  function createSurface(width, height) {
    if (typeof OffscreenCanvas === "function") return new OffscreenCanvas(width, height);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  async function canvasBlob(canvas, type, quality) {
    if (typeof canvas.convertToBlob === "function") {
      try { return await canvas.convertToBlob({ type, quality }); } catch { return null; }
    }
    return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
  }

  async function encodeWithFallback(canvas, quality) {
    const webp = await canvasBlob(canvas, "image/webp", quality);
    if (webp?.type === "image/webp") return webp;
    const jpeg = await canvasBlob(canvas, "image/jpeg", quality);
    if (!jpeg) throw new Error("Este navegador não conseguiu comprimir a imagem.");
    return jpeg;
  }

  async function processImage(file, options = {}) {
    if (!(file instanceof Blob) || !String(file.type || "").startsWith("image/")) throw new TypeError("Selecione um arquivo de imagem válido.");
    const config = { ...DEFAULTS, ...options };
    const decoded = await decodeImage(file);
    try {
      let size = dimensionsWithin(decoded.width, decoded.height, config.maxDimension);
      let quality = Math.min(0.92, Math.max(0.45, Number(config.quality) || 0.8));
      let result;
      for (let attempt = 0; attempt < 7; attempt += 1) {
        const canvas = createSurface(size.width, size.height);
        const context = canvas.getContext("2d", { alpha: false, desynchronized: true });
        if (!context) throw new Error("Canvas 2D indisponível neste navegador.");
        context.fillStyle = "#000";
        context.fillRect(0, 0, size.width, size.height);
        context.drawImage(decoded.source, 0, 0, size.width, size.height);
        result = await encodeWithFallback(canvas, quality);
        if (result.size <= config.targetMaxBytes || attempt === 6) break;
        if (quality > 0.58) quality -= 0.08;
        else size = dimensionsWithin(Math.round(size.width * 0.88), Math.round(size.height * 0.88), config.maxDimension);
      }
      const extension = result.type === "image/webp" ? "webp" : "jpg";
      return { blob: result, width: size.width, height: size.height, mimeType: result.type, extension, size: result.size, quality: Number(quality.toFixed(2)) };
    } finally {
      decoded.close();
    }
  }

  async function hashBlob(blob) {
    if (!crypto?.subtle) throw new Error("Hash criptográfico indisponível neste contexto.");
    const digest = await crypto.subtle.digest("SHA-256", await blob.arrayBuffer());
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  window.FitPlanImageProcessor = Object.freeze({ DEFAULTS, dimensionsWithin, processImage, hashBlob });
})();
