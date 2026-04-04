import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "../../contexts/AuthContext";
import type { ResetPasswordInput } from "../../services/authApi";
import { resetPasswordApi } from "../../services/authApi";
import { getAuthErrorMessage } from "./authError";

export function useResetPassword() {
  const queryClient = useQueryClient();

  const {
    mutate: resetPassword,
    isPending: isLoading,
    error,
  } = useMutation<User | null, Error, ResetPasswordInput>({
    mutationFn: resetPasswordApi,
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
    },
  });

  return {
    resetPassword,
    isLoading,
    error: error
      ? getAuthErrorMessage(
          error,
          "We couldn't reset your password. Please try again.",
        )
      : null,
  };
}
