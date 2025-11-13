import { useContext } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import styles from "../Auth.module.scss";
import googleIcon from "@/assets/icons/google.png";
import useNotificationStore from "@/store/useNotificationStore";
import { AuthContext } from "../context";

const SignInWithGoogleButton = () => {
  const { isLoading, handleRegisterWithGoogle } = useContext(AuthContext);
  const notify = useNotificationStore((state) => state.notify);
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  const handleGoogleSignIn = async () => {
    const userCredentials = await handleRegisterWithGoogle();
    if (userCredentials) {
      navigate("/");
      notify({ type: "success", message: t("message.successSignIn") });
    }
  };

  return (
    <button
      className={`btn ${styles["btn-sign-in"]}`}
      disabled={isLoading}
      onClick={handleGoogleSignIn}
    >
      <img src={googleIcon} alt="Google Logo" />
      <span>{t("signInWithGoogle")}</span>
    </button>
  );
};

export default SignInWithGoogleButton;
