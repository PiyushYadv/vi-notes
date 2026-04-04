import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { LoginInput, User } from "../../contexts/AuthContext";
import { loginApi } from "../../services/authApi";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (!error.response) {
      return "We couldn't reach the server. Please make sure the backend is running.";
    }

    return (
      error.response?.data?.message || "Login failed. Please try again."
    );
  }

  if (error instanceof Error) return error.message;

  return "Login failed. Please try again.";
}

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

  return { login, isLoading, error: error ? getErrorMessage(error) : null };
}
