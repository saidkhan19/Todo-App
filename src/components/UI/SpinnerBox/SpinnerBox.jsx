import { LoaderCircle } from "lucide-react";

import styles from "./SpinnerBox.module.scss";

const iconSizes = {
  sm: 24,
  md: 44,
  lg: 70,
};

const classNames = {
  sm: styles["spinner-container--sm"],
  md: styles["spinner-container--md"],
  lg: styles["spinner-container--lg"],
  default: "",
};

const SpinnerBox = ({ size = "md", height = "default" }) => {
  return (
    <div
      role="status"
      className={`${styles["spinner-container"]} ${classNames[height]}`}
    >
      <p className="sr-only">Загрузка</p>
      <div className={styles["spinner"]}>
        <LoaderCircle size={iconSizes[size]} stroke="currentColor" />
      </div>
    </div>
  );
};

export default SpinnerBox;
