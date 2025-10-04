import { dev } from '$app/environment';

/**
 * Converts a base64 string to an ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  // Remove data URL prefix if present
  const base64Data = base64.replace(/^data:image\/[^;]+;base64,/, '');
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Converts a File to a base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:${file.type};base64,${btoa(binary)}`;
}

/**
 * Converts an ArrayBuffer to a base64 string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer, mimeType: string = 'image/jpeg'): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Resizes an image buffer to a maximum width or height while maintaining aspect ratio
 */
export async function resizeImageBuffer(
  buffer: ArrayBuffer,
  maxSize: number,
  quality: number = 75
): Promise<ArrayBuffer> {
  if (dev) {
    // In dev mode, return the original buffer without resizing
    return buffer;
  }

  const { PhotonImage, SamplingFilter, resize } = await import('@cf-wasm/photon');
  const inputBytes = new Uint8Array(buffer);
  const inputImage = PhotonImage.new_from_byteslice(inputBytes);

  try {
    // Calculate new dimensions maintaining aspect ratio
    const width = inputImage.get_width();
    const height = inputImage.get_height();
    let newWidth = width;
    let newHeight = height;

    if (width > height && width > maxSize) {
      newWidth = maxSize;
      newHeight = Math.round((height * maxSize) / width);
    } else if (height > maxSize) {
      newHeight = maxSize;
      newWidth = Math.round((width * maxSize) / height);
    }

    // Only resize if the image is larger than maxSize
    if (width > maxSize || height > maxSize) {
      const outputImage = resize(inputImage, newWidth, newHeight, SamplingFilter.Lanczos3);
      const outputBytes = outputImage.get_bytes_jpeg(quality);
      outputImage.free();
      return outputBytes.buffer as ArrayBuffer;
    }

    // If image is already smaller than maxSize, return original buffer
    return buffer;
  } finally {
    inputImage.free();
  }
}

/**
 * Processes an image URL or base64 string for widget use
 * Returns a resized base64 image string
 */
export async function processWidgetImage(imageUrl: string | null): Promise<string | null> {
  if (!imageUrl) return null;

  // If it's an SVG URL, return as is
  if (imageUrl.match(/^https?:\/\//) && imageUrl.toLowerCase().endsWith('.svg')) {
    return imageUrl;
  }

  // If it's a base64 image, resize it
  if (imageUrl.startsWith('data:image/')) {
    const buffer = base64ToArrayBuffer(imageUrl);
    const resizedBuffer = await resizeImageBuffer(buffer, 200); // Widget images are 200px max
    return arrayBufferToBase64(resizedBuffer);
  }

  return null;
}
