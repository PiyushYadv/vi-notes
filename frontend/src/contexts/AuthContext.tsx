import { createContext, useContext, type ReactNode } from "react";
import { useUser } from "../features/authentication/useUser";
import { useLogin } from "../features/authentication/useLogin";
import { useSignup } from "../features/authentication/useSignup";
import { useLogout } from "../features/authentication/useLogout";
import { useForgotPassword } from "../features/authentication/useForgotPassword";
import { useResetPassword } from "../features/authentication/useResetPassword";

// ---- User type ----
export type User = {
  id: string;
  name: string;
  email: string;
};

export type SignupInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
  passwordConfirm: string;
};

// ---- Context type ----
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: LoginInput, options?: { onSuccess?: () => void }) => void;
  signup: (data: SignupInput, options?: { onSuccess?: () => void }) => void;
  forgotPassword: (
    data: ForgotPasswordInput,
    options?: { onSuccess?: (message: string) => void },
  ) => void;
  resetPassword: (
    data: ResetPasswordInput,
    options?: { onSuccess?: () => void },
  ) => void;
  logout: () => void;

  isLoggingIn: boolean;
  isSigningUp: boolean;
  isLoggingOut: boolean;
  isForgettingPassword: boolean;
  isResettingPassword: boolean;
  loginError: string | null;
  signupError: string | null;
  forgotPasswordError: string | null;
  resetPasswordError: string | null;
  forgotPasswordMessage: string | null;
};

// ---- Context ----
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---- Provider props ----
type AuthProviderProps = {
  children: ReactNode;
};

// ---- Provider ----
export function AuthProvider({ children }: AuthProviderProps) {
  const { user, isAuthenticated, isLoading } = useUser();

  const {
    login: loginMutation,
    isLoading: isLoggingIn,
    error: loginError,
  } = useLogin();
  const {
    signup: signupMutation,
    isLoading: isSigningUp,
    error: signupError,
  } = useSignup();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const {
    forgotPassword: forgotPasswordMutation,
    isLoading: isForgettingPassword,
    error: forgotPasswordError,
    message: forgotPasswordMessage,
  } = useForgotPassword();
  const {
    resetPassword: resetPasswordMutation,
    isLoading: isResettingPassword,
    error: resetPasswordError,
  } = useResetPassword();

  const login = (data: LoginInput, options?: { onSuccess?: () => void }) => {
    loginMutation(data, options);
  };

  const signup = (data: SignupInput, options?: { onSuccess?: () => void }) => {
    signupMutation(data, options);
  };

  const forgotPassword = (
    data: ForgotPasswordInput,
    options?: { onSuccess?: (message: string) => void },
  ) => {
    forgotPasswordMutation(data, {
      onSuccess: (message) => options?.onSuccess?.(message),
    });
  };

  const resetPassword = (
    data: ResetPasswordInput,
    options?: { onSuccess?: () => void },
  ) => {
    resetPasswordMutation(data, options);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        forgotPassword,
        resetPassword,
        logout,
        isLoggingIn,
        isSigningUp,
        isLoggingOut,
        isForgettingPassword,
        isResettingPassword,
        loginError,
        signupError,
        forgotPasswordError,
        resetPasswordError,
        forgotPasswordMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---- Hook ----
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
