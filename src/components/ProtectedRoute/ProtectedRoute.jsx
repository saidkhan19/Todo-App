import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Outlet } from "react-router";

import styles from "./ProtectedRoute.module.scss";
import SpinnerBox from "../UI/SpinnerBox/SpinnerBox";

const ProtectedRoute = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading)
    return (
      <div className={styles["page-container"]}>
        <SpinnerBox size="lg" />
      </div>
    );

  if (user === null || error) return <Navigate to="/auth" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
