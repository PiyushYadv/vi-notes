import { useState } from "react";
import { Link, Navigate } from "react-router";
import { useForm } from "react-hook-form";
import Spinner from "../components/Spinner";
import SpinnerMini from "../components/SpinnerMini";
import { useAuth } from "../contexts/AuthContext";

type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgotPassword() {
  const {
    isAuthenticated,
    isLoading,
    forgotPassword,
    isForgettingPassword,
    forgotPasswordError,
    forgotPasswordMessage,
  } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(
    forgotPasswordMessage,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>();

  if (isLoading) return <Spinner />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  function onSubmit(data: ForgotPasswordFormValues) {
    setSuccessMessage(null);
    forgotPassword(data, {
      onSuccess: (message) => setSuccessMessage(message),
    });
  }

  return (
    <div className="app-container auth-page">
      <h2 className="app-title">Forgot Password</h2>
      <p className="auth-description">
        Enter the email you used to sign in and we&apos;ll send you a reset
        link.
      </p>

      <form className="note-form" onSubmit={handleSubmit(onSubmit)}>
        <input
          className={errors.email ? "input-error" : ""}
          placeholder="Email"
          autoComplete="email"
          disabled={isForgettingPassword}
          {...register("email", { required: "Email required" })}
        />
        {errors.email && (
          <span className="form-error">{errors.email.message}</span>
        )}

        {forgotPasswordError && (
          <span className="form-error">{forgotPasswordError}</span>
        )}
        {successMessage && <span className="form-success">{successMessage}</span>}

        <button disabled={isForgettingPassword}>
          {isForgettingPassword ? <SpinnerMini /> : "Send reset link"}
        </button>
      </form>

      <div className="auth-switch">
        Remembered your password?{" "}
        <Link to="/login" className="auth-link">
          Back to login
        </Link>
      </div>
    </div>
  );
}
