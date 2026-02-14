import client from "./client";
import { R } from "./routes";
import type {
  LoginDTO,
  TokenResponseDTO,
  UserGetDTO,
  RefreshTokenDTO,
} from "@/types";

export const authApi = {
  login: (dto: LoginDTO) =>
    client.post<TokenResponseDTO>(R.auth.login, dto).then((r) => r.data),

  refresh: (dto: RefreshTokenDTO) =>
    client.post<TokenResponseDTO>(R.auth.refresh, dto).then((r) => r.data),

  me: () => client.get<UserGetDTO>(R.auth.me).then((r) => r.data),

  logout: () => client.post(R.auth.logout),
};