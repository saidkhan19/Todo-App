import { Link, NavLink, Outlet } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  LayoutGrid,
  FolderKanban,
  FileCheck2,
  User,
  BadgeInfo,
} from "lucide-react";

import styles from "./Layout.module.scss";
import { auth } from "../../config/firebase";
import Header from "./Header";
import Footer from "./Footer";
import Warning from "./Warning";

const Layout = () => {
  const [user] = useAuthState(auth);

  return (
    <div className={styles["container"]}>
      <Header isAnonymous={Boolean(user?.isAnonymous)} />
      <main className={styles["main-content"]}>
        <Outlet />
      </main>
      {user?.isAnonymous && <Warning />}
      <Footer />
    </div>
  );
};

export default Layout;
