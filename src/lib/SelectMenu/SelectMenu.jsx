import { useEffect, useRef, useState } from "react";

import styles from "./SelectMenu.module.scss";

const SelectMenu = ({ options, selected, onChange }) => {
  const refs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(() =>
    options.findIndex((item) => item.value === selected)
  );

  useEffect(() => {
    refs.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  const handleKeyDown = (e, item) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(item.value);
    }
  };

  return (
    <ul role="listbox" className={styles["select"]}>
      {options.map((item, idx) => (
        <li
          key={item.value}
          ref={(el) => (refs.current[idx] = el)}
          role="option"
          tabIndex="0"
          aria-selected={item.value === selected}
          onClick={() => onChange(item.value)}
          onKeyDown={(e) => handleKeyDown(e, item)}
          onFocus={() => setFocusedIndex(idx)}
          className={`${styles["option"]} ${
            item.value === selected ? styles["option--selected"] : ""
          }`}
        >
          <span className={styles["option__text"]}>{item.name}</span>
        </li>
      ))}
    </ul>
  );
};

export default SelectMenu;
