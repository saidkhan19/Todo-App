import { useContext } from "react";
import { useNavigate } from "react-router";

import styles from "../Auth.module.scss";
import { AuthContext } from "../store";

const SignInAnonymouslyButton = () => {
  const { isLoading, handleSignInAnonymously } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAnonymousSignIn = async () => {
    const userCredentials = await handleSignInAnonymously();
    if (userCredentials) navigate("/");
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
