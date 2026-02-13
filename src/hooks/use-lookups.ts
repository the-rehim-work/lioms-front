import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  companiesApi,
  plansApi,
  statesApi,
  detailsApi,
  functionalFieldsApi,
  enumsApi,
} from "@/api/lookups";
import type {
  CompanyPostDTO,
  CompanyPutDTO,
  PlanPostDTO,
  PlanPutDTO,
  StatePostDTO,
  StatePutDTO,
  DetailPostDTO,
  DetailPutDTO,
  FunctionalFieldPostDTO,
  FunctionalFieldPutDTO,
} from "@/types";

const STALE = 1000 * 60 * 10;

export function useEnums() {
  return useQuery({
    queryKey: ["enums"],
    queryFn: () => enumsApi.getAll(),
    staleTime: Infinity,
  });
}

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => companiesApi.getAll(),
    staleTime: STALE,
  });
}

export function useCreateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CompanyPostDTO) => companiesApi.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Qurum yaradıldı");
    },
    onError: () => toast.error("Qurum yaradıla bilmədi"),
  });
}

export function useUpdateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: CompanyPutDTO }) =>
      companiesApi.update(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Qurum yeniləndi");
    },
    onError: () => toast.error("Qurum yenilənə bilmədi"),
  });
}

export function useDeleteCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => companiesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Qurum silindi");
    },
    onError: () => toast.error("Qurum silinə bilmədi"),
  });
}

export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: () => plansApi.getAll(),
    staleTime: STALE,
  });
}

export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: PlanPostDTO) => plansApi.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plan yaradıldı");
    },
    onError: () => toast.error("Plan yaradıla bilmədi"),
  });
}

export function useUpdatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: PlanPutDTO }) =>
      plansApi.update(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plan yeniləndi");
    },
    onError: () => toast.error("Plan yenilənə bilmədi"),
  });
}

export function useDeletePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => plansApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plan silindi");
    },
    onError: () => toast.error("Plan silinə bilmədi"),
  });
}

export function useStates() {
  return useQuery({
    queryKey: ["states"],
    queryFn: () => statesApi.getAll(),
    staleTime: STALE,
  });
}

export function useCreateState() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: StatePostDTO) => statesApi.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["states"] });
      toast.success("Vəziyyət yaradıldı");
    },
    onError: () => toast.error("Vəziyyət yaradıla bilmədi"),
  });
}

export function useUpdateState() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: StatePutDTO }) =>
      statesApi.update(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["states"] });
      toast.success("Vəziyyət yeniləndi");
    },
    onError: () => toast.error("Vəziyyət yenilənə bilmədi"),
  });
}

export function useDeleteState() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => statesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["states"] });
      toast.success("Vəziyyət silindi");
    },
    onError: () => toast.error("Vəziyyət silinə bilmədi"),
  });
}

export function useDetails() {
  return useQuery({
    queryKey: ["details"],
    queryFn: () => detailsApi.getAll(),
    staleTime: STALE,
  });
}

export function useCreateDetail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: DetailPostDTO) => detailsApi.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["details"] });
      toast.success("Detal yaradıldı");
    },
    onError: () => toast.error("Detal yaradıla bilmədi"),
  });
}

export function useUpdateDetail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: DetailPutDTO }) =>
      detailsApi.update(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["details"] });
      toast.success("Detal yeniləndi");
    },
    onError: () => toast.error("Detal yenilənə bilmədi"),
  });
}

export function useDeleteDetail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => detailsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["details"] });
      toast.success("Detal silindi");
    },
    onError: () => toast.error("Detal silinə bilmədi"),
  });
}

export function useFunctionalFields() {
  return useQuery({
    queryKey: ["functional-fields"],
    queryFn: () => functionalFieldsApi.getAll(),
    staleTime: STALE,
  });
}

export function useCreateFunctionalField() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: FunctionalFieldPostDTO) => functionalFieldsApi.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["functional-fields"] });
      toast.success("Funksional sahə yaradıldı");
    },
    onError: () => toast.error("Funksional sahə yaradıla bilmədi"),
  });
}

export function useUpdateFunctionalField() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: FunctionalFieldPutDTO }) =>
      functionalFieldsApi.update(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["functional-fields"] });
      toast.success("Funksional sahə yeniləndi");
    },
    onError: () => toast.error("Funksional sahə yenilənə bilmədi"),
  });
}

export function useDeleteFunctionalField() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => functionalFieldsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["functional-fields"] });
      toast.success("Funksional sahə silindi");
    },
    onError: () => toast.error("Funksional sahə silinə bilmədi"),
  });
}