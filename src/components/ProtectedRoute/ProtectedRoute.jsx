import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Outlet } from "react-router";

import FullPageSpinner from "../UI/FullPageSpinner/FullPageSpinner";

const ProtectedRoute = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <FullPageSpinner />;

  if (user === null || error) return <Navigate to="/auth" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
