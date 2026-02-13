export enum Priority {
  A_1 = 1,
  A_2 = 2,
  A_3 = 3,
  B_1 = 4,
  B_2 = 5,
  B_3 = 6,
  C_1 = 7,
  C_2 = 8,
  C_3 = 9,
}

export enum DetailCountType {
  None = 0,
  Set = 1,
  System = 2,
  Number = 3,
}

export enum ProjectCompanyCategory {
  None = 0,
  Leading = 1,
  Demanding = 2,
}

export const PriorityLabel: Record<Priority, string> = {
  [Priority.A_1]: "A-1",
  [Priority.A_2]: "A-2",
  [Priority.A_3]: "A-3",
  [Priority.B_1]: "B-1",
  [Priority.B_2]: "B-2",
  [Priority.B_3]: "B-3",
  [Priority.C_1]: "C-1",
  [Priority.C_2]: "C-2",
  [Priority.C_3]: "C-3",
};

export const DetailCountTypeLabel: Record<DetailCountType, string> = {
  [DetailCountType.None]: "Yoxdur",
  [DetailCountType.Set]: "Dəst",
  [DetailCountType.System]: "Sistem",
  [DetailCountType.Number]: "Ədəd",
};

export const ProjectCompanyCategoryLabel: Record<ProjectCompanyCategory, string> = {
  [ProjectCompanyCategory.None]: "Yoxdur",
  [ProjectCompanyCategory.Leading]: "Aparıcı",
  [ProjectCompanyCategory.Demanding]: "Tələbkar",
};

export interface CompanyGetDTO {
  id: number;
  name: string;
  alias: string;
}

export interface CompanyPostDTO {
  name: string;
  alias: string;
}

export interface CompanyPutDTO {
  id: number;
  name: string;
  alias: string;
}

export interface PlanGetDTO {
  id: number;
  name: string;
  startYear: number;
  endYear: number;
}

export interface PlanPostDTO {
  name: string;
  startYear: number;
  endYear: number;
}

export interface PlanPutDTO {
  id: number;
  name: string;
  startYear: number;
  endYear: number;
}

export interface StateGetDTO {
  id: number;
  name: string;
  sequence: number;
  isInitial: boolean;
}

export interface StatePostDTO {
  name: string;
  sequence: number;
  isInitial: boolean;
}

export interface StatePutDTO {
  id: number;
  name: string;
  sequence: number;
  isInitial: boolean;
}

export interface FunctionalFieldGetDTO {
  id: number;
  name: string;
  code: string;
  serialNumber: number;
}

export interface FunctionalFieldPostDTO {
  name: string;
  code: string;
  serialNumber: number;
}

export interface FunctionalFieldPutDTO {
  id: number;
  name: string;
  code: string;
  serialNumber: number;
}

export interface DetailGetDTO {
  id: number;
  name: string;
  code: string;
  functionalFieldGetDTO: FunctionalFieldGetDTO | null;
}

export interface DetailPostDTO {
  name: string;
  code: string;
  functionalFieldId: number;
}

export interface DetailPutDTO {
  id: number;
  name: string;
  code: string;
  functionalFieldId: number;
}

export interface ProjectGetDTO {
  id: number;
  name: string;
  planGetDTO: PlanGetDTO | null;
  coordinatorCompanyGetDTO: CompanyGetDTO | null;
  priority: Priority;
  thirdSurveyScore: number;
  isJoint: boolean;
  note: string | null;
}

export interface ProjectSummaryGetDTO extends ProjectGetDTO {
  currentStateGetDTO: StateGetDTO | null;
  projectDetailCount: number;
  projectCompanyCount: number;
  projectFileCount: number;
}

export interface ProjectPostDTO {
  name: string;
  planId: number;
  coordinatorCompanyId: number;
  priority: Priority;
  thirdSurveyScore: number;
  isJoint: boolean;
  note: string;
}

export interface ProjectPutDTO {
  id: number;
  name: string;
  planId: number;
  coordinatorCompanyId: number;
  priority: Priority;
  thirdSurveyScore: number;
  isJoint: boolean;
  note: string;
}

export interface ProjectFilterDTO {
  planIds?: number[] | null;
  coordinatorCompanyIds?: number[] | null;
  priorities?: Priority[] | null;
  stateIds?: number[] | null;
  isJoint?: boolean | null;
  thirdSurveyScoreMin?: number | null;
  thirdSurveyScoreMax?: number | null;
  createdFrom?: string | null;
  createdTo?: string | null;
  searchTerm?: string | null;
}

export interface ProjectCompanyGetDTO {
  id: number;
  projectGetDTO: ProjectGetDTO | null;
  companyGetDTO: CompanyGetDTO | null;
  category: ProjectCompanyCategory;
}

export interface ProjectCompanyPostDTO {
  projectId: number;
  companyId: number;
  category: ProjectCompanyCategory;
}

export interface ProjectCompanyPutDTO {
  id: number;
  projectId: number;
  companyId: number;
  category: ProjectCompanyCategory;
}

export interface ProjectDetailGetDTO {
  id: number;
  serialNumber: number;
  approximatePrice: number;
  totalCount: number;
  detailCountType: DetailCountType;
  projectGetDTO: ProjectGetDTO | null;
  detailGetDTO: DetailGetDTO | null;
}

export interface ProjectDetailPostDTO {
  approximatePrice: number;
  totalCount: number;
  detailCountType: DetailCountType;
  projectId: number;
  detailId: number;
}

export interface ProjectDetailPutDTO {
  id: number;
  serialNumber: number;
  approximatePrice: number;
  totalCount: number;
  detailCountType: DetailCountType;
  projectId: number;
  detailId: number;
}

export interface ProjectDetailCompanyGetDTO {
  id: number;
  companyGetDTO: CompanyGetDTO | null;
  projectDetailGetDTO: ProjectDetailGetDTO | null;
}

export interface ProjectDetailCompanyPostDTO {
  companyId: number;
  projectDetailId: number;
}

export interface ProjectDetailCompanyPutDTO {
  id: number;
  companyId: number;
  projectDetailId: number;
}

export interface ProjectDetailCompanyStateGetDTO {
  id: number;
  stateGetDTO: StateGetDTO | null;
  projectDetailCompanyGetDTO: ProjectDetailCompanyGetDTO | null;
  rejectionNote: string | null;
}

export interface ProjectDetailCompanyStatePostDTO {
  stateId: number;
  projectDetailCompanyId: number;
  rejectionNote?: string | null;
}

export interface ProjectDetailCompanyYearGetDTO {
  id: number;
  year: number;
  count: number;
  projectDetailCompanyGetDTO: ProjectDetailCompanyGetDTO | null;
}

export interface ProjectDetailCompanyYearPostDTO {
  year: number;
  count: number;
  projectDetailCompanyId: number;
}

export interface ProjectDetailCompanyYearPutDTO {
  id: number;
  year: number;
  count: number;
  projectDetailCompanyId: number;
}

export interface ProjectFileGetDTO {
  id: number;
  projectGetDTO: ProjectGetDTO | null;
  fileName: string;
  contentType: string;
  storedPath: string;
  fileSize: number;
  privacyLevel: number;
  createdAt: string;
}

export interface ProjectStateGetDTO {
  id: number;
  projectGetDTO: ProjectGetDTO | null;
  stateGetDTO: StateGetDTO | null;
  rejectionNote: string | null;
}

export interface ProjectStatePostDTO {
  projectId: number;
  stateId: number;
  rejectionNote?: string | null;
}

export interface ProjectStateDegradeDTO {
  projectId: number;
  stateId: number;
  rejectionNote?: string | null;
}

export interface TokenResponseDTO {
  accessToken: string;
  refreshToken: string;
  expireDate: string;
}

export interface LoginDTO {
  userName: string;
  password: string;
}

export interface RefreshTokenDTO {
  accessToken: string;
  refreshToken: string;
}

export interface UserGetDTO {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  deletedAt: string | null;
  roles: string[];
  companies: string[];
  privacyLevel: string | null;
}

export interface UserPostDTO {
  username: string;
  email: string;
  password: string;
  companyIds: string[] | null;
  roleId: number;
  privacyLevel: number;
}

export interface UserPutDTO {
  username: string;
  email: string;
  companyIds: string[] | null;
  roleId: number;
  privacyLevel: number;
}

export interface RoleGetDTO {
  id: number;
  name: string;
}

export interface ClaimGetDTO {
  name: string;
  type: string;
}

export interface EnumsResponse {
  priorities: { id: number; name: string }[];
  detailCountTypes: { id: number; name: string }[];
  projectCompanyCategories: { id: number; name: string }[];
}

export type Role = "Admin" | "Manager" | "Viewer";