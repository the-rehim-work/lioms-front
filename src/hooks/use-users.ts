import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "@/api/users";
import type { UserPostDTO, UserPutDTO } from "@/types";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
  });
}

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => usersApi.getRoles(),
    staleTime: Infinity,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UserPostDTO) => usersApi.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("İstifadəçi yaradıldı");
    },
    onError: () => toast.error("İstifadəçi yaradıla bilmədi"),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UserPutDTO }) =>
      usersApi.update(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("İstifadəçi yeniləndi");
    },
    onError: () => toast.error("İstifadəçi yenilənə bilmədi"),
  });
}

export function useToggleUserActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      usersApi.toggleActive(id, isActive),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("İstifadəçi statusu dəyişdirildi");
    },
    onError: () => toast.error("Status dəyişdirilə bilmədi"),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      usersApi.changePassword(id, password),
    onSuccess: () => toast.success("Şifrə dəyişdirildi"),
    onError: () => toast.error("Şifrə dəyişdirilə bilmədi"),
  });
}