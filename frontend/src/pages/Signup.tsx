import { Navigate, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import SignupForm from "../features/authentication/SignupForm";
import Spinner from "../components/Spinner";

export default function Signup() {
  const { isAuthenticated, isLoading, isLoggingIn, isSigningUp } = useAuth();

  if (isLoading || isLoggingIn || isSigningUp) return <Spinner />;

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="app-container">
      <h2 className="app-title">Signup</h2>

      <SignupForm />

      <div className="auth-switch">
        Already have an account?{" "}
        <Link to="/login" className="auth-link">
          Login
        </Link>
      </div>
    </div>
  );
}
