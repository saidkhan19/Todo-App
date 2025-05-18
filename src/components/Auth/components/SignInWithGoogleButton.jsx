import { useContext } from "react";
import { useNavigate } from "react-router";

import styles from "../Auth.module.scss";
import googleIcon from "../../../assets/icons/google.png";
import { AuthContext } from "../store";

const SignInWithGoogleButton = () => {
  const { isLoading, handleRegisterWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const userCredentials = await handleRegisterWithGoogle();
    if (userCredentials) navigate("/");
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
