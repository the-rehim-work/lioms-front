import client from "./client";
import { R } from "./routes";
import type { UserGetDTO, UserPostDTO, UserPutDTO, RoleGetDTO, ClaimGetDTO } from "@/types";

export const usersApi = {
  getAll: () =>
    client.get<UserGetDTO[]>(R.users.root).then((r) => r.data),

  getById: (id: number) =>
    client.get<UserGetDTO>(R.users.byId(id)).then((r) => r.data),

  create: (dto: UserPostDTO) =>
    client.post<UserGetDTO>(R.users.root, dto).then((r) => r.data),

  update: (id: number, dto: UserPutDTO) =>
    client.put<UserGetDTO>(R.users.byId(id), dto).then((r) => r.data),

  toggleActive: (id: number, isActive: boolean) =>
    client
      .put<UserGetDTO>(R.users.active(id), { isActive })
      .then((r) => r.data),

  changePassword: (id: number, password: string) =>
    client
      .put<UserGetDTO>(R.users.password(id), { password })
      .then((r) => r.data),

  getRoles: () =>
    client.get<RoleGetDTO[]>(R.users.roles).then((r) => r.data),

  getClaims: () =>
    client.get<ClaimGetDTO[]>(R.users.claims).then((r) => r.data),
};