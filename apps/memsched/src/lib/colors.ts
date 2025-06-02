/*
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import { type Color, converter, parse } from 'culori';

import { assert, clamp } from './utils';

export const toHsv = converter('hsv');
export const toRgb = converter('rgb');
export const toHsl = converter('hsl');
export const toOklch = converter('oklch');

export function parseColor(color: Color | Parameters<typeof parse>[0]): Color {
  if (typeof color === 'string') {
    const parsed = parse(color);
    assert(parsed, 'Invalid color');
    return parsed;
  }
  return color;
}

export function setOpacity(color: Color | Parameters<typeof parse>[0], opacity: number): Color {
  const colorObj = parseColor(color);
  return { ...colorObj, alpha: opacity };
}

export function getLuminance(color: Color): number {
  const hsl = toHsl(color);
  return hsl.l;
}

export function brighten(color: Color | Parameters<typeof parse>[0], amount: number): Color {
  const colorObj = toRgb(parseColor(color));
  colorObj.r = clamp(colorObj.r + amount, 0, 1);
  colorObj.g = clamp(colorObj.g + amount, 0, 1);
  colorObj.b = clamp(colorObj.b + amount, 0, 1);
  return colorObj;
}

export function darken(color: Color | Parameters<typeof parse>[0], amount: number): Color {
  const colorObj = toRgb(parseColor(color));
  colorObj.r = clamp(colorObj.r - amount, 0, 1);
  colorObj.g = clamp(colorObj.g - amount, 0, 1);
  colorObj.b = clamp(colorObj.b - amount, 0, 1);
  return colorObj;
}

export function getMutedColor(
  color: Color | Parameters<typeof parse>[0],
  mutedIntensity: number = 1.0
): Color {
  const colorObj = parseColor(color);
  const luminance = getLuminance(colorObj);

  // Base adjustment amounts
  const baseLightAdjustment = 0.5;
  const baseDarkAdjustment = 0.3;

  // Determine adjustment amount based on luminance and intensity
  const adjustmentAmount =
    luminance < 0.5
      ? baseLightAdjustment * (1 - luminance) * mutedIntensity // Lighter for dark colors
      : baseDarkAdjustment * luminance * mutedIntensity; // Darker for light colors

  if (luminance < 0.5) {
    return brighten(colorObj, adjustmentAmount);
  } else {
    return darken(colorObj, adjustmentAmount);
  }
}

export function smartInvert(
  color: Color | Parameters<typeof parse>[0],
  chromaBoost: number = 1.2
): Color {
  const colorObj = parseColor(color);

  // Convert to OKLCH for perceptually uniform color manipulation
  const oklch = toOklch(colorObj);

  // Calculate inversion factor based on chroma (c)
  // Higher chroma = less inversion to preserve vibrant colors
  const inversionFactor = Math.max(0.1, 1 - oklch.c * 2);

  // Smart inversion: invert lightness proportionally to chroma
  oklch.l = 1 - oklch.l * inversionFactor;

  // Optionally boost chroma based on parameter
  oklch.c = Math.min(0.4, oklch.c * chromaBoost);

  return oklch;
}
