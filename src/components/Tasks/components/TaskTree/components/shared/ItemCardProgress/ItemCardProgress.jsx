import { useId } from "react";
import { useTranslation } from "react-i18next";

import styles from "./ItemCardProgress.module.scss";
import ProgressBar from "@/components/UI/ProgressBar";

const ItemCardProgress = ({ completed, overall }) => {
  const progressId = useId();
  const { t } = useTranslation("tasks");

  return (
    <div className={styles["progress"]}>
      <p id={progressId} className={styles["progress-label"]}>
        <span className="sr-only">{t("itemProgressLabel")}</span>
        <span>
          {completed}/{overall}
        </span>
      </p>
      <ProgressBar
        value={(completed / overall) * 100}
        labelledby={progressId}
      />
    </div>
  );
};

export default ItemCardProgress;
