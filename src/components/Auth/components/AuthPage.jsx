import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { CircleCheckBig } from "lucide-react";

import styles from "../Auth.module.scss";
import { AuthContext } from "../context";
import SpinnerBox from "@/components/UI/SpinnerBox";
import SignInWithGoogleButton from "./SignInWithGoogleButton";
import SignInAnonymouslyButton from "./SignInAnonymouslyButton";
import SignOutButton from "./SignOutButton";

const AuthPage = () => {
  const { user, isLoading } = useContext(AuthContext);
  const { t } = useTranslation(["common", "auth"]);

  return (
    <div className={`${styles["container"]}`}>
      <main
        className={`${styles["content-surface"]} ${styles["content-container"]}`}
      >
        <h1 className="sr-only">{t("auth:pageTitle")}</h1>
        <div className={styles["logo"]}>
          <CircleCheckBig size={46} stroke="currentColor" />
          <p>{t("common:appTitle")}</p>
        </div>
        <SignInWithGoogleButton />
        <SignInAnonymouslyButton />
        {user?.isAnonymous && <SignOutButton />}
        {isLoading && (
          <div className={styles["indicator"]}>
            <SpinnerBox />
          </div>
        )}
      </main>
    </div>
  );
};

export default AuthPage;
