import { useContext } from "react";
import { useNavigate } from "react-router";

import styles from "../Auth.module.scss";
import googleIcon from "../../../assets/icons/google.png";
import { AuthContext } from "../store";
import useNotificationStore from "../../../store/useNotificationStore";

const SignInWithGoogleButton = () => {
  const { isLoading, handleRegisterWithGoogle } = useContext(AuthContext);
  const notify = useNotificationStore((state) => state.notify);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const userCredentials = await handleRegisterWithGoogle();
    if (userCredentials) {
      navigate("/");
      notify({ type: "success", message: "Вход выполнен успешно" });
    }
  };

  return (
    <button
      className={`btn ${styles["btn-sign-in"]}`}
      disabled={isLoading}
      onClick={handleGoogleSignIn}
    >
      <img src={googleIcon} alt="Google Logo" />
      <span>Войти с помощью Google</span>
    </button>
  );
};

export default SignInWithGoogleButton;
