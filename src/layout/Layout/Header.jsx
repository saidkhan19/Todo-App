import { NavLink } from "react-router";
import {
  LayoutGrid,
  FolderKanban,
  FileCheck2,
  User,
  LogIn,
} from "lucide-react";

import styles from "./Layout.module.scss";
import PropTypes from "prop-types";

const navigationLinkClassname = ({ isActive }) =>
  `btn ${styles["navigation-link"]} ${isActive ? styles["is-active"] : ""}`;

const Header = ({ isAnonymous }) => {
  return (
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
        {isAnonymous ? (
          <NavLink to="/auth" className={navigationLinkClassname}>
            <LogIn size={19} stroke="currentColor" strokeWidth={1} />
            <span className="sr-only-mobile">Войти</span>
          </NavLink>
        ) : (
          <NavLink to="/profile" className={navigationLinkClassname}>
            <User size={19} stroke="currentColor" strokeWidth={1} />
            <span className="sr-only-mobile">Профиль</span>
          </NavLink>
        )}
      </nav>
    </header>
  );
};

Header.propTypes = {
  isAnonymous: PropTypes.bool,
};

export default Header;
