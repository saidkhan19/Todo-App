import { useContext } from "react";
import { useNavigate } from "react-router";

import styles from "../Auth.module.scss";
import { AuthContext } from "../store";
import useNotificationStore from "@/store/useNotificationStore";

const SignInAnonymouslyButton = () => {
  const { isLoading, handleSignInAnonymously } = useContext(AuthContext);
  const notify = useNotificationStore((state) => state.notify);
  const navigate = useNavigate();

  const handleAnonymousSignIn = async () => {
    const userCredentials = await handleSignInAnonymously();
    if (userCredentials) {
      navigate("/");
      notify({ type: "success", message: "Вы вошли в анонимный аккаунт" });
    }
  };

  return (
    <button
      className={`btn ${styles["btn-secondary"]}`}
      disabled={isLoading}
      onClick={handleAnonymousSignIn}
    >
      Продолжить без аккаунта
    </button>
  );
};

export default SignInAnonymouslyButton;
