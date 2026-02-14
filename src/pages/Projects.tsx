import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Filter, X } from "lucide-react";
import { toast } from "sonner";
import {
  useProjectSummaries,
  useProjectFilter,
  useCreateProject,
  useDeleteProject,
} from "@/hooks/use-projects";
import { useCompanies, usePlans, useStates, useEnums } from "@/hooks/use-lookups";
import { useAuthStore } from "@/stores/auth";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Field from "@/components/Field";
import Select from "@/components/Select";
import Badge from "@/components/Badge";
import Spinner from "@/components/Spinner";
import type { ProjectSummaryGetDTO, ProjectPostDTO, ProjectFilterDTO } from "@/types";
import { PriorityLabel, Priority } from "@/types";

function stateColor(name: string, sequence?: number): "success" | "info" | "warning" | "danger" | "default" {
  const n = name.toLowerCase();
  if (n.includes("başlan") || n.includes("ilkin") || n.includes("yeni")) return "info";
  if (n.includes("davam") || n.includes("icra") || n.includes("proses")) return "warning";
  if (n.includes("tamamlan") || n.includes("bitir") || n.includes("son") || n.includes("qəbul")) return "success";
  if (n.includes("rədd") || n.includes("ləğv") || n.includes("dayandır")) return "danger";
  if (sequence != null) { if (sequence <= 2) return "info"; if (sequence <= 5) return "warning"; return "success"; }
  return "default";
}

const defaultForm: ProjectPostDTO = {
  name: "",
  planId: 0,
  coordinatorCompanyId: 0,
  priority: Priority.A_1,
  thirdSurveyScore: 0,
  isJoint: false,
  note: "",
};

const emptyFilter: ProjectFilterDTO = {
  planIds: null,
  coordinatorCompanyIds: null,
  priorities: null,
  stateIds: null,
  isJoint: null,
  thirdSurveyScoreMin: null,
  thirdSurveyScoreMax: null,
  createdFrom: null,
  createdTo: null,
  searchTerm: null,
};

export default function Projects() {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { data: companies } = useCompanies();
  const { data: plans } = usePlans();
  const { data: states } = useStates();
  const { data: enums } = useEnums();
  const create = useCreateProject();
  const remove = useDeleteProject();

  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<ProjectFilterDTO>(emptyFilter);
  const [activeFilter, setActiveFilter] = useState<ProjectFilterDTO | null>(null);

  const { data: summaries, isLoading: summariesLoading } = useProjectSummaries();
  const { data: filtered, isLoading: filterLoading } = useProjectFilter(activeFilter);

  const isFiltered = activeFilter !== null;
  const data = isFiltered ? filtered : summaries;
  const isLoading = isFiltered ? filterLoading : summariesLoading;

  const hasActiveFilter = activeFilter !== null;
  const filterCount = hasActiveFilter
    ? [
        activeFilter.planIds?.length,
        activeFilter.coordinatorCompanyIds?.length,
        activeFilter.priorities?.length,
        activeFilter.stateIds?.length,
        activeFilter.isJoint !== null ? 1 : 0,
        activeFilter.thirdSurveyScoreMin !== null ? 1 : 0,
        activeFilter.thirdSurveyScoreMax !== null ? 1 : 0,
        activeFilter.createdFrom ? 1 : 0,
        activeFilter.createdTo ? 1 : 0,
        activeFilter.searchTerm ? 1 : 0,
      ].reduce((s, v) => s + (v || 0), 0)
    : 0;

  const columns: Column<ProjectSummaryGetDTO>[] = [
    { key: "id", header: "ID", sortable: true, className: "w-16" },
    { key: "name", header: "Ad", sortable: true },
    {
      key: "plan", header: "Plan", sortable: true,
      render: (r) => r.planGetDTO?.name ?? "—",
      searchValue: (r) => r.planGetDTO?.name ?? "",
    },
    {
      key: "company", header: "Koordinator", sortable: true,
      render: (r) => r.coordinatorCompanyGetDTO?.alias ?? "—",
      searchValue: (r) => `${r.coordinatorCompanyGetDTO?.name ?? ""} ${r.coordinatorCompanyGetDTO?.alias ?? ""}`,
    },
    {
      key: "priority", header: "Prioritet", sortable: true,
      render: (r) => (
        <Badge variant={r.priority <= 3 ? "danger" : r.priority <= 6 ? "warning" : "default"}>
          {PriorityLabel[r.priority as Priority] ?? r.priority}
        </Badge>
      ),
      searchValue: (r) => PriorityLabel[r.priority as Priority] ?? String(r.priority),
    },
    {
      key: "state", header: "Vəziyyət",
      render: (r) =>
        r.currentStateGetDTO ? (
          <Badge variant={stateColor(r.currentStateGetDTO.name, r.currentStateGetDTO.sequence)}>
            {r.currentStateGetDTO.name}
          </Badge>
        ) : "—",
      searchValue: (r) => r.currentStateGetDTO?.name ?? "",
    },
    { key: "thirdSurveyScore", header: "3-cü Sorğu", sortable: true },
    {
      key: "isJoint", header: "Birgə",
      render: (r) => r.isJoint ? <Badge variant="success">Bəli</Badge> : "Xeyr",
      searchValue: (r) => r.isJoint ? "Bəli" : "Xeyr",
    },
    { key: "projectDetailCount", header: "Detallar", sortable: true },
    { key: "projectFileCount", header: "Fayllar", sortable: true },
  ];

  const handleCreate = () => {
    if (!form.name.trim() || !form.planId || !form.coordinatorCompanyId) {
      toast.error("Ad, plan və koordinator qurum tələb olunur");
      return;
    }
    create.mutate(form, {
      onSuccess: () => { setShowCreate(false); setForm(defaultForm); },
    });
  };

  const handleApplyFilter = () => {
    const clean: ProjectFilterDTO = {};
    if (filter.planIds?.length) clean.planIds = filter.planIds;
    if (filter.coordinatorCompanyIds?.length) clean.coordinatorCompanyIds = filter.coordinatorCompanyIds;
    if (filter.priorities?.length) clean.priorities = filter.priorities;
    if (filter.stateIds?.length) clean.stateIds = filter.stateIds;
    if (filter.isJoint !== null) clean.isJoint = filter.isJoint;
    if (filter.thirdSurveyScoreMin !== null) clean.thirdSurveyScoreMin = filter.thirdSurveyScoreMin;
    if (filter.thirdSurveyScoreMax !== null) clean.thirdSurveyScoreMax = filter.thirdSurveyScoreMax;
    if (filter.createdFrom) clean.createdFrom = filter.createdFrom;
    if (filter.createdTo) clean.createdTo = filter.createdTo;
    if (filter.searchTerm?.trim()) clean.searchTerm = filter.searchTerm.trim();

    const hasAnything = Object.keys(clean).length > 0;
    setActiveFilter(hasAnything ? clean : null);
    setShowFilter(false);
  };

  const handleClearFilter = () => {
    setFilter(emptyFilter);
    setActiveFilter(null);
    setShowFilter(false);
  };

  const toggleMultiSelect = (arr: number[] | null | undefined, val: number): number[] => {
    const current = arr ?? [];
    return current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Layihələr</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilter(true)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              hasActiveFilter
                ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <Filter size={16} />
            Filtr
            {filterCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {filterCount}
              </span>
            )}
          </button>
          {hasActiveFilter && (
            <button
              onClick={handleClearFilter}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700"
              title="Filtri təmizlə"
            >
              <X size={16} />
            </button>
          )}
          {isAdmin() && (
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <Plus size={16} /> Yeni layihə
            </button>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        onRowClick={(r) => navigate(`/projects/${r.id}`)}
        actions={isAdmin() ? (row) => (
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteId(row.id); }}
            className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Sil"
          >
            <Trash2 size={15} />
          </button>
        ) : undefined}
      />

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Yeni Layihə" wide>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Ad" value={form.name} onChange={(e) => setForm({ ...form, name: (e.target as HTMLInputElement).value })} required className="col-span-2" />
          <Select label="Plan" value={form.planId} onChange={(e) => setForm({ ...form, planId: Number(e.target.value) })} options={(plans ?? []).map((p) => ({ value: p.id, label: p.name }))} placeholder="Plan seçin" />
          <Select label="Koordinator qurum" value={form.coordinatorCompanyId} onChange={(e) => setForm({ ...form, coordinatorCompanyId: Number(e.target.value) })} options={(companies ?? []).map((c) => ({ value: c.id, label: c.name }))} placeholder="Qurum seçin" />
          <Select label="Prioritet" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) as Priority })} options={(enums?.priorities ?? []).map((p) => ({ value: p.id, label: p.name.replace("_", "-") }))} />
          <Field label="3-cü Sorğu Balı" type="number" step="0.01" value={form.thirdSurveyScore} onChange={(e) => setForm({ ...form, thirdSurveyScore: Number((e.target as HTMLInputElement).value) })} />
          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked={form.isJoint} onChange={(e) => setForm({ ...form, isJoint: (e.target as HTMLInputElement).checked })} className="h-4 w-4 rounded border-gray-300" />
              Birgə layihə
            </label>
          </div>
          <Field label="Qeyd" as="textarea" value={form.note} onChange={(e) => setForm({ ...form, note: (e.target as HTMLTextAreaElement).value })} className="col-span-2" />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setShowCreate(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Ləğv et</button>
          <button onClick={handleCreate} disabled={create.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {create.isPending ? "Yaradılır..." : "Yarat"}
          </button>
        </div>
      </Modal>

      <Modal open={showFilter} onClose={() => setShowFilter(false)} title="Layihə filtri" wide>
        <div className="space-y-4">
          <Field
            label="Axtarış"
            value={filter.searchTerm ?? ""}
            onChange={(e) => setFilter({ ...filter, searchTerm: (e.target as HTMLInputElement).value || null })}
            placeholder="Ad, qeyd..."
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Planlar</label>
              <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-300 p-2 dark:border-gray-600">
                {(plans ?? []).map((p) => (
                  <label key={p.id} className="flex items-center gap-2 py-0.5 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={filter.planIds?.includes(p.id) ?? false}
                      onChange={() => setFilter({ ...filter, planIds: toggleMultiSelect(filter.planIds, p.id) })}
                      className="rounded border-gray-300"
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Koordinator qurumlar</label>
              <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-300 p-2 dark:border-gray-600">
                {(companies ?? []).map((c) => (
                  <label key={c.id} className="flex items-center gap-2 py-0.5 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={filter.coordinatorCompanyIds?.includes(c.id) ?? false}
                      onChange={() => setFilter({ ...filter, coordinatorCompanyIds: toggleMultiSelect(filter.coordinatorCompanyIds, c.id) })}
                      className="rounded border-gray-300"
                    />
                    {c.alias || c.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prioritetlər</label>
              <div className="flex flex-wrap gap-1.5">
                {(enums?.priorities ?? []).map((p) => {
                  const selected = filter.priorities?.includes(p.id as Priority) ?? false;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFilter({ ...filter, priorities: toggleMultiSelect(filter.priorities as number[] | null, p.id) as Priority[] })}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        selected
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {p.name.replace("_", "-")}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vəziyyətlər</label>
              <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-300 p-2 dark:border-gray-600">
                {(states ?? []).map((s) => (
                  <label key={s.id} className="flex items-center gap-2 py-0.5 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={filter.stateIds?.includes(s.id) ?? false}
                      onChange={() => setFilter({ ...filter, stateIds: toggleMultiSelect(filter.stateIds, s.id) })}
                      className="rounded border-gray-300"
                    />
                    {s.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Birgə"
              value={filter.isJoint === null ? "" : filter.isJoint ? "true" : "false"}
              onChange={(e) => setFilter({ ...filter, isJoint: e.target.value === "" ? null : e.target.value === "true" })}
              options={[
                { value: "true", label: "Bəli" },
                { value: "false", label: "Xeyr" },
              ]}
              placeholder="Hamısı"
            />
            <Field
              label="3-cü Sorğu (min)"
              type="number"
              step="0.01"
              value={filter.thirdSurveyScoreMin ?? ""}
              onChange={(e) => {
                const v = (e.target as HTMLInputElement).value;
                setFilter({ ...filter, thirdSurveyScoreMin: v === "" ? null : Number(v) });
              }}
            />
            <Field
              label="3-cü Sorğu (max)"
              type="number"
              step="0.01"
              value={filter.thirdSurveyScoreMax ?? ""}
              onChange={(e) => {
                const v = (e.target as HTMLInputElement).value;
                setFilter({ ...filter, thirdSurveyScoreMax: v === "" ? null : Number(v) });
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Yaradılma tarixi (başlanğıc)"
              type="date"
              value={filter.createdFrom ?? ""}
              onChange={(e) => setFilter({ ...filter, createdFrom: (e.target as HTMLInputElement).value || null })}
            />
            <Field
              label="Yaradılma tarixi (son)"
              type="date"
              value={filter.createdTo ?? ""}
              onChange={(e) => setFilter({ ...filter, createdTo: (e.target as HTMLInputElement).value || null })}
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleClearFilter}
              className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Təmizlə
            </button>
            <div className="flex gap-3">
              <button onClick={() => setShowFilter(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Ləğv et</button>
              <button onClick={handleApplyFilter} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Tətbiq et</button>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId !== null) remove.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }} loading={remove.isPending} />
    </div>
  );
}