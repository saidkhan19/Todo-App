import AuthProvider from "./AuthProvider";
import AuthPage from "./components/AuthPage";

const Auth = () => {
  return (
    <AuthProvider>
      <AuthPage />
    </AuthProvider>
  );
};

export default Auth;
