import client from "./client";
import type {
  LoginDTO,
  TokenResponseDTO,
  UserGetDTO,
  RefreshTokenDTO,
} from "@/types";

export const authApi = {
  login: (dto: LoginDTO) =>
    client.post<TokenResponseDTO>("accounts/Login", dto).then((r) => r.data),

  refresh: (dto: RefreshTokenDTO) =>
    client.post<TokenResponseDTO>("accounts/Refresh", dto).then((r) => r.data),

  me: () => client.get<UserGetDTO>("accounts/me").then((r) => r.data),

  logout: () => client.post("accounts/Logout"),
};