import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { SignupInput, User } from "../../contexts/AuthContext";
import { signupApi } from "../../services/authApi";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (!error.response) {
      return "We couldn't reach the server. Please make sure the backend is running.";
    }

    return (
      error.response?.data?.message || "Signup failed. Please try again."
    );
  }

  if (error instanceof Error) return error.message;

  return "Signup failed. Please try again.";
}

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

  return { signup, isLoading, error: error ? getErrorMessage(error) : null };
}
