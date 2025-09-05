import { useId } from "react";
import { motion as Motion } from "motion/react";
import clsx from "clsx/lite";

import styles from "./StatusMessage.module.scss";

const StatusMessage = ({ type, title, message }) => {
  const headerId = useId();
  const descriptionId = useId();

  let role;
  switch (type) {
    case "info":
      role = "status";
      break;
    case "error":
      role = "alert";
      break;
  }

  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      role={role}
      aria-labelledby={title ? headerId : null}
      aria-describedby={descriptionId}
      className={clsx(styles["status"], styles[`status--${type}`])}
    >
      {title && <h2 id={headerId}>{title}</h2>}
      <p id={descriptionId}>{message}</p>
    </Motion.div>
  );
};

export default StatusMessage;
