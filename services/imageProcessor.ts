
/**
 * Processes an image to extract edges/outlines using a basic Sobel-like approach on a canvas.
 */
export const generateOutlines = async (dataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject("Canvas not supported");

      canvas.width = img.width;
      canvas.height = img.height;
      
      // Step 1: Draw grayscale image with high contrast
      ctx.filter = 'grayscale(100%) contrast(300%)';
      ctx.drawImage(img, 0, 0);

      // Step 2: Edge detection using convolution
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;

      // Create a copy for reading while writing
      const output = ctx.createImageData(width, height);
      const outputData = output.data;

      // Simple Sobel-like edge detection
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4;
          
          // Get intensity of surrounding pixels
          // (Simplified kernel for performance)
          const p = data[((y - 1) * width + x) * 4];
          const n = data[((y + 1) * width + x) * 4];
          const w = data[(y * width + (x - 1)) * 4];
          const e = data[(y * width + (x + 1)) * 4];
          const c = data[idx];

          const diff = Math.abs(p - c) + Math.abs(n - c) + Math.abs(w - c) + Math.abs(e - c);
          
          // If the difference is high, it's an edge
          const threshold = 15;
          const val = diff > threshold ? 0 : 255; // Black edges, white background

          outputData[idx] = val;     // R
          outputData[idx + 1] = val; // G
          outputData[idx + 2] = val; // B
          outputData[idx + 3] = val === 0 ? 255 : 0; // Transparent background for white, opaque for black edges
        }
      }

      ctx.putImageData(output, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};
