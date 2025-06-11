import { COLOR_PALETTES, ICONS } from "@/consts/projects";

export const getColorPalette = (paletteId) => {
  return COLOR_PALETTES.find((p) => p.id === paletteId) || COLOR_PALETTES[0];
};

export const getIcon = (iconId) => {
  return ICONS.find((i) => i.id === iconId);
};
