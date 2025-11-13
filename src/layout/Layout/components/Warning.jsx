import { Link } from "react-router";
import { Trans } from "react-i18next";
import { BadgeInfo } from "lucide-react";

import styles from "../Layout.module.scss";

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
        <Trans ns="common" i18nKey="footerAuthWarning">
          You are logged in as an anonymous user.
          <Link to="/auth" className={`btn ${styles["link-underline"]}`}>
            Log in
          </Link>
          to save your data.
        </Trans>
      </span>
    </p>
  );
};

export default Warning;
