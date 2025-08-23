import { Check } from "lucide-react";

import styles from "./ProjectSymbol.module.scss";
import { getColorPalette, getIcon } from "@/utils/projects";

const ProjectSymbol = ({ paletteId, iconId, size = 38, checked = false }) => {
  const palette = getColorPalette(paletteId);
  const icon = getIcon(iconId);
  const ProjectIcon = icon.icon;

  return (
    <div
      aria-label="Символ проекта"
      aria-description={`Цвет: ${palette.name}, Иконка: ${icon.name}`}
      className={`flex-center ${styles["symbol"]}`}
      style={{
        width: typeof size === "number" ? `${size}px` : size,
        color: palette.primary,
        borderColor: palette.primary,
        backgroundColor: palette.soft,
      }}
    >
      <ProjectIcon size="58%" stroke="currentColor" strokeWidth={1} />
      {checked && (
        <div className={`flex-center ${styles["overlay--completed"]}`}>
          <Check size="70%" stroke="currentColor" />
        </div>
      )}
    </div>
  );
};

export default ProjectSymbol;
