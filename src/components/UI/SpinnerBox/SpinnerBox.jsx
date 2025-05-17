import { LoaderCircle } from "lucide-react";
import styles from "./SpinnerBox.module.scss";

const SpinnerBox = ({ size = "md", height /* "sm"| "md" | "lg" */ }) => {
  let iconSize = 0;

  switch (size) {
    case "sm":
      iconSize = 24;
      break;
    case "md":
      iconSize = 44;
      break;
    case "lg":
      iconSize = 70;
      break;
  }

  let classname = "";
  switch (height) {
    case "sm":
      classname = styles["spinner-container--sm"];
      break;
    case "md":
      classname = styles["spinner-container--md"];
      break;
    case "lg":
      classname = styles["spinner-container--lg"];
      break;
    default:
      classname = "";
      break;
  }

  return (
    <div
      role="status"
      className={`${styles["spinner-container"]} ${classname}`}
    >
      <p className="sr-only">Loading</p>
      <div className={styles["spinner"]}>
        <LoaderCircle size={iconSize} stroke="currentColor" />
      </div>
    </div>
  );
};

export default SpinnerBox;
