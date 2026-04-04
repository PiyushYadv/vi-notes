import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import SpinnerMini from "../../components/SpinnerMini";

export type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const { login, isLoggingIn: isLoading, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>();

  function onSubmit(data: LoginFormValues) {
    login(data, { onSuccess: () => reset() });
  }

  return (
    <form className="note-form" onSubmit={handleSubmit(onSubmit)}>
      <input
        className={errors.email ? "input-error" : ""}
        placeholder="Email"
        autoComplete="email"
        disabled={isLoading}
        {...register("email", { required: "Email required" })}
      />
      {errors.email && (
        <span className="form-error">{errors.email.message}</span>
      )}

      <input
        type="password"
        className={errors.password ? "input-error" : ""}
        placeholder="Password"
        autoComplete="current-password"
        disabled={isLoading}
        {...register("password", { required: "Password required" })}
      />
      {errors.password && (
        <span className="form-error">{errors.password.message}</span>
      )}

      {loginError && <span className="form-error">{loginError}</span>}

      <button disabled={isLoading}>
        {isLoading ? <SpinnerMini /> : "Login"}
      </button>
    </form>
  );
}
