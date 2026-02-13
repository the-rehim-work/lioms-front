import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useProjectSummaries,
  useCreateProject,
  useDeleteProject,
} from "@/hooks/use-projects";
import { useCompanies, usePlans, useEnums } from "@/hooks/use-lookups";
import { useAuthStore } from "@/stores/auth";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Field from "@/components/Field";
import Select from "@/components/Select";
import Badge from "@/components/Badge";
import Spinner from "@/components/Spinner";
import type { ProjectSummaryGetDTO, ProjectPostDTO } from "@/types";
import { PriorityLabel, Priority } from "@/types";

const STATE_COLORS: Record<string, "success" | "info" | "warning" | "danger" | "default"> = {};

function stateColor(name: string, sequence?: number): "success" | "info" | "warning" | "danger" | "default" {
  if (STATE_COLORS[name]) return STATE_COLORS[name];
  const n = name.toLowerCase();
  if (n.includes("başlan") || n.includes("ilkin") || n.includes("yeni")) return "info";
  if (n.includes("davam") || n.includes("icra") || n.includes("proses")) return "warning";
  if (n.includes("tamamlan") || n.includes("bitir") || n.includes("son") || n.includes("qəbul")) return "success";
  if (n.includes("rədd") || n.includes("ləğv") || n.includes("dayandır")) return "danger";
  if (sequence != null) {
    if (sequence <= 2) return "info";
    if (sequence <= 5) return "warning";
    return "success";
  }
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

export default function Projects() {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { data, isLoading } = useProjectSummaries();
  const { data: companies } = useCompanies();
  const { data: plans } = usePlans();
  const { data: enums } = useEnums();
  const create = useCreateProject();
  const remove = useDeleteProject();

  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState(defaultForm);

  const columns: Column<ProjectSummaryGetDTO>[] = [
    { key: "id", header: "ID", sortable: true, className: "w-16" },
    { key: "name", header: "Ad", sortable: true },
    { key: "plan", header: "Plan", render: (r) => r.planGetDTO?.name ?? "—", sortable: true },
    { key: "company", header: "Koordinator", render: (r) => r.coordinatorCompanyGetDTO?.alias ?? "—", sortable: true },
    {
      key: "priority", header: "Prioritet", sortable: true,
      render: (r) => (
        <Badge variant={r.priority <= 3 ? "danger" : r.priority <= 6 ? "warning" : "default"}>
          {PriorityLabel[r.priority as Priority] ?? r.priority}
        </Badge>
      ),
    },
    {
      key: "state", header: "Vəziyyət",
      render: (r) =>
        r.currentStateGetDTO ? (
          <Badge variant={stateColor(r.currentStateGetDTO.name, r.currentStateGetDTO.sequence)}>
            {r.currentStateGetDTO.name}
          </Badge>
        ) : "—",
    },
    { key: "thirdSurveyScore", header: "3-cü Sorğu", sortable: true },
    {
      key: "isJoint", header: "Birgə",
      render: (r) => r.isJoint ? <Badge variant="success">Bəli</Badge> : "Xeyr",
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

  const handleDelete = () => {
    if (deleteId === null) return;
    remove.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Layihələr</h1>
        {isAdmin() && (
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <Plus size={16} /> Yeni layihə
          </button>
        )}
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

      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={remove.isPending} />
    </div>
  );
}