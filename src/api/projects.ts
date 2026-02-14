import client from "./client";
import { R } from "./routes";
import type {
  ProjectGetDTO,
  ProjectSummaryGetDTO,
  ProjectPostDTO,
  ProjectPutDTO,
  ProjectFilterDTO,
} from "@/types";

type Wrapped<T> = { getDTOs: T[] };
type SingleWrapped<T> = { getDTO: T };

function unwrapList<T>(data: Wrapped<T> | T[]): T[] {
  return (data as Wrapped<T>).getDTOs ?? (data as T[]);
}

export const projectsApi = {
  summaries: () =>
    client
      .get<Wrapped<ProjectSummaryGetDTO>>(R.projects.summaries)
      .then((r) => unwrapList(r.data)),

  filter: (dto: ProjectFilterDTO) =>
    client
      .post<Wrapped<ProjectSummaryGetDTO>>(R.projects.summariesFilter, dto)
      .then((r) => unwrapList(r.data)),

  getAll: () =>
    client
      .get<Wrapped<ProjectGetDTO>>(R.projects.root)
      .then((r) => unwrapList(r.data)),

  getById: (id: number) =>
    client
      .get<SingleWrapped<ProjectGetDTO>>(R.projects.byId(id))
      .then((r) => r.data.getDTO ?? r.data),

  getByName: (name: string) =>
    client
      .get<Wrapped<ProjectGetDTO>>(R.projects.name(name))
      .then((r) => unwrapList(r.data)),

  getByPlanId: (planId: number) =>
    client
      .get<Wrapped<ProjectGetDTO>>(R.projects.byPlan(planId))
      .then((r) => unwrapList(r.data)),

  getByCoordinatorCompanyId: (companyId: number) =>
    client
      .get<Wrapped<ProjectGetDTO>>(R.projects.byCoordinator(companyId))
      .then((r) => unwrapList(r.data)),

  getByLeadingCompanyId: (companyId: number) =>
    client
      .get<Wrapped<ProjectGetDTO>>(R.projects.byLeading(companyId))
      .then((r) => unwrapList(r.data)),

  getByDemandingCompanyId: (companyId: number) =>
    client
      .get<Wrapped<ProjectGetDTO>>(R.projects.byDemanding(companyId))
      .then((r) => unwrapList(r.data)),

  getByFunctionalField: (id: number) =>
    client
      .get<Wrapped<ProjectGetDTO>>(R.projects.byFunctionalField(id))
      .then((r) => unwrapList(r.data)),

  getByPriority: (id: number) =>
    client
      .get<Wrapped<ProjectGetDTO>>(R.projects.byPriority(id))
      .then((r) => unwrapList(r.data)),

  getByThirdSurveyScore: (score: number) =>
    client
      .get<Wrapped<ProjectGetDTO>>(R.projects.thirdSurveyScore(score))
      .then((r) => unwrapList(r.data)),

  getByIsJoint: (isJoint: boolean) =>
    client
      .get<Wrapped<ProjectGetDTO>>(R.projects.joint(isJoint))
      .then((r) => unwrapList(r.data)),

  create: (dto: ProjectPostDTO) =>
    client.post(R.projects.root, dto).then((r) => r.data),

  update: (id: number, dto: ProjectPutDTO) =>
    client.put(R.projects.byId(id), dto).then((r) => r.data),

  remove: (id: number) =>
    client.delete(R.projects.byId(id)).then((r) => r.data),
};