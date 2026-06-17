/**
 * Utility to compress any uploaded image file and convert it to high-performance WebP format.
 * It scales down large device camera photos (max 1000px) and applies 0.7 quality compression.
 * This decreases payload sizes by up to 95%, making uploads instant even on slow 4G devices.
 */
export function compressImage(file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while resizing
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        try {
          // Compress to lightweight WebP, fallback to JPEG if unsupported
          const webpData = canvas.toDataURL('image/webp', quality);
          resolve(webpData);
        } catch {
          const jpegData = canvas.toDataURL('image/jpeg', quality);
          resolve(jpegData);
        }
      };
      img.onerror = () => {
        // Fallback if image load fails
        const fallbackReader = new FileReader();
        fallbackReader.onload = (e) => resolve(e.target?.result as string);
        fallbackReader.readAsDataURL(file);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
