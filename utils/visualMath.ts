// Math and visual utility functions

/**
 * Maps a value from one range to another.
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

/**
 * Clamps a value between a minimum and maximum.
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Linear interpolation (lerp). Useful for smoothing values over time.
 */
export const lerp = (start: number, end: number, amt: number): number => {
  return (1 - amt) * start + amt * end;
};

/**
 * Convert hex color to rgba for canvas usage.
 */
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(255, 255, 255, ${alpha})`;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Get an approximate beat value (0 to 1) from low frequency audio data.
 */
export const getBeatIntensity = (frequencyData: Uint8Array, startBin = 0, endBin = 4): number => {
  if (!frequencyData || frequencyData.length === 0) return 0;
  let sum = 0;
  const count = endBin - startBin;
  for (let i = startBin; i < endBin; i++) {
    sum += frequencyData[i];
  }
  const avg = sum / count;
  return avg / 255;
};
