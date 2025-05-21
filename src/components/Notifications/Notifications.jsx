import useNotificationStore from "../../store/useNotificationStore";
import NotificationItem from "./components/NotificationItem";

import styles from "./Notifications.module.scss";

const Notifications = () => {
  const notifications = useNotificationStore((state) => state.notifications);

  return (
    <ul
      className={styles["notification-list"]}
      aria-label="Уведомления"
      aria-relevant="additions"
    >
      {notifications.map((n) => (
        <NotificationItem key={n.id} type={n.type} message={n.message} />
      ))}
    </ul>
  );
};

export default Notifications;
