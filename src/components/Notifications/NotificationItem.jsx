import { useId } from "react";
import PropTypes from "prop-types";
import { CheckCheck, TriangleAlert, Ban } from "lucide-react";

import styles from "./Notifications.module.scss";
import LoadingIndicator from "./LoadingIndicator";

const NotificationItem = ({ type, message }) => {
  const descriptionId = useId();

  let label, role, ariaLive, Icon;
  switch (type) {
    case "success":
      label = "Успешно";
      role = "status";
      ariaLive = "polite";
      Icon = CheckCheck;
      break;
    case "warning":
      label = "Внимание";
      role = "alert";
      ariaLive = "polite";
      Icon = TriangleAlert;
      break;
    case "error":
      label = "Ошибка";
      role = "alert";
      ariaLive = "assertive";
      Icon = Ban;
      break;
  }

  return (
    <li
      className={`${styles["notification-item"]} ${styles[type]}`}
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
      aria-modal="true"
      aria-label={label}
      aria-describedby={descriptionId}
    >
      <LoadingIndicator />
      <div className={styles["notification-item__icon"]}>
        <Icon size={24} stroke="currentColor" />
      </div>
      <p id={descriptionId}>{message}</p>
    </li>
  );
};

NotificationItem.propTypes = {
  type: PropTypes.oneOf(["success", "warning", "error"]).isRequired,
  message: PropTypes.string.isRequired,
};

export default NotificationItem;
