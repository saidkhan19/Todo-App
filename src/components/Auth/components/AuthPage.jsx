import { useContext } from "react";
import { CircleCheckBig } from "lucide-react";

import styles from "../Auth.module.scss";
import { AuthContext } from "../context";
import SpinnerBox from "../../UI/SpinnerBox";
import SignInWithGoogleButton from "./SignInWithGoogleButton";
import SignInAnonymouslyButton from "./SignInAnonymouslyButton";
import SignOutButton from "./SignOutButton";

const AuthPage = () => {
  const { user, isLoading } = useContext(AuthContext);

  return (
    <div className={`${styles["container"]}`}>
      <main
        className={`${styles["content-surface"]} ${styles["content-container"]}`}
      >
        <h1 className="sr-only">Войдите в свой аккаунт</h1>
        <div className={styles["logo"]}>
          <CircleCheckBig size={46} stroke="currentColor" />
          <p>Задачник</p>
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
