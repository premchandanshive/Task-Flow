import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/UserContext.jsx";

function PublicRoute() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <div className="screen-loader">Checking your session...</div>;
  }

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default PublicRoute;
