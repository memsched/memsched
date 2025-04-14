interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Parses a hex color string (#rgb, #rgba, #rrggbb, #rrggbbaa) into RGBA components.
 * Throws an error for invalid hex strings.
 */
export function parseHexColor(hex: string): RgbaColor {
  const hexClean = hex.startsWith('#') ? hex.slice(1) : hex;

  if (!/^[a-f\d]+$/i.test(hexClean)) {
    throw new Error(`Invalid hex color characters: ${hex}`);
  }

  let rStr: string, gStr: string, bStr: string, aStr: string | undefined;

  if (hexClean.length === 3 || hexClean.length === 4) {
    // Expand shorthand hex (#rgb or #rgba)
    rStr = hexClean[0] + hexClean[0];
    gStr = hexClean[1] + hexClean[1];
    bStr = hexClean[2] + hexClean[2];
    aStr = hexClean.length === 4 ? hexClean[3] + hexClean[3] : undefined;
  } else if (hexClean.length === 6 || hexClean.length === 8) {
    // Full hex (#rrggbb or #rrggbbaa)
    rStr = hexClean.substring(0, 2);
    gStr = hexClean.substring(2, 4);
    bStr = hexClean.substring(4, 6);
    aStr = hexClean.length === 8 ? hexClean.substring(6, 8) : undefined;
  } else {
    throw new Error(`Invalid hex color length: ${hex}`);
  }

  const r = parseInt(rStr, 16);
  const g = parseInt(gStr, 16);
  const b = parseInt(bStr, 16);
  const a = aStr !== undefined ? parseInt(aStr, 16) / 255 : 1; // Default alpha to 1 if not present

  if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
    throw new Error(`Invalid hex color value: ${hex}`);
  }

  return { r, g, b, a };
}

/**
 * Formats RGBA components into a hex color string (#rrggbb or #rrggbbaa).
 * Alpha channel is included only if it's less than 1.
 */
export function formatHexColor({ r, g, b, a }: RgbaColor): string {
  const rHex = Math.round(r).toString(16).padStart(2, '0');
  const gHex = Math.round(g).toString(16).padStart(2, '0');
  const bHex = Math.round(b).toString(16).padStart(2, '0');
  const aHex =
    a < 1
      ? Math.round(a * 255)
          .toString(16)
          .padStart(2, '0')
      : '';

  return `#${rHex}${gHex}${bHex}${aHex}`;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  try {
    const { r, g, b } = parseHexColor(hex);
    return { r, g, b };
  } catch {
    return null; // Maintain original behavior of returning null on error
  }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return formatHexColor({ r, g, b, a: 1 });
}

export function hexToRgba(hex: string): RgbaColor | null {
  try {
    return parseHexColor(hex);
  } catch {
    return null; // Maintain original behavior of returning null on error
  }
}

export function rgbaToHexa(r: number, g: number, b: number, a: number): string {
  return formatHexColor({ r, g, b, a });
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
  let r = 0,
    g = 0,
    b = 0;
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
  return formatHexColor({ r, g, b, a: 1 });
}

export function hexToHsv(hex: string): { h: number; s: number; v: number } | null {
  try {
    const { r, g, b } = parseHexColor(hex);
    return rgbToHsv(r, g, b);
  } catch {
    return null;
  }
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

export function hsvaToRgba(h: number, s: number, v: number, a: number): RgbaColor {
  const { r, g, b } = hsvToRgb(h, s, v);
  return { r, g, b, a };
}

export function hsvaToHexa(h: number, s: number, v: number, a: number): string {
  const { r, g, b } = hsvaToRgba(h, s, v, a);
  return formatHexColor({ r, g, b, a });
}

export function hexToHsva(hex: string): { h: number; s: number; v: number; a: number } | null {
  try {
    const rgba = parseHexColor(hex);
    return rgbaToHsva(rgba.r, rgba.g, rgba.b, rgba.a);
  } catch {
    return null;
  }
}

export function addOpacityRgba(hexColor: string, opacity: number): string {
  const { r, g, b } = parseHexColor(hexColor); // Ignore original alpha if present
  // Clamp opacity between 0 and 1
  const clampedOpacity = Math.max(0, Math.min(1, opacity));
  return `rgba(${r}, ${g}, ${b}, ${clampedOpacity})`;
}

export function darkenHexColor(hexColor: string, amount: number): string {
  const { r, g, b, a } = parseHexColor(hexColor);
  const darkenedRgb = {
    r: Math.max(0, r - amount),
    g: Math.max(0, g - amount),
    b: Math.max(0, b - amount),
    a, // Preserve alpha
  };
  return formatHexColor(darkenedRgb);
}

export function lightenHexColor(hexColor: string, amount: number): string {
  const { r, g, b, a } = parseHexColor(hexColor);
  const lightenedRgb = {
    r: Math.min(255, r + amount),
    g: Math.min(255, g + amount),
    b: Math.min(255, b + amount),
    a, // Preserve alpha
  };
  return formatHexColor(lightenedRgb);
}

/**
 * Calculates the relative luminance of a hex color.
 * Uses the sRGB luminance formula.
 * @param hex The hex color string.
 * @returns Luminance value between 0 (black) and 1 (white).
 */
export function getLuminance(hex: string): number {
  const { r, g, b } = parseHexColor(hex); // Alpha is ignored for luminance calculation
  // Coefficients from sRGB luminance formula
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function getMutedHexColor(hexColor: string, mutedIntensity: number = 1.0): string {
  const { r, g, b, a } = parseHexColor(hexColor);
  const luminance = getLuminance(hexColor);

  // Base adjustment amounts
  const baseLightAdjustment = 130;
  const baseDarkAdjustment = 75;

  // Determine adjustment amount based on luminance and intensity
  const adjustmentAmount = Math.round(
    luminance < 0.5
      ? baseLightAdjustment * (1 - luminance) * mutedIntensity // Lighter for dark colors
      : baseDarkAdjustment * luminance * mutedIntensity // Darker for light colors
  );

  const adjustedRgb =
    luminance < 0.5
      ? {
          r: Math.min(255, r + adjustmentAmount),
          g: Math.min(255, g + adjustmentAmount),
          b: Math.min(255, b + adjustmentAmount),
          a, // Preserve alpha
        }
      : {
          r: Math.max(0, r - adjustmentAmount),
          g: Math.max(0, g - adjustmentAmount),
          b: Math.max(0, b - adjustmentAmount),
          a, // Preserve alpha
        };

  return formatHexColor(adjustedRgb);
}

/**
 * Inverts a hex color (#rgb, #rgba, #rrggbb, #rrggbbaa).
 * Preserves the original alpha channel.
 * @param hex The hex color string.
 * @param bw Optional: If true, forces the output to be black or white based on luminance (alpha is ignored).
 * @returns The inverted hex color string.
 */
export function invertColor(hex: string, bw: boolean = false): string {
  const rgba = parseHexColor(hex);

  if (bw) {
    // http://stackoverflow.com/a/3943023/112731
    // Calculate luminance from RGB, ignore alpha for BW conversion
    const luminance = getLuminance(hex);
    // Return pure black or white hex, no alpha
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  // Invert only RGB components, keep original alpha
  const invertedRgba = {
    r: 255 - rgba.r,
    g: 255 - rgba.g,
    b: 255 - rgba.b,
    a: rgba.a,
  };

  return formatHexColor(invertedRgba);
}

/**
 * Inverts the brightness (Value) of a hex color while preserving its Hue and Alpha.
 * Useful for creating dark mode variants.
 * Saturation is currently kept the same, but could be adjusted in the future.
 * @param hex The hex color string (#rgb, #rgba, #rrggbb, #rrggbbaa).
 * @returns The smart-inverted hex color string, or the original hex if parsing fails.
 */
export function smartInvertColor(hex: string): string {
  try {
    const hsva = hexToHsva(hex);
    if (!hsva) {
      // Handle parsing failure if hexToHsva returns null
      return hex;
    }

    // Invert Value (brightness), clamp between 0 and 100
    const invertedValue = Math.max(0, Math.min(100, 100 - hsva.v));

    // Create new HSVA with inverted value, keeping hue, saturation, and alpha
    const smartInvertedHsva = {
      h: hsva.h,
      s: hsva.s, // Keep saturation for now
      v: invertedValue,
      a: hsva.a,
    };

    return hsvaToHexa(
      smartInvertedHsva.h,
      smartInvertedHsva.s,
      smartInvertedHsva.v,
      smartInvertedHsva.a
    );
  } catch (error) {
    console.error(`Error in smartInvertColor for hex "${hex}":`, error);
    return hex; // Return original hex on any error
  }
}
