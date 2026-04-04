import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "../../services/authApi";

export function useLogout() {
  const queryClient = useQueryClient();

  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
    },
  });

  return { logout, isLoading };
}
