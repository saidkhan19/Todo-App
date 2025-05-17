import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";

import { CircleCheckBig } from "lucide-react";
import styles from "./Auth.module.scss";
import googleIcon from "../../assets/icons/google.png";
import SpinnerBox from "../UI/SpinnerBox/SpinnerBox";
import { auth } from "../../config/firebase";
import useSignInAnonymously from "../../hooks/useSignInAnonymously";
import useLinkAnonymousUserWithGoogle from "../../hooks/useLinkAnonymousUserWithGoogle";

const Auth = () => {
  const [signInWithGoogle, _gUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);
  const [signInAnonymously, _aUser, anonLoading, anonError] =
    useSignInAnonymously();
  const [linkAnonymousUser, _lUser, linkLoading, linkError] =
    useLinkAnonymousUserWithGoogle();

  // useNotification(googleError);
  // useNotification(anonError);
  // useNotification(linkError);

  const navigate = useNavigate();

  const handleRegisterWithGoogle = async () => {
    let userCredentials;
    if (auth.currentUser?.isAnonymous) {
      userCredentials = await linkAnonymousUser();
    } else {
      userCredentials = await signInWithGoogle();
    }
    if (userCredentials) navigate("/");
  };

  const handleSignInAnonymously = async () => {
    let userCredentials = await signInAnonymously();
    if (userCredentials) navigate("/");
  };

  const isLoading = googleLoading || anonLoading || linkLoading;

  return (
    <div className={`${styles["container"]}`}>
      <main className={`page-background ${styles["surface"]}`}>
        <h1 className="sr-only">Войдите в свой аккаунт</h1>
        <div className={styles["logo"]}>
          <CircleCheckBig size={46} stroke="currentColor" />
          <p>Задачник</p>
        </div>
        <button
          className={`btn ${styles["btn-sign-in"]}`}
          disabled={isLoading}
          onClick={handleRegisterWithGoogle}
        >
          <img src={googleIcon} alt="Google Logo" />
          <span>Войти с помощью Google</span>
        </button>
        <button
          className={`btn ${styles["btn-continue"]}`}
          disabled={isLoading}
          onClick={handleSignInAnonymously}
        >
          Продолжить без аккаунта
        </button>
        {isLoading && (
          <div className={styles["indicator"]}>
            <SpinnerBox />
          </div>
        )}
      </main>
    </div>
  );
};

export default Auth;
