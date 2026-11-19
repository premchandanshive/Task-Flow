import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/UserContext.jsx";

function ProtectedRoute() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <div className="screen-loader">Checking your session...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
