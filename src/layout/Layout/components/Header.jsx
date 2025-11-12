import { NavLink } from "react-router";
import clsx from "clsx/lite";
import {
  LayoutGrid,
  FolderKanban,
  FileCheck2,
  User,
  LogIn,
} from "lucide-react";

import styles from "../Layout.module.scss";
import { useTranslation } from "react-i18next";

const navigationLinkClassname = ({ isActive }) =>
  clsx("btn", styles["navigation-link"], isActive && styles["is-active"]);

const Header = ({ isAnonymous }) => {
  const { t } = useTranslation("common");

  return (
    <header className={styles["top-panel"]}>
      <nav className={styles["top-panel__navbar"]}>
        <NavLink to="/" className={navigationLinkClassname}>
          <LayoutGrid size={19} stroke="currentColor" strokeWidth={1} />
          <span className="sr-only-mobile">{t("navHomePage")}</span>
        </NavLink>
        <NavLink to="/projects" className={navigationLinkClassname}>
          <FolderKanban size={19} stroke="currentColor" strokeWidth={1} />
          <span className="sr-only-mobile">{t("navProjectsPage")}</span>
        </NavLink>
        <NavLink to="/tasks" className={navigationLinkClassname}>
          <FileCheck2 size={19} stroke="currentColor" strokeWidth={1} />
          <span className="sr-only-mobile">{t("navTasksPage")}</span>
        </NavLink>
        {isAnonymous ? (
          <NavLink to="/auth" className={navigationLinkClassname}>
            <LogIn size={19} stroke="currentColor" strokeWidth={1} />
            <span className="sr-only-mobile">{t("navLogIn")}</span>
          </NavLink>
        ) : (
          <NavLink to="/profile" className={navigationLinkClassname}>
            <User size={19} stroke="currentColor" strokeWidth={1} />
            <span className="sr-only-mobile">{t("navProfilePage")}</span>
          </NavLink>
        )}
      </nav>
    </header>
  );
};

export default Header;
