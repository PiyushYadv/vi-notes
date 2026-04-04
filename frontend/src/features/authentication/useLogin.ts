import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LoginInput, User } from "../../contexts/AuthContext";
import { loginApi } from "../../services/authApi";
import { getAuthErrorMessage } from "./authError";

export function useLogin() {
  const queryClient = useQueryClient();

  const {
    mutate: login,
    isPending: isLoading,
    error,
  } = useMutation<
    User | null,
    Error,
    LoginInput
  >({
    mutationFn: loginApi,
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
    },
  });

  return {
    login,
    isLoading,
    error: error ? getAuthErrorMessage(error, "Login failed. Please try again.") : null,
  };
}
