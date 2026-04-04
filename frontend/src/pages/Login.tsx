import { Navigate, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "../features/authentication/LoginForm";
import Spinner from "../components/Spinner";

export default function Login() {
  const { isAuthenticated, isLoading, isLoggingIn, isSigningUp } = useAuth();

  if (isLoading || isLoggingIn || isSigningUp) return <Spinner />;

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="app-container">
      <h2 className="app-title">Login</h2>

      <LoginForm />

      <div className="auth-switch">
        Don't have an account?{" "}
        <Link to="/signup" className="auth-link">
          Signup
        </Link>
      </div>
    </div>
  );
}
