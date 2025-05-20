import { Link } from "react-router";
import { BadgeInfo } from "lucide-react";

import styles from "./Layout.module.scss";

const Warning = () => {
  return (
    <p className={styles["bottom-warning"]}>
      <BadgeInfo
        size={16}
        stroke="currentColor"
        strokeWidth={1}
        className={styles["bottom-warning__icon"]}
      />
      <span>
        Вы вошли как анонимный пользователь.
        <Link to="/auth" className={`btn ${styles["link-underline"]}`}>
          Войдите
        </Link>
        , чтобы сохранить ваши данные.
      </span>
    </p>
  );
};

export default Warning;
