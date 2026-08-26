import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { User } from "@/types";
import { userKeys } from "./queryKeys";

export interface UserStats {
  total_orders: number;
  total_spent: number;
}

// Asks the backend who's logged in via the httpOnly session cookie - there's
// no token client-side to check, so this is the only way to know.
export function useCurrentUser(enabled: boolean) {
  return useQuery<User>({
    queryKey: userKeys.me(),
    queryFn: async () => {
      const response = await api.get<{ data: User }>("/auth/me");
      return response.data.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useUserStats(enabled: boolean = true) {
  return useQuery<UserStats>({
    queryKey: userKeys.stats(),
    queryFn: async () => {
      const response = await api.get<{ data: UserStats }>("/user/stats");
      return response.data.data;
    },
    enabled,
    staleTime: 60 * 1000,
  });
}
