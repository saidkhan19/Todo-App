import { COLOR_PALETTES, DEFAULT_PALETTE, ICONS } from "@/consts/projects";

export const getColorPalette = (paletteId) => {
  return COLOR_PALETTES.find((p) => p.id === paletteId) || DEFAULT_PALETTE;
};

export const getIcon = (iconId) => {
  return ICONS.find((i) => i.id === iconId);
};
