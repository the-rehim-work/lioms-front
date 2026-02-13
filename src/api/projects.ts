import client from "./client";
import type {
  ProjectGetDTO,
  ProjectSummaryGetDTO,
  ProjectPostDTO,
  ProjectPutDTO,
  ProjectFilterDTO,
} from "@/types";

export const projectsApi = {
  summaries: () =>
    client
      .get<{ getDTOs: ProjectSummaryGetDTO[] }>("projects/summaries")
      .then((r) => r.data.getDTOs ?? r.data),

  filter: (dto: ProjectFilterDTO) =>
    client
      .post<{ getDTOs: ProjectSummaryGetDTO[] }>("projects/summaries/filter", dto)
      .then((r) => r.data.getDTOs ?? r.data),

  getById: (id: number) =>
    client
      .get<{ getDTO: ProjectGetDTO }>(`projects/${id}`)
      .then((r) => r.data.getDTO ?? r.data),

  create: (dto: ProjectPostDTO) =>
    client.post("projects", dto).then((r) => r.data),

  update: (id: number, dto: ProjectPutDTO) =>
    client.put(`projects/${id}`, dto).then((r) => r.data),

  remove: (id: number) =>
    client.delete(`projects/${id}`).then((r) => r.data),
};