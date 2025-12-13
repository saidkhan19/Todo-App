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
import PreloadNavlink from "@/components/shared/PreloadNavlink/PreloadNavlink";
import {
  preloadAuth,
  preloadHome,
  preloadProfile,
  preloadProjects,
  preloadTasks,
} from "@/utils/preload";

const navigationLinkClassname = ({ isActive }) =>
  clsx("btn", styles["navigation-link"], isActive && styles["is-active"]);

const Header = ({ isAnonymous }) => {
  const { t } = useTranslation("common");

  return (
    <header className={styles["top-panel"]}>
      <nav className={styles["top-panel__navbar"]}>
        <PreloadNavlink
          to="/"
          className={navigationLinkClassname}
          preloadFn={preloadHome}
        >
          <LayoutGrid size={19} stroke="currentColor" strokeWidth={1} />
          <span className="sr-only-mobile">{t("navHomePage")}</span>
        </PreloadNavlink>
        <PreloadNavlink
          to="/projects"
          className={navigationLinkClassname}
          preloadFn={preloadProjects}
        >
          <FolderKanban size={19} stroke="currentColor" strokeWidth={1} />
          <span className="sr-only-mobile">{t("navProjectsPage")}</span>
        </PreloadNavlink>
        <PreloadNavlink
          to="/tasks"
          className={navigationLinkClassname}
          preloadFn={preloadTasks}
        >
          <FileCheck2 size={19} stroke="currentColor" strokeWidth={1} />
          <span className="sr-only-mobile">{t("navTasksPage")}</span>
        </PreloadNavlink>
        {isAnonymous ? (
          <PreloadNavlink
            to="/auth"
            className={navigationLinkClassname}
            preloadFn={preloadAuth}
          >
            <LogIn size={19} stroke="currentColor" strokeWidth={1} />
            <span className="sr-only-mobile">{t("navLogIn")}</span>
          </PreloadNavlink>
        ) : (
          <PreloadNavlink
            to="/profile"
            className={navigationLinkClassname}
            preloadFn={preloadProfile}
          >
            <User size={19} stroke="currentColor" strokeWidth={1} />
            <span className="sr-only-mobile">{t("navProfilePage")}</span>
          </PreloadNavlink>
        )}
      </nav>
    </header>
  );
};

export default Header;
