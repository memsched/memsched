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
