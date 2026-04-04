import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import SpinnerMini from "../../components/SpinnerMini";

export type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupForm() {
  const { signup, isSigningUp: isLoading, signupError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<SignupFormValues>();

  function onSubmit(data: SignupFormValues) {
    const { name, email, password } = data;
    signup({ name, email, password }, { onSuccess: () => reset() });
  }

  return (
    <form className="note-form" onSubmit={handleSubmit(onSubmit)}>
      <input
        className={errors.name ? "input-error" : ""}
        placeholder="Name"
        autoComplete="name"
        disabled={isLoading}
        {...register("name", { required: "Name required" })}
      />
      {errors.name && <span className="form-error">{errors.name.message}</span>}

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
        autoComplete="new-password"
        disabled={isLoading}
        {...register("password", { required: "Password required" })}
      />
      {errors.password && (
        <span className="form-error">{errors.password.message}</span>
      )}

      <input
        type="password"
        className={errors.password ? "input-error" : ""}
        placeholder="Confirm Password"
        autoComplete="new-password"
        disabled={isLoading}
        {...register("confirmPassword", {
          required: "This field is required",
          validate: (value) =>
            value === getValues().password || "Passwords need to match",
        })}
      />
      {errors.confirmPassword && (
        <span className="form-error">{errors.confirmPassword.message}</span>
      )}

      {signupError && <span className="form-error">{signupError}</span>}

      <button disabled={isLoading}>
        {isLoading ? <SpinnerMini /> : "Signup"}
      </button>
    </form>
  );
}
