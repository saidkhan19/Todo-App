import { memo } from "react";

import styles from "./ProjectSymbolPicker.module.scss";
import { ICONS } from "@/consts/projects";

const IconFieldset = memo(function IconFieldset({ iconId, setProjectIcon }) {
  return (
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
              <div className={`flex-center ${styles["icon-option__box"]}`}>
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
  );
});

export default IconFieldset;
