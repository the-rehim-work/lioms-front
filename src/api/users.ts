import client from "./client";
import type { UserGetDTO, UserPostDTO, UserPutDTO, RoleGetDTO } from "@/types";

export const usersApi = {
  getAll: () => client.get<UserGetDTO[]>("users").then((r) => r.data),

  getById: (id: number) =>
    client.get<UserGetDTO>(`users/${id}`).then((r) => r.data),

  create: (dto: UserPostDTO) =>
    client.post<UserGetDTO>("users", dto).then((r) => r.data),

  update: (id: number, dto: UserPutDTO) =>
    client.put<UserGetDTO>(`users/${id}`, dto).then((r) => r.data),

  toggleActive: (id: number, isActive: boolean) =>
    client
      .put<UserGetDTO>(`users/${id}/active`, { isActive })
      .then((r) => r.data),

  changePassword: (id: number, password: string) =>
    client
      .put<UserGetDTO>(`users/${id}/password`, { password })
      .then((r) => r.data),

  getRoles: () => client.get<RoleGetDTO[]>("users/roles").then((r) => r.data),
};