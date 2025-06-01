import { COLOR_PALETTES, DEFAULT_PALETTE } from "../consts/projects";

export const getColorPalette = (paletteId) => {
  return COLOR_PALETTES.find((p) => p.id === paletteId) || DEFAULT_PALETTE;
};
