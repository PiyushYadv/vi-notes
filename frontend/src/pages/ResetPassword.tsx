import { Link, Navigate, useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import Spinner from "../components/Spinner";
import SpinnerMini from "../components/SpinnerMini";
import { useAuth } from "../contexts/AuthContext";

type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const {
    isLoading,
    isAuthenticated,
    resetPassword,
    isResettingPassword,
    resetPasswordError,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ResetPasswordFormValues>();

  if (isLoading) return <Spinner />;
  if (!token) return <Navigate to="/forgot-password" replace />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  const resetToken = token;

  function onSubmit(data: ResetPasswordFormValues) {
    resetPassword(
      {
        token: resetToken,
        password: data.password,
        passwordConfirm: data.confirmPassword,
      },
      {
        onSuccess: () => navigate("/", { replace: true }),
      },
    );
  }

  return (
    <div className="app-container auth-page">
      <h2 className="app-title">Reset Password</h2>
      <p className="auth-description">
        Set a new password for your account using the secure link from your
        email.
      </p>

      <form className="note-form" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="password"
          className={errors.password ? "input-error" : ""}
          placeholder="New password"
          autoComplete="new-password"
          disabled={isResettingPassword}
          {...register("password", {
            required: "Password required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          })}
        />
        {errors.password && (
          <span className="form-error">{errors.password.message}</span>
        )}

        <input
          type="password"
          className={errors.confirmPassword ? "input-error" : ""}
          placeholder="Confirm new password"
          autoComplete="new-password"
          disabled={isResettingPassword}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === getValues().password || "Passwords need to match",
          })}
        />
        {errors.confirmPassword && (
          <span className="form-error">{errors.confirmPassword.message}</span>
        )}

        {resetPasswordError && (
          <span className="form-error">{resetPasswordError}</span>
        )}

        <button disabled={isResettingPassword}>
          {isResettingPassword ? <SpinnerMini /> : "Reset password"}
        </button>
      </form>

      <div className="auth-switch">
        Need another email?{" "}
        <Link to="/forgot-password" className="auth-link">
          Request a new reset link
        </Link>
      </div>
    </div>
  );
}
