import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SignupInput, User } from "../../contexts/AuthContext";
import { signupApi } from "../../services/authApi";
import { getAuthErrorMessage } from "./authError";

export function useSignup() {
  const queryClient = useQueryClient();

  const {
    mutate: signup,
    isPending: isLoading,
    error,
  } = useMutation<
    User | null,
    Error,
    SignupInput
  >({
    mutationFn: signupApi,
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
    },
  });

  return {
    signup,
    isLoading,
    error: error ? getAuthErrorMessage(error, "Signup failed. Please try again.") : null,
  };
}
