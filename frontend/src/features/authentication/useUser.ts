import { useQuery } from "@tanstack/react-query";
import { getMeApi } from "../../services/authApi";

export function useUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getMeApi,
    retry: false,
  });

  return { user: user ?? null, isLoading, isAuthenticated: !!user };
}
