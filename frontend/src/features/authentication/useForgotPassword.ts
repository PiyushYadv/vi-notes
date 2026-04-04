import { useMutation } from "@tanstack/react-query";
import type { ForgotPasswordInput } from "../../services/authApi";
import { forgotPasswordApi } from "../../services/authApi";
import { getAuthErrorMessage } from "./authError";

export function useForgotPassword() {
  const {
    mutate: forgotPassword,
    isPending: isLoading,
    error,
    isSuccess,
    data,
    reset,
  } = useMutation<string, Error, ForgotPasswordInput>({
    mutationFn: forgotPasswordApi,
  });

  return {
    forgotPassword,
    isLoading,
    isSuccess,
    message: data ?? null,
    error: error
      ? getAuthErrorMessage(
          error,
          "We couldn't send the reset email. Please try again.",
        )
      : null,
    reset,
  };
}
