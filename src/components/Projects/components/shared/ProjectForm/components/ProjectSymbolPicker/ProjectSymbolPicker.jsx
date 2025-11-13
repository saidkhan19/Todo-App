import { useTranslation } from "react-i18next";

import styles from "./ProjectSymbolPicker.module.scss";
import Menu from "@/lib/Menu";
import ProjectSymbol from "@/components/shared/ProjectSymbol";
import ColorFieldset from "./ColorFieldset";
import IconFieldset from "./IconFieldset";

const ProjectSymbolPicker = ({
  paletteId,
  iconId,
  setProjectPalette,
  setProjectIcon,
}) => {
  const { t } = useTranslation("projects");

  return (
    <Menu
      title={t("projectSymbol")}
      renderOpener={(props) => (
        <div
          {...props}
          role="combobox"
          tabIndex="0"
          title={t("projectSymbolPickerTitle")}
          className={styles["symbol-picker-input"]}
        >
          <ProjectSymbol paletteId={paletteId} iconId={iconId} />
        </div>
      )}
      renderContent={() => (
        <div>
          <ColorFieldset
            paletteId={paletteId}
            setProjectPalette={setProjectPalette}
          />
          <IconFieldset iconId={iconId} setProjectIcon={setProjectIcon} />
        </div>
      )}
    />
  );
};

export default ProjectSymbolPicker;
