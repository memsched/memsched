import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scrollToElement(to: string, offset = 0) {
  const element = document.getElementById(to);
  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function assert<T>(
  value: T | null | undefined,
  message: string
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(message || 'Value must be defined');
  }
}

export function getRandomHexColor() {
  const letters = '0123456789abcdef';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(navigator.language || 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function roundToDecimal(value: number, decimalPlaces: number) {
  return Math.round(value * 10 ** decimalPlaces) / 10 ** decimalPlaces;
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number) {
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function rgbToHsv(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0; // Hue is achromatic by default
  const v = max; // Value
  const d = max - min;
  const s = max === 0 ? 0 : d / max; // Saturation

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, v: v * 100 };
}

export function hsvToRgb(h: number, s: number, v: number) {
  let r = 0;
  let g = 0;
  let b = 0;
  h /= 360;
  s /= 100;
  v /= 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function hsvToHex(h: number, s: number, v: number): string {
  const { r, g, b } = hsvToRgb(h, s, v);
  return rgbToHex(r, g, b);
}

export function hexToHsv(hex: string): { h: number; s: number; v: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsv(rgb.r, rgb.g, rgb.b);
}

export function addOpacityRgba(hexColor: string, opacity: number): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Convert hex to RGB
  const rgb = hexToRgb(hex);
  if (!rgb) {
    throw new Error(`Invalid hex color: ${hexColor}`);
  }
  // Return rgba string
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

export function darkenHexColor(hexColor: string, amount: number) {
  const rgb = hexToRgb(hexColor);
  if (!rgb) {
    throw new Error(`Invalid hex color: ${hexColor}`);
  }
  return rgbToHex(
    Math.max(rgb.r - amount, 0),
    Math.max(rgb.g - amount, 0),
    Math.max(rgb.b - amount, 0)
  );
}

export function lightenHexColor(hexColor: string, amount: number) {
  const rgb = hexToRgb(hexColor);
  if (!rgb) {
    throw new Error(`Invalid hex color: ${hexColor}`);
  }
  return rgbToHex(
    Math.min(rgb.r + amount, 255),
    Math.min(rgb.g + amount, 255),
    Math.min(rgb.b + amount, 255)
  );
}

export function getMutedHexColor(hexColor: string, mutedIntensity: number = 1.0): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) {
    throw new Error(`Invalid hex color: ${hexColor}`);
  }

  // Calculate relative luminance using sRGB coefficients
  const luminance = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) / 255;

  // Base adjustment amounts
  const baseLightAdjustment = 130;
  const baseDarkAdjustment = 75;

  // Determine adjustment amount based on luminance and intensity
  const adjustmentAmount = Math.round(
    luminance < 0.5
      ? baseLightAdjustment * (1 - luminance) * mutedIntensity // Lighter for dark colors
      : baseDarkAdjustment * luminance * mutedIntensity
  ); // Darker for light colors

  return luminance < 0.5
    ? lightenHexColor(hexColor, adjustmentAmount)
    : darkenHexColor(hexColor, adjustmentAmount);
}

export function rgbaToHexa(r: number, g: number, b: number, a: number): string {
  const alphaHex = Math.round(a * 255)
    .toString(16)
    .padStart(2, '0');
  return `${rgbToHex(r, g, b)}${alphaHex}`;
}

export function hexToRgba(hex: string): { r: number; g: number; b: number; a: number } | null {
  if (!/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.test(hex)) {
    return null;
  }

  const hexClean = hex.replace('#', '');
  const r = parseInt(hexClean.substring(0, 2), 16);
  const g = parseInt(hexClean.substring(2, 4), 16);
  const b = parseInt(hexClean.substring(4, 6), 16);
  let a = 1; // Default alpha to 1 (fully opaque)
  if (hexClean.length === 8) {
    a = parseInt(hexClean.substring(6, 8), 16) / 255;
  }

  return { r, g, b, a };
}

export function rgbaToHsva(
  r: number,
  g: number,
  b: number,
  a: number
): { h: number; s: number; v: number; a: number } {
  const { h, s, v } = rgbToHsv(r, g, b);
  return { h, s, v, a };
}

export function hsvaToRgba(
  h: number,
  s: number,
  v: number,
  a: number
): { r: number; g: number; b: number; a: number } {
  const { r, g, b } = hsvToRgb(h, s, v);
  return { r, g, b, a };
}

export function hsvaToHexa(h: number, s: number, v: number, a: number): string {
  const { r, g, b } = hsvaToRgba(h, s, v, a);
  return rgbaToHexa(r, g, b, a);
}

export function hexToHsva(hex: string): { h: number; s: number; v: number; a: number } | null {
  const rgba = hexToRgba(hex);
  if (!rgba) return null;
  return rgbaToHsva(rgba.r, rgba.g, rgba.b, rgba.a);
}
