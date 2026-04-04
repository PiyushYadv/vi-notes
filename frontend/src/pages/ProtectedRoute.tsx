import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading, isLoggingIn, isSigningUp } = useAuth();

  if (isLoading || isLoggingIn || isSigningUp) return <Spinner />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
