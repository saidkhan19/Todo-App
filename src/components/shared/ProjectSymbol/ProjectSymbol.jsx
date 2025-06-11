import styles from "./ProjectSymbol.module.scss";
import { getColorPalette, getIcon } from "@/utils/projects";

const ProjectSymbol = ({ paletteId, iconId, size = 38 }) => {
  const palette = getColorPalette(paletteId);
  const icon = getIcon(iconId);
  const ProjectIcon = icon.icon;

  return (
    <div
      aria-label="Символ проекта"
      aria-description={`Цвет: ${palette.name}, Иконка: ${icon.name}`}
      className={`flex-center ${styles["symbol"]}`}
      style={{
        width: `${size}px`,
        color: palette.primary,
        borderColor: palette.primary,
        backgroundColor: palette.soft,
      }}
    >
      <ProjectIcon size={22} stroke="currentColor" strokeWidth={1} />
    </div>
  );
};

export default ProjectSymbol;
