import client, { baseURL } from "./client";
import { R } from "./routes";
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

type Wrapped<T> = { getDTOs: T[] };

function unwrapList<T>(data: Wrapped<T> | T[]): T[] {
  return (data as Wrapped<T>).getDTOs ?? (data as T[]);
}

export const projectCompaniesApi = {
  getByProjectId: (projectId: number) =>
    client
      .get<Wrapped<ProjectCompanyGetDTO>>(R.projectCompanies.byProjectId(projectId))
      .then((r) => unwrapList(r.data)),

  getByCompanyId: (companyId: number) =>
    client
      .get<Wrapped<ProjectCompanyGetDTO>>(R.projectCompanies.byCompanyId(companyId))
      .then((r) => unwrapList(r.data)),

  getByCategoryId: (categoryId: number) =>
    client
      .get<Wrapped<ProjectCompanyGetDTO>>(R.projectCompanies.byCategoryId(categoryId))
      .then((r) => unwrapList(r.data)),

  create: (dto: ProjectCompanyPostDTO) =>
    client.post(R.projectCompanies.root, dto).then((r) => r.data),

  update: (id: number, dto: ProjectCompanyPutDTO) =>
    client.put(R.projectCompanies.byId(id), dto).then((r) => r.data),

  remove: (id: number) =>
    client.delete(R.projectCompanies.byId(id)).then((r) => r.data),
};

export const projectDetailsApi = {
  getByProjectId: (projectId: number) =>
    client
      .get<Wrapped<ProjectDetailGetDTO>>(R.projectDetails.byProjectId(projectId))
      .then((r) => unwrapList(r.data)),

  getByDetailId: (detailId: number) =>
    client
      .get<Wrapped<ProjectDetailGetDTO>>(R.projectDetails.byDetailId(detailId))
      .then((r) => unwrapList(r.data)),

  getBySerialNumber: (sn: number) =>
    client
      .get<Wrapped<ProjectDetailGetDTO>>(R.projectDetails.serial(sn))
      .then((r) => unwrapList(r.data)),

  getByDetailCountTypeId: (detailCountTypeId: number) =>
    client.get(R.projectDetails.byDetailCountTypeId(detailCountTypeId)).then((r) => r.data),

  create: (dto: ProjectDetailPostDTO) =>
    client.post(R.projectDetails.root, dto).then((r) => r.data),

  update: (id: number, dto: ProjectDetailPutDTO) =>
    client.put(R.projectDetails.byId(id), dto).then((r) => r.data),

  remove: (id: number) =>
    client.delete(R.projectDetails.byId(id)).then((r) => r.data),
};

export const projectFilesApi = {
  getByProjectId: (projectId: number) =>
    client
      .get<Wrapped<ProjectFileGetDTO>>(R.projectFiles.byProjectId(projectId))
      .then((r) => unwrapList(r.data)),

  getByFileName: (name: string) =>
    client
      .get<Wrapped<ProjectFileGetDTO>>(R.projectFiles.byFileName(name))
      .then((r) => unwrapList(r.data)),

  upload: (projectId: number, file: File, privacyLevel: number) => {
    const form = new FormData();
    form.append("projectId", projectId.toString());
    form.append("file", file);
    form.append("privacyLevel", privacyLevel.toString());
    return client
      .post(R.projectFiles.root, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  remove: (id: number) =>
    client.delete(R.projectFiles.byId(id)).then((r) => r.data),

  downloadUrl: (id: number) => `${baseURL}/${R.projectFiles.download(id)}`,
};

export const projectStatesApi = {
  getByProjectId: (projectId: number) =>
    client
      .get<Wrapped<ProjectStateGetDTO>>(R.projectStates.byProjectId(projectId))
      .then((r) => unwrapList(r.data)),

  getByStateId: (stateId: number) =>
    client
      .get<Wrapped<ProjectStateGetDTO>>(R.projectStates.byStateId(stateId))
      .then((r) => unwrapList(r.data)),

  create: (dto: ProjectStatePostDTO) =>
    client.post(R.projectStates.root, dto).then((r) => r.data),

  degrade: (dto: ProjectStateDegradeDTO) =>
    client.post(R.projectStates.degrade, dto).then((r) => r.data),
};

export const pdcApi = {
  getByProjectDetailId: (projectDetailId: number) =>
    client
      .get<Wrapped<ProjectDetailCompanyGetDTO>>(R.projectDetailCompanies.byProjectDetailId(projectDetailId))
      .then((r) => unwrapList(r.data)),

  getByCompanyId: (companyId: number) =>
    client
      .get<Wrapped<ProjectDetailCompanyGetDTO>>(R.projectDetailCompanies.byCompanyId(companyId))
      .then((r) => unwrapList(r.data)),

  create: (dto: ProjectDetailCompanyPostDTO) =>
    client.post(R.projectDetailCompanies.root, dto).then((r) => r.data),

  update: (id: number, dto: ProjectDetailCompanyPutDTO) =>
    client.put(R.projectDetailCompanies.byId(id), dto).then((r) => r.data),

  remove: (id: number) =>
    client.delete(R.projectDetailCompanies.byId(id)).then((r) => r.data),
};

export const pdcStatesApi = {
  getByPdcId: (pdcId: number) =>
    client
      .get<Wrapped<ProjectDetailCompanyStateGetDTO>>(R.projectDetailCompanyStates.byPdcId(pdcId))
      .then((r) => unwrapList(r.data)),

  getByStateId: (stateId: number) =>
    client
      .get<Wrapped<ProjectDetailCompanyStateGetDTO>>(R.projectDetailCompanyStates.byStateId(stateId))
      .then((r) => unwrapList(r.data)),

  create: (dto: ProjectDetailCompanyStatePostDTO) =>
    client.post(R.projectDetailCompanyStates.root, dto).then((r) => r.data),

  remove: (id: number) =>
    client.delete(R.projectDetailCompanyStates.byId(id)).then((r) => r.data),
};

export const pdcYearsApi = {
  getByProjectDetailId: (projectDetailId: number) =>
    client
      .get<Wrapped<ProjectDetailCompanyYearGetDTO>>(R.projectDetailCompanyYears.byProjectDetailId(projectDetailId))
      .then((r) => unwrapList(r.data)),

  getByPdcId: (pdcId: number) =>
    client
      .get<Wrapped<ProjectDetailCompanyYearGetDTO>>(R.projectDetailCompanyYears.byPdcId(pdcId))
      .then((r) => unwrapList(r.data)),

  getByYear: (year: number) =>
    client
      .get<Wrapped<ProjectDetailCompanyYearGetDTO>>(R.projectDetailCompanyYears.byYear(year))
      .then((r) => unwrapList(r.data)),

  create: (dto: ProjectDetailCompanyYearPostDTO) =>
    client.post(R.projectDetailCompanyYears.root, dto).then((r) => r.data),

  update: (id: number, dto: ProjectDetailCompanyYearPutDTO) =>
    client.put(R.projectDetailCompanyYears.byId(id), dto).then((r) => r.data),

  remove: (id: number) =>
    client.delete(R.projectDetailCompanyYears.byId(id)).then((r) => r.data),
};