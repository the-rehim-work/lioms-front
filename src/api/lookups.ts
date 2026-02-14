import client from "./client";
import { R } from "./routes";
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

type Wrapped<T> = { getDTOs: T[] };
type SingleWrapped<T> = { getDTO: T };

function unwrapList<T>(data: Wrapped<T> | T[]): T[] {
  return (data as Wrapped<T>).getDTOs ?? (data as T[]);
}

export const companiesApi = {
  getAll: () =>
    client.get<Wrapped<CompanyGetDTO>>(R.companies.root).then((r) => unwrapList(r.data)),
  getById: (id: number) =>
    client.get<SingleWrapped<CompanyGetDTO>>(R.companies.byId(id)).then((r) => r.data.getDTO ?? r.data),
  getByName: (name: string) =>
    client.get<Wrapped<CompanyGetDTO>>(R.companies.name(name)).then((r) => unwrapList(r.data)),
  getByAlias: (alias: string) =>
    client.get<Wrapped<CompanyGetDTO>>(R.companies.alias(alias)).then((r) => unwrapList(r.data)),
  create: (dto: CompanyPostDTO) =>
    client.post(R.companies.root, dto).then((r) => r.data),
  update: (id: number, dto: CompanyPutDTO) =>
    client.put(R.companies.byId(id), dto).then((r) => r.data),
  remove: (id: number) =>
    client.delete(R.companies.byId(id)).then((r) => r.data),
};

export const plansApi = {
  getAll: () =>
    client.get<Wrapped<PlanGetDTO>>(R.plans.root).then((r) => unwrapList(r.data)),
  getById: (id: number) =>
    client.get<SingleWrapped<PlanGetDTO>>(R.plans.byId(id)).then((r) => r.data.getDTO ?? r.data),
  getByName: (name: string) =>
    client.get<Wrapped<PlanGetDTO>>(R.plans.name(name)).then((r) => unwrapList(r.data)),
  getByStartYear: (year: number) =>
    client.get<Wrapped<PlanGetDTO>>(R.plans.byStartYear, { params: { year } }).then((r) => unwrapList(r.data)),
  getByEndYear: (year: number) =>
    client.get<Wrapped<PlanGetDTO>>(R.plans.byEndYear, { params: { year } }).then((r) => unwrapList(r.data)),
  create: (dto: PlanPostDTO) =>
    client.post(R.plans.root, dto).then((r) => r.data),
  update: (id: number, dto: PlanPutDTO) =>
    client.put(R.plans.byId(id), dto).then((r) => r.data),
  remove: (id: number) =>
    client.delete(R.plans.byId(id)).then((r) => r.data),
};

export const statesApi = {
  getAll: () =>
    client.get<Wrapped<StateGetDTO>>(R.states.root).then((r) => unwrapList(r.data)),
  getById: (id: number) =>
    client.get<SingleWrapped<StateGetDTO>>(R.states.byId(id)).then((r) => r.data.getDTO ?? r.data),
  getByName: (name: string) =>
    client.get<Wrapped<StateGetDTO>>(R.states.name(name)).then((r) => unwrapList(r.data)),
  create: (dto: StatePostDTO) =>
    client.post(R.states.root, dto).then((r) => r.data),
  update: (id: number, dto: StatePutDTO) =>
    client.put(R.states.byId(id), dto).then((r) => r.data),
  remove: (id: number) =>
    client.delete(R.states.byId(id)).then((r) => r.data),
};

export const detailsApi = {
  getAll: () =>
    client.get<Wrapped<DetailGetDTO>>(R.details.root).then((r) => unwrapList(r.data)),
  getById: (id: number) =>
    client.get<SingleWrapped<DetailGetDTO>>(R.details.byId(id)).then((r) => r.data.getDTO ?? r.data),
  getByName: (name: string) =>
    client.get<Wrapped<DetailGetDTO>>(R.details.name(name)).then((r) => unwrapList(r.data)),
  getByCode: (code: string) =>
    client.get<Wrapped<DetailGetDTO>>(R.details.code(code)).then((r) => unwrapList(r.data)),
  getByFunctionalFieldId: (id: number) =>
    client.get<Wrapped<DetailGetDTO>>(R.details.byFunctionalFieldId(id)).then((r) => unwrapList(r.data)),
  create: (dto: DetailPostDTO) =>
    client.post(R.details.root, dto).then((r) => r.data),
  update: (id: number, dto: DetailPutDTO) =>
    client.put(R.details.byId(id), dto).then((r) => r.data),
  remove: (id: number) =>
    client.delete(R.details.byId(id)).then((r) => r.data),
};

export const functionalFieldsApi = {
  getAll: () =>
    client.get<Wrapped<FunctionalFieldGetDTO>>(R.functionalFields.root).then((r) => unwrapList(r.data)),
  getById: (id: number) =>
    client.get<SingleWrapped<FunctionalFieldGetDTO>>(R.functionalFields.byId(id)).then((r) => r.data.getDTO ?? r.data),
  getByName: (name: string) =>
    client.get<Wrapped<FunctionalFieldGetDTO>>(R.functionalFields.name(name)).then((r) => unwrapList(r.data)),
  getByCode: (code: string) =>
    client.get<Wrapped<FunctionalFieldGetDTO>>(R.functionalFields.code(code)).then((r) => unwrapList(r.data)),
  getBySerialNumber: (sn: number) =>
    client.get<Wrapped<FunctionalFieldGetDTO>>(R.functionalFields.serialNumber(sn)).then((r) => unwrapList(r.data)),
  create: (dto: FunctionalFieldPostDTO) =>
    client.post(R.functionalFields.root, dto).then((r) => r.data),
  update: (id: number, dto: FunctionalFieldPutDTO) =>
    client.put(R.functionalFields.byId(id), dto).then((r) => r.data),
  remove: (id: number) =>
    client.delete(R.functionalFields.byId(id)).then((r) => r.data),
};

export const enumsApi = {
  getAll: () => client.get<EnumsResponse>(R.enums.root).then((r) => r.data),
};