import SpinnerBox from "../SpinnerBox";

import styles from "./FullPageSpinner.module.scss";

const FullPageSpinner = () => {
  return (
    <div className={styles["page-container"]}>
      <SpinnerBox size="lg" />
    </div>
  );
};

export default FullPageSpinner;
