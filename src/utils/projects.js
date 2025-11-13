import { COLOR_PALETTES, ICONS } from "@/consts/projects";
import i18n from "@/config/i18n";

export const getColorPalette = (paletteId) => {
  const palette =
    COLOR_PALETTES.find((p) => p.id === paletteId) || COLOR_PALETTES[0];
  const paletteName = i18n.t(`color.${palette.id}`);

  return { ...palette, name: paletteName };
};

export const getIcon = (iconId) => {
  const icon = ICONS.find((i) => i.id === iconId) || ICONS[0];
  const iconName = i18n.t(`icon.${icon.id}`);

  return { ...icon, name: iconName };
};
