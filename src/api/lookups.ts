import client from "./client";
import type {
  CompanyGetDTO,
  CompanyPostDTO,
  CompanyPutDTO,
  PlanGetDTO,
  PlanPostDTO,
  PlanPutDTO,
  StateGetDTO,
  StatePostDTO,
  StatePutDTO,
  DetailGetDTO,
  DetailPostDTO,
  DetailPutDTO,
  FunctionalFieldGetDTO,
  FunctionalFieldPostDTO,
  FunctionalFieldPutDTO,
  EnumsResponse,
} from "@/types";

function crud<TGet, TPost, TCreate = unknown, TUpdate = unknown>(base: string) {
  return {
    getAll: () =>
      client.get<{ getDTOs: TGet[] }>(base).then((r) => r.data.getDTOs ?? r.data),
    create: (dto: TPost) =>
      client.post<TCreate>(base, dto).then((r) => r.data),
    update: (id: number, dto: TPost) =>
      client.put<TUpdate>(`${base}/${id}`, dto).then((r) => r.data),
    remove: (id: number) => client.delete(`${base}/${id}`).then((r) => r.data),
  };
}

export const companiesApi = crud<CompanyGetDTO, CompanyPostDTO | CompanyPutDTO>("companies");
export const plansApi = crud<PlanGetDTO, PlanPostDTO | PlanPutDTO>("plans");
export const statesApi = crud<StateGetDTO, StatePostDTO | StatePutDTO>("states");
export const detailsApi = crud<DetailGetDTO, DetailPostDTO | DetailPutDTO>("details");
export const functionalFieldsApi = crud<FunctionalFieldGetDTO, FunctionalFieldPostDTO | FunctionalFieldPutDTO>("functionalfields");

export const enumsApi = {
  getAll: () => client.get<EnumsResponse>("enums").then((r) => r.data),
};