import { useId } from "react";
import { motion as Motion, useAnimate } from "motion/react";
import { Check } from "lucide-react";

import styles from "./Checkbox.module.scss";

const Checkbox = ({ value, name, label, checked, onChange, disabled }) => {
  const id = useId();
  const [scope, animate] = useAnimate();

  const onCheckboxChange = (e) => {
    animate(
      `.${styles["checkbox-box"]}`,
      { transform: ["scale(1)", "scale(1.1)", "scale(1)"] },
      { duration: 0.3 }
    );

    onChange(e);
  };

  return (
    <label
      htmlFor={id}
      ref={scope}
      className={`${styles["checkbox"]} ${checked ? styles["is-active"] : ""}`}
      title={label}
    >
      <span className="sr-only">{label}</span>
      <input
        id={id}
        className="sr-only"
        type="checkbox"
        name={name}
        value={value}
        disabled={disabled}
        checked={checked}
        onChange={onCheckboxChange}
      />
      <div className={`flex-center ${styles["checkbox-box"]}`}>
        {checked && <Check size={16} stroke="currentColor" />}
      </div>
    </label>
  );
};

export default Checkbox;
