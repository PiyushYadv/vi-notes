import { createContext, useContext, type ReactNode } from "react";
import { useUser } from "../features/authentication/useUser";
import { useLogin } from "../features/authentication/useLogin";
import { useSignup } from "../features/authentication/useSignup";
import { useLogout } from "../features/authentication/useLogout";

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

// ---- Context type ----
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: LoginInput, options?: { onSuccess?: () => void }) => void;
  signup: (data: SignupInput, options?: { onSuccess?: () => void }) => void;
  logout: () => void;

  isLoggingIn: boolean;
  isSigningUp: boolean;
  isLoggingOut: boolean;
  loginError: string | null;
  signupError: string | null;
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

  const login = (data: LoginInput, options?: { onSuccess?: () => void }) => {
    loginMutation(data, options);
  };

  const signup = (data: SignupInput, options?: { onSuccess?: () => void }) => {
    signupMutation(data, options);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        isLoggingIn,
        isSigningUp,
        isLoggingOut,
        loginError,
        signupError,
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
