import { NavLink, Outlet } from "react-router";

import { LayoutGrid, FolderKanban, FileCheck2, User } from "lucide-react";
import styles from "./Layout.module.scss";

const navigationLinkClassname = ({ isActive }) =>
  `btn ${styles["navigation-link"]} ${isActive ? styles["is-active"] : ""}`;

const Layout = () => {
  return (
    <div className={styles["container"]}>
      <header className={styles["top-panel"]}>
        <nav className={styles["top-panel__navbar"]}>
          <NavLink to="/" className={navigationLinkClassname}>
            <LayoutGrid size={19} stroke="currentColor" strokeWidth={1} />
            <span className="sr-only-mobile">Главное</span>
          </NavLink>
          <NavLink to="/projects" className={navigationLinkClassname}>
            <FolderKanban size={19} stroke="currentColor" strokeWidth={1} />
            <span className="sr-only-mobile">Проекты</span>
          </NavLink>
          <NavLink to="/tasks" className={navigationLinkClassname}>
            <FileCheck2 size={19} stroke="currentColor" strokeWidth={1} />
            <span className="sr-only-mobile">Задачи</span>
          </NavLink>
          <NavLink to="/profile" className={navigationLinkClassname}>
            <User size={19} stroke="currentColor" strokeWidth={1} />
            <span className="sr-only-mobile">Профиль</span>
          </NavLink>
        </nav>
      </header>
      <main className={styles["main-content"]}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
