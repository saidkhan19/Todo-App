import { useId } from "react";
import { Check } from "lucide-react";

import styles from "./Checkbox.module.scss";

const Checkbox = ({ value, name, label, checked, onChange, disabled }) => {
  const id = useId();

  return (
    <label
      htmlFor={id}
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
        onChange={onChange}
      />
      <div className={`flex-center ${styles["checkbox-box"]}`}>
        {checked && <Check size={16} stroke="currentColor" />}
      </div>
    </label>
  );
};

export default Checkbox;
