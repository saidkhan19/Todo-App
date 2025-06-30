import { motion as Motion } from "motion/react";

import styles from "../Notifications.module.scss";
import { NOTIFICATION_DURATION } from "../../../config/app";

const LoadingIndicator = () => {
  const durationInSeconds = NOTIFICATION_DURATION / 1000;

  return (
    <Motion.div
      initial={{ width: "100%" }}
      animate={{ width: "0%" }}
      transition={{
        duration: durationInSeconds,
        ease: "linear",
      }}
      className={styles["loading-indicator"]}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
};

export default LoadingIndicator;
