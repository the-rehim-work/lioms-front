import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/stores/auth";
import type { LoginDTO } from "@/types";

export function useMe() {
  const { isAuthenticated, setUser } = useAuthStore();
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const user = await authApi.me();
      setUser(user);
      return user;
    },
    enabled: isAuthenticated(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogin() {
  const { setTokens, setUser } = useAuthStore();
  const navigate = useNavigate();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: LoginDTO) => authApi.login(dto),
    onSuccess: async (data) => {
      setTokens(data.accessToken, data.refreshToken);
      const user = await authApi.me();
      setUser(user);
      qc.setQueryData(["me"], user);
      navigate("/");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: string } })?.response?.data ??
        "Giriş uğursuz oldu";
      toast.error(String(msg));
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logout();
      qc.clear();
      navigate("/login");
    },
  });
}