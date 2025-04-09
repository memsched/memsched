// Create a new file: src/lib/server/fonts.ts
import type satori from 'satori';

import geistMono from '$lib/server/assets/fonts/geist-mono-latin-800-normal.woff?raw';
import interRegular from '$lib/server/assets/fonts/inter-latin-400-normal.woff?raw';
import interSemiBold from '$lib/server/assets/fonts/inter-latin-600-normal.woff?raw';
import interExtraBold from '$lib/server/assets/fonts/inter-latin-800-normal.woff?raw';

// Convert base64 strings to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Create and export singleton for font options
export const fontOptions: Parameters<typeof satori>[1]['fonts'] = [
  {
    name: 'Inter',
    data: base64ToArrayBuffer(interRegular),
    weight: 400,
    style: 'normal',
  },
  {
    name: 'Inter',
    data: base64ToArrayBuffer(interSemiBold),
    weight: 600,
    style: 'normal',
  },
  {
    name: 'Inter',
    data: base64ToArrayBuffer(interExtraBold),
    weight: 800,
    style: 'normal',
  },
  {
    name: 'Geist Mono',
    data: base64ToArrayBuffer(geistMono),
    weight: 800,
    style: 'normal',
  },
];
