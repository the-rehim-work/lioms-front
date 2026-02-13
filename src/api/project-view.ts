import client from "./client";
import type {
  ProjectCompanyGetDTO,
  ProjectCompanyPostDTO,
  ProjectCompanyPutDTO,
  ProjectDetailGetDTO,
  ProjectDetailPostDTO,
  ProjectDetailPutDTO,
  ProjectDetailCompanyGetDTO,
  ProjectDetailCompanyPostDTO,
  ProjectDetailCompanyPutDTO,
  ProjectDetailCompanyStateGetDTO,
  ProjectDetailCompanyStatePostDTO,
  ProjectDetailCompanyYearGetDTO,
  ProjectDetailCompanyYearPostDTO,
  ProjectDetailCompanyYearPutDTO,
  ProjectFileGetDTO,
  ProjectStateGetDTO,
  ProjectStatePostDTO,
  ProjectStateDegradeDTO,
} from "@/types";

export const projectCompaniesApi = {
  getByProjectId: (projectId: number) =>
    client
      .get<{ getDTOs: ProjectCompanyGetDTO[] }>(`projectcompanies/project/${projectId}`)
      .then((r) => r.data.getDTOs ?? r.data),

  create: (dto: ProjectCompanyPostDTO) =>
    client.post("projectcompanies", dto).then((r) => r.data),

  update: (id: number, dto: ProjectCompanyPutDTO) =>
    client.put(`projectcompanies/${id}`, dto).then((r) => r.data),

  remove: (id: number) =>
    client.delete(`projectcompanies/${id}`).then((r) => r.data),
};

export const projectDetailsApi = {
  getByProjectId: (projectId: number) =>
    client
      .get<{ getDTOs: ProjectDetailGetDTO[] }>(`projectdetails/project/${projectId}`)
      .then((r) => r.data.getDTOs ?? r.data),

  create: (dto: ProjectDetailPostDTO) =>
    client.post("projectdetails", { dto }).then((r) => r.data),

  update: (id: number, dto: ProjectDetailPutDTO) =>
    client.put(`projectdetails/${id}`, dto).then((r) => r.data),

  remove: (id: number) =>
    client.delete(`projectdetails/${id}`).then((r) => r.data),
};

export const projectFilesApi = {
  getByProjectId: (projectId: number) =>
    client
      .get<{ getDTOs: ProjectFileGetDTO[] }>(`projectfiles/project/${projectId}`)
      .then((r) => r.data.getDTOs ?? r.data),

  upload: (projectId: number, file: File, privacyLevel: number) => {
    const form = new FormData();
    form.append("projectId", projectId.toString());
    form.append("file", file);
    form.append("privacyLevel", privacyLevel.toString());
    return client
      .post("projectfiles", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  remove: (id: number) =>
    client.delete(`projectfiles/${id}`).then((r) => r.data),

  downloadUrl: (id: number) =>
    `${import.meta.env.VITE_API_URL}projectfiles/download/${id}`,
};

export const projectStatesApi = {
  getByProjectId: (projectId: number) =>
    client
      .get<{ getDTOs: ProjectStateGetDTO[] }>(`projectstates/project/${projectId}`)
      .then((r) => r.data.getDTOs ?? r.data),

  create: (dto: ProjectStatePostDTO) =>
    client.post("projectstates", dto).then((r) => r.data),

  degrade: (dto: ProjectStateDegradeDTO) =>
    client.post("projectstates/degrade", dto).then((r) => r.data),
};

export const pdcApi = {
  getByProjectDetailId: (projectDetailId: number) =>
    client
      .get<{ getDTOs: ProjectDetailCompanyGetDTO[] }>(
        `projectdetailcompanies/project-Detail/${projectDetailId}`
      )
      .then((r) => r.data.getDTOs ?? r.data),

  create: (dto: ProjectDetailCompanyPostDTO) =>
    client.post("projectdetailcompanies", dto).then((r) => r.data),

  update: (id: number, dto: ProjectDetailCompanyPutDTO) =>
    client.put(`projectdetailcompanies/${id}`, dto).then((r) => r.data),

  remove: (id: number) =>
    client.delete(`projectdetailcompanies/${id}`).then((r) => r.data),
};

export const pdcStatesApi = {
  getByPdcId: (pdcId: number) =>
    client
      .get<{ getDTOs: ProjectDetailCompanyStateGetDTO[] }>(
        `projectdetailcompanystates/project-Detail-Company/${pdcId}`
      )
      .then((r) => r.data.getDTOs ?? r.data),

  create: (dto: ProjectDetailCompanyStatePostDTO) =>
    client.post("projectdetailcompanystates", dto).then((r) => r.data),

  remove: (id: number) =>
    client.delete(`projectdetailcompanystates/${id}`).then((r) => r.data),
};

export const pdcYearsApi = {
  getByProjectDetailId: (projectDetailId: number) =>
    client
      .get<{ getDTOs: ProjectDetailCompanyYearGetDTO[] }>(
        `projectdetailcompanyyears/project-detail/${projectDetailId}`
      )
      .then((r) => r.data.getDTOs ?? r.data),

  getByPdcId: (pdcId: number) =>
    client
      .get<{ getDTOs: ProjectDetailCompanyYearGetDTO[] }>(
        `projectdetailcompanyyears/project-Detail-Company/${pdcId}`
      )
      .then((r) => r.data.getDTOs ?? r.data),

  create: (dto: ProjectDetailCompanyYearPostDTO) =>
    client.post("projectdetailcompanyyears", dto).then((r) => r.data),

  update: (id: number, dto: ProjectDetailCompanyYearPutDTO) =>
    client.put(`projectdetailcompanyyears/${id}`, dto).then((r) => r.data),

  remove: (id: number) =>
    client.delete(`projectdetailcompanyyears/${id}`).then((r) => r.data),
};