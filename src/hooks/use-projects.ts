import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { projectsApi } from "@/api/projects";
import type { ProjectFilterDTO, ProjectPostDTO, ProjectPutDTO } from "@/types";

export function useProjectSummaries() {
  return useQuery({
    queryKey: ["projects", "summaries"],
    queryFn: () => projectsApi.summaries(),
  });
}

export function useProjectFilter(filter: ProjectFilterDTO | null) {
  return useQuery({
    queryKey: ["projects", "filter", filter],
    queryFn: () => projectsApi.filter(filter!),
    enabled: filter !== null,
  });
}

export function useProject(id: number) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => projectsApi.getById(id),
    enabled: id > 0,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: ProjectPostDTO) => projectsApi.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Layihə yaradıldı");
    },
    onError: () => toast.error("Layihə yaradıla bilmədi"),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: ProjectPutDTO }) =>
      projectsApi.update(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Layihə yeniləndi");
    },
    onError: () => toast.error("Layihə yenilənə bilmədi"),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => projectsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Layihə silindi");
    },
    onError: () => toast.error("Layihə silinə bilmədi"),
  });
}