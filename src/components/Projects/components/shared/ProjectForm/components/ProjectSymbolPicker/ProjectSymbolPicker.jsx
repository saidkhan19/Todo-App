import PropTypes from "prop-types";

import styles from "./ProjectSymbolPicker.module.scss";
import Menu from "@/lib/Menu/Menu";
import ProjectSymbol from "@/components/shared/ProjectSymbol";

const ProjectSymbolPicker = ({ paletteId, iconId }) => {
  return (
    <Menu
      title="Символ проекта"
      renderOpener={(props) => (
        <div {...props} className={styles["symbol-picker-input"]}>
          <ProjectSymbol paletteId={paletteId} iconId={iconId} />
        </div>
      )}
      renderContent={() => (
        <div>
          <h2>Цвет</h2>
          <h2>Иконка</h2>
        </div>
      )}
    />
  );
};

ProjectSymbolPicker.propTypes = {
  paletteId: PropTypes.string,
  iconId: PropTypes.string,
};

export default ProjectSymbolPicker;
