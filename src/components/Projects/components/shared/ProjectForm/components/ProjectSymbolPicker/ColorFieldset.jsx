import { memo } from "react";

import styles from "./ProjectSymbolPicker.module.scss";
import { COLOR_PALETTES } from "@/consts/projects";

const ColorFieldset = memo(function ColorFieldset({
  paletteId,
  setProjectPalette,
}) {
  return (
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
  );
});

export default ColorFieldset;
