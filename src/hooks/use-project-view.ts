import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  projectCompaniesApi,
  projectDetailsApi,
  projectFilesApi,
  projectStatesApi,
  pdcApi,
  pdcYearsApi,
} from "@/api/project-view";
import type {
  ProjectCompanyPostDTO,
  ProjectDetailPostDTO,
  ProjectDetailPutDTO,
  ProjectStatePostDTO,
  ProjectStateDegradeDTO,
  ProjectDetailCompanyPostDTO,
  ProjectDetailCompanyYearPostDTO,
} from "@/types";

export function useProjectCompanies(projectId: number) {
  return useQuery({
    queryKey: ["project-companies", projectId],
    queryFn: () => projectCompaniesApi.getByProjectId(projectId),
    enabled: !!projectId,
  });
}

export function useCreateProjectCompany(projectId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: ProjectCompanyPostDTO) => projectCompaniesApi.create(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["project-companies", projectId] }); toast.success("Şirkət əlavə edildi"); },
    onError: () => toast.error("Şirkət əlavə edilə bilmədi"),
  });
}

export function useDeleteProjectCompany(projectId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => projectCompaniesApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["project-companies", projectId] }); toast.success("Şirkət silindi"); },
    onError: () => toast.error("Şirkət silinə bilmədi"),
  });
}

export function useProjectDetails(projectId: number) {
  return useQuery({
    queryKey: ["project-details", projectId],
    queryFn: () => projectDetailsApi.getByProjectId(projectId),
    enabled: !!projectId,
  });
}

export function useCreateProjectDetail(projectId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: ProjectDetailPostDTO) => projectDetailsApi.create(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["project-details", projectId] }); toast.success("Detal əlavə edildi"); },
    onError: () => toast.error("Detal əlavə edilə bilmədi"),
  });
}

export function useUpdateProjectDetail(projectId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: ProjectDetailPutDTO }) => projectDetailsApi.update(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["project-details", projectId] }); toast.success("Detal yeniləndi"); },
    onError: () => toast.error("Detal yenilənə bilmədi"),
  });
}

export function useDeleteProjectDetail(projectId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => projectDetailsApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["project-details", projectId] }); toast.success("Detal silindi"); },
    onError: () => toast.error("Detal silinə bilmədi"),
  });
}

export function useProjectFiles(projectId: number) {
  return useQuery({
    queryKey: ["project-files", projectId],
    queryFn: () => projectFilesApi.getByProjectId(projectId),
    enabled: !!projectId,
  });
}

export function useUploadProjectFile(projectId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, privacyLevel }: { file: File; privacyLevel: number }) =>
      projectFilesApi.upload(projectId, file, privacyLevel),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["project-files", projectId] }); toast.success("Fayl yükləndi"); },
    onError: () => toast.error("Fayl yüklənə bilmədi"),
  });
}

export function useDeleteProjectFile(projectId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => projectFilesApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["project-files", projectId] }); toast.success("Fayl silindi"); },
    onError: () => toast.error("Fayl silinə bilmədi"),
  });
}

export function useProjectStates(projectId: number) {
  return useQuery({
    queryKey: ["project-states", projectId],
    queryFn: () => projectStatesApi.getByProjectId(projectId),
    enabled: !!projectId,
  });
}

export function useCreateProjectState(projectId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: ProjectStatePostDTO) => projectStatesApi.create(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["project-states", projectId] }); toast.success("Vəziyyət yüksəldildi"); },
    onError: () => toast.error("Vəziyyət yüksəldilə bilmədi"),
  });
}

export function useDegradeProjectState(projectId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: ProjectStateDegradeDTO) => projectStatesApi.degrade(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["project-states", projectId] }); toast.success("Vəziyyət aşağı salındı"); },
    onError: () => toast.error("Vəziyyət aşağı salına bilmədi"),
  });
}

export function usePDC(projectDetailId: number) {
  return useQuery({
    queryKey: ["pdc", projectDetailId],
    queryFn: () => pdcApi.getByProjectDetailId(projectDetailId),
    enabled: !!projectDetailId,
  });
}

export function useCreatePDC(projectDetailId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: ProjectDetailCompanyPostDTO) => pdcApi.create(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["pdc", projectDetailId] }); toast.success("Şirkət əlavə edildi"); },
    onError: () => toast.error("Şirkət əlavə edilə bilmədi"),
  });
}

export function useDeletePDC(projectDetailId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pdcApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["pdc", projectDetailId] }); toast.success("Şirkət silindi"); },
    onError: () => toast.error("Şirkət silinə bilmədi"),
  });
}

export function usePDCYears(projectDetailId: number) {
  return useQuery({
    queryKey: ["pdc-years", projectDetailId],
    queryFn: () => pdcYearsApi.getByProjectDetailId(projectDetailId),
    enabled: !!projectDetailId,
  });
}

export function useCreatePDCYear(projectDetailId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: ProjectDetailCompanyYearPostDTO) => pdcYearsApi.create(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["pdc-years", projectDetailId] }); toast.success("İllik plan əlavə edildi"); },
    onError: () => toast.error("İllik plan əlavə edilə bilmədi"),
  });
}

export function useDeletePDCYear(projectDetailId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pdcYearsApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["pdc-years", projectDetailId] }); toast.success("İllik plan silindi"); },
    onError: () => toast.error("İllik plan silinə bilmədi"),
  });
}