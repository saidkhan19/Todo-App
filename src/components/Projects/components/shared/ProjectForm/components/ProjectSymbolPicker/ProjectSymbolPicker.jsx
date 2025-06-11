import styles from "./ProjectSymbolPicker.module.scss";
import Menu from "@/lib/Menu";
import ProjectSymbol from "@/components/shared/ProjectSymbol";
import { COLOR_PALETTES, ICONS } from "@/consts/projects";

const ProjectSymbolPicker = ({
  paletteId,
  iconId,
  setProjectPalette,
  setProjectIcon,
}) => {
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
          <fieldset className={styles["fieldset"]}>
            <legend className={styles["legend"]}>Цвет</legend>
            <div className={styles["color-options-container"]}>
              {COLOR_PALETTES.map((item) => (
                <label
                  key={item.id}
                  title={item.name}
                  className={`${styles["color-option"]} ${
                    item.id === paletteId ? styles["is-active"] : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    value={item.id}
                    name="palette"
                    checked={item.id === paletteId}
                    onChange={() => setProjectPalette(item.id)}
                    className="sr-only"
                  />
                  <div
                    className={styles["color-option__color-box"]}
                    style={{ backgroundColor: item.soft }}
                  />
                  <span className="sr-only">{item.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className={styles["fieldset"]}>
            <legend className={styles["legend"]}>Иконка</legend>
            <div className={styles["icon-options-container"]}>
              {ICONS.map((item) => {
                const Icon = item.icon;
                return (
                  <label
                    key={item.id}
                    title={item.name}
                    className={`${styles["icon-option"]} ${
                      item.id === iconId ? styles["is-active"] : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={item.id}
                      name="icon"
                      checked={item.id === iconId}
                      onChange={() => setProjectIcon(item.id)}
                      className="sr-only"
                    />
                    <div
                      className={`flex-center ${styles["icon-option__box"]}`}
                    >
                      <Icon
                        size={item.id === iconId ? 18 : 22}
                        stroke="currentColor"
                      />
                    </div>
                    <span className="sr-only">{item.name}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      )}
    />
  );
};

export default ProjectSymbolPicker;
