import { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Building2, Puzzle, FileText, Layers,
  Plus, Trash2, Download, Edit, ChevronDown, ChevronRight,
  Upload, X, FileIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useProject, useUpdateProject } from "@/hooks/use-projects";
import {
  useProjectCompanies, useCreateProjectCompany, useDeleteProjectCompany,
  useProjectDetails, useCreateProjectDetail, useUpdateProjectDetail, useDeleteProjectDetail,
  useProjectFiles, useUploadProjectFile, useDeleteProjectFile,
  useProjectStates, useCreateProjectState, useDegradeProjectState,
  usePDC, useCreatePDC, useDeletePDC,
  usePDCYears, useCreatePDCYear, useDeletePDCYear,
} from "@/hooks/use-project-view";
import { useCompanies, usePlans, useStates, useDetails, useEnums } from "@/hooks/use-lookups";
import { useAuthStore } from "@/stores/auth";
import client from "@/api/client";
import Spinner from "@/components/Spinner";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Field from "@/components/Field";
import Select from "@/components/Select";
import type {
  ProjectCompanyPostDTO, ProjectDetailPostDTO, ProjectDetailPutDTO,
  ProjectStatePostDTO, ProjectStateDegradeDTO, ProjectDetailGetDTO,
} from "@/types";
import {
  Priority, PriorityLabel,
  ProjectCompanyCategory, ProjectCompanyCategoryLabel,
  DetailCountType, DetailCountTypeLabel,
} from "@/types";

type Tab = "companies" | "details" | "files" | "states";

function stateVariant(name: string, seq?: number): "success" | "info" | "warning" | "danger" | "default" {
  const n = name.toLowerCase();
  if (n.includes("başlan") || n.includes("ilkin") || n.includes("yeni")) return "info";
  if (n.includes("davam") || n.includes("icra") || n.includes("proses")) return "warning";
  if (n.includes("tamamlan") || n.includes("bitir") || n.includes("son") || n.includes("qəbul")) return "success";
  if (n.includes("rədd") || n.includes("ləğv") || n.includes("dayandır")) return "danger";
  if (seq != null) { if (seq <= 2) return "info"; if (seq <= 5) return "warning"; return "success"; }
  return "default";
}

const PIPE_COLORS = {
  info: { bg: "bg-blue-500", ring: "ring-blue-300 dark:ring-blue-700", text: "text-blue-700 dark:text-blue-300", light: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800" },
  warning: { bg: "bg-amber-500", ring: "ring-amber-300 dark:ring-amber-700", text: "text-amber-700 dark:text-amber-300", light: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800" },
  success: { bg: "bg-emerald-500", ring: "ring-emerald-300 dark:ring-emerald-700", text: "text-emerald-700 dark:text-emerald-300", light: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800" },
  danger: { bg: "bg-red-500", ring: "ring-red-300 dark:ring-red-700", text: "text-red-700 dark:text-red-300", light: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800" },
  default: { bg: "bg-gray-400", ring: "ring-gray-300 dark:ring-gray-600", text: "text-gray-600 dark:text-gray-300", light: "bg-gray-50 dark:bg-gray-800", border: "border-gray-200 dark:border-gray-700" },
};

export default function ProjectView() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const navigate = useNavigate();
  const { isAdmin, canWrite } = useAuthStore();
  const [tab, setTab] = useState<Tab>("details");

  const { data: project, isLoading } = useProject(projectId);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (!project) return <p className="p-6 text-gray-500">Layihə tapılmadı</p>;

  const tabs: { key: Tab; label: string; icon: typeof Building2 }[] = [
    { key: "details", label: "Detallar", icon: Puzzle },
    { key: "companies", label: "Şirkətlər", icon: Building2 },
    { key: "files", label: "Fayllar", icon: FileText },
    { key: "states", label: "Vəziyyətlər", icon: Layers },
  ];

  return (
    <div>
      <button onClick={() => navigate("/projects")} className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        <ArrowLeft size={16} /> Layihələrə qayıt
      </button>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Plan: <strong>{project.planGetDTO?.name ?? "—"}</strong></span>
              <span>·</span>
              <span>Koordinator: <strong>{project.coordinatorCompanyGetDTO?.name ?? "—"}</strong></span>
              <span>·</span>
              <span>
                Prioritet:{" "}
                <Badge variant={project.priority <= 3 ? "danger" : project.priority <= 6 ? "warning" : "default"}>
                  {PriorityLabel[project.priority as Priority] ?? project.priority}
                </Badge>
              </span>
              <span>·</span>
              <span>3-cü Sorğu: <strong>{project.thirdSurveyScore}</strong></span>
              {project.isJoint && (<><span>·</span><Badge variant="success">Birgə</Badge></>)}
            </div>
            {project.note && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{project.note}</p>}
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "companies" && <CompaniesTab projectId={projectId} />}
      {tab === "details" && <DetailsTab projectId={projectId} />}
      {tab === "files" && <FilesTab projectId={projectId} />}
      {tab === "states" && <StatesTab projectId={projectId} />}
    </div>
  );
}

function CompaniesTab({ projectId }: { projectId: number }) {
  const { isAdmin } = useAuthStore();
  const { data, isLoading } = useProjectCompanies(projectId);
  const { data: companies } = useCompanies();
  const create = useCreateProjectCompany(projectId);
  const remove = useDeleteProjectCompany(projectId);
  const [showAdd, setShowAdd] = useState(false);
  const [companyId, setCompanyId] = useState(0);
  const [category, setCategory] = useState(ProjectCompanyCategory.None);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleAdd = () => {
    if (!companyId) { toast.error("Şirkət seçin"); return; }
    const dto: ProjectCompanyPostDTO = { projectId, companyId, category };
    create.mutate(dto, { onSuccess: () => { setShowAdd(false); setCompanyId(0); } });
  };

  if (isLoading) return <Spinner className="mx-auto mt-8 h-6 w-6" />;

  return (
    <div>
      {isAdmin() && (
        <button onClick={() => setShowAdd(true)} className="mb-3 flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
          <Plus size={14} /> Şirkət əlavə et
        </button>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Şirkət</th>
              <th className="px-4 py-3">Kateqoriya</th>
              {isAdmin() && <th className="px-4 py-3 w-20" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {(data ?? []).map((pc) => (
              <tr key={pc.id} className="bg-white dark:bg-gray-800">
                <td className="px-4 py-3 text-gray-900 dark:text-white">{pc.companyGetDTO?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge variant={pc.category === ProjectCompanyCategory.Leading ? "success" : pc.category === ProjectCompanyCategory.Demanding ? "warning" : "default"}>
                    {ProjectCompanyCategoryLabel[pc.category]}
                  </Badge>
                </td>
                {isAdmin() && (
                  <td className="px-4 py-3">
                    <button onClick={() => setDeleteId(pc.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
                  </td>
                )}
              </tr>
            ))}
            {(data ?? []).length === 0 && (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400">Şirkət tapılmadı</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Şirkət əlavə et">
        <Select label="Şirkət" value={companyId} onChange={(e) => setCompanyId(Number(e.target.value))} options={(companies ?? []).map((c) => ({ value: c.id, label: c.name }))} placeholder="Seçin" />
        <Select label="Kateqoriya" value={category} onChange={(e) => setCategory(Number(e.target.value))} options={Object.entries(ProjectCompanyCategoryLabel).map(([k, v]) => ({ value: Number(k), label: v }))} className="mt-3" />
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={() => setShowAdd(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600 dark:text-gray-300">Ləğv et</button>
          <button onClick={handleAdd} disabled={create.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Əlavə et</button>
        </div>
      </Modal>

      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) remove.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }} loading={remove.isPending} />
    </div>
  );
}

function DetailsTab({ projectId }: { projectId: number }) {
  const { isAdmin } = useAuthStore();
  const { data, isLoading } = useProjectDetails(projectId);
  const { data: details } = useDetails();
  const { data: enums } = useEnums();
  const create = useCreateProjectDetail(projectId);
  const update = useUpdateProjectDetail(projectId);
  const remove = useDeleteProjectDetail(projectId);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<ProjectDetailGetDTO | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [form, setForm] = useState({ detailId: 0, approximatePrice: 0, totalCount: 0, detailCountType: DetailCountType.None });

  const handleAdd = () => {
    if (!form.detailId) { toast.error("Detal seçin"); return; }
    const dto: ProjectDetailPostDTO = { ...form, projectId };
    create.mutate(dto, { onSuccess: () => { setShowAdd(false); setForm({ detailId: 0, approximatePrice: 0, totalCount: 0, detailCountType: DetailCountType.None }); } });
  };

  const handleUpdate = () => {
    if (!editItem) return;
    const dto: ProjectDetailPutDTO = {
      id: editItem.id, serialNumber: editItem.serialNumber, approximatePrice: form.approximatePrice,
      totalCount: form.totalCount, detailCountType: form.detailCountType, projectId,
      detailId: form.detailId || editItem.detailGetDTO?.id || 0,
    };
    update.mutate({ id: editItem.id, dto }, { onSuccess: () => setEditItem(null) });
  };

  if (isLoading) return <Spinner className="mx-auto mt-8 h-6 w-6" />;

  return (
    <div>
      {isAdmin() && (
        <button onClick={() => setShowAdd(true)} className="mb-3 flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
          <Plus size={14} /> Detal əlavə et
        </button>
      )}
      <div className="space-y-2">
        {(data ?? []).map((pd) => (
          <div key={pd.id} className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="flex cursor-pointer items-center justify-between px-4 py-3" onClick={() => setExpandedId(expandedId === pd.id ? null : pd.id)}>
              <div className="flex items-center gap-3">
                {expandedId === pd.id ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                <span className="font-medium text-gray-900 dark:text-white">
                  {pd.detailGetDTO?.name ?? "—"}{" "}
                  <span className="text-xs text-gray-400">#{pd.serialNumber}</span>
                </span>
                <Badge>{pd.detailGetDTO?.code ?? "—"}</Badge>
                <Badge variant="info">{DetailCountTypeLabel[pd.detailCountType]}</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>Say: <strong>{pd.totalCount}</strong></span>
                <span>Qiymət: <strong>{pd.approximatePrice}</strong></span>
                {isAdmin() && (
                  <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); setEditItem(pd); setForm({ detailId: pd.detailGetDTO?.id || 0, approximatePrice: pd.approximatePrice, totalCount: pd.totalCount, detailCountType: pd.detailCountType }); }} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700"><Edit size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteId(pd.id); }} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700"><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
            </div>
            {expandedId === pd.id && <DetailExpanded projectDetailId={pd.id} projectId={projectId} />}
          </div>
        ))}
        {(data ?? []).length === 0 && <p className="py-8 text-center text-sm text-gray-400">Detal tapılmadı</p>}
      </div>

      <Modal open={showAdd || editItem !== null} onClose={() => { setShowAdd(false); setEditItem(null); }} title={editItem ? "Detalı redaktə et" : "Detal əlavə et"}>
        {!editItem && (
          <Select label="Detal" value={form.detailId} onChange={(e) => setForm({ ...form, detailId: Number(e.target.value) })} options={(details ?? []).map((d) => ({ value: d.id, label: `${d.name} (${d.code})` }))} placeholder="Seçin" />
        )}
        <Field label="Ümumi say" type="number" value={form.totalCount} onChange={(e) => setForm({ ...form, totalCount: Number((e.target as HTMLInputElement).value) })} className="mt-3" />
        <Field label="Təxmini qiymət" type="number" step="0.01" value={form.approximatePrice} onChange={(e) => setForm({ ...form, approximatePrice: Number((e.target as HTMLInputElement).value) })} className="mt-3" />
        <Select label="Say növü" value={form.detailCountType} onChange={(e) => setForm({ ...form, detailCountType: Number(e.target.value) })} options={Object.entries(DetailCountTypeLabel).map(([k, v]) => ({ value: Number(k), label: v }))} className="mt-3" />
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={() => { setShowAdd(false); setEditItem(null); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600 dark:text-gray-300">Ləğv et</button>
          <button onClick={editItem ? handleUpdate : handleAdd} disabled={create.isPending || update.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {editItem ? "Yadda saxla" : "Əlavə et"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) remove.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }} loading={remove.isPending} />
    </div>
  );
}

function DetailExpanded({ projectDetailId, projectId }: { projectDetailId: number; projectId: number }) {
  const { isAdmin } = useAuthStore();
  const { data: pdcList, isLoading } = usePDC(projectDetailId);
  const { data: companies } = useCompanies();
  const createPDC = useCreatePDC(projectDetailId);
  const removePDC = useDeletePDC(projectDetailId);
  const { data: years } = usePDCYears(projectDetailId);
  const createYear = useCreatePDCYear(projectDetailId);
  const removeYear = useDeletePDCYear(projectDetailId);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [addCompanyId, setAddCompanyId] = useState(0);
  const [showAddYear, setShowAddYear] = useState<number | null>(null);
  const [yearForm, setYearForm] = useState({ year: new Date().getFullYear(), count: 0 });

  if (isLoading) return <div className="px-4 pb-3"><Spinner className="h-4 w-4" /></div>;

  return (
    <div className="border-t border-gray-200 px-4 pb-4 pt-3 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold uppercase text-gray-400">Şirkətlər və İllik Planlar</h4>
        {isAdmin() && (
          <button onClick={() => setShowAddCompany(true)} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
            <Plus size={12} /> Şirkət
          </button>
        )}
      </div>

      {(pdcList ?? []).length === 0 && <p className="text-xs text-gray-400">Şirkət təyin edilməyib</p>}

      {(pdcList ?? []).map((pdc) => {
        const pdcYears = (years ?? []).filter((y) => y.projectDetailCompanyGetDTO?.id === pdc.id);
        return (
          <div key={pdc.id} className="mb-2 rounded border border-gray-100 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-900/40">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{pdc.companyGetDTO?.name ?? "—"}</span>
              <div className="flex items-center gap-2">
                {isAdmin() && (
                  <>
                    <button onClick={() => { setShowAddYear(pdc.id); setYearForm({ year: new Date().getFullYear(), count: 0 }); }} className="text-xs text-blue-600 hover:text-blue-700">+ İl</button>
                    <button onClick={() => removePDC.mutate(pdc.id)} className="text-xs text-red-500 hover:text-red-700">Sil</button>
                  </>
                )}
              </div>
            </div>
            {pdcYears.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {pdcYears.map((y) => (
                  <span key={y.id} className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {y.year}: {y.count}
                    {isAdmin() && <button onClick={() => removeYear.mutate(y.id)} className="ml-1 text-red-400 hover:text-red-600">&times;</button>}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <Modal open={showAddCompany} onClose={() => setShowAddCompany(false)} title="Detal şirkəti əlavə et">
        <Select label="Şirkət" value={addCompanyId} onChange={(e) => setAddCompanyId(Number(e.target.value))} options={(companies ?? []).map((c) => ({ value: c.id, label: c.name }))} placeholder="Seçin" />
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={() => setShowAddCompany(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600 dark:text-gray-300">Ləğv et</button>
          <button onClick={() => {
            if (!addCompanyId) { toast.error("Şirkət seçin"); return; }
            createPDC.mutate({ companyId: addCompanyId, projectDetailId }, { onSuccess: () => { setShowAddCompany(false); setAddCompanyId(0); } });
          }} disabled={createPDC.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Əlavə et</button>
        </div>
      </Modal>

      <Modal open={showAddYear !== null} onClose={() => setShowAddYear(null)} title="İllik plan əlavə et">
        <Field label="İl" type="number" value={yearForm.year} onChange={(e) => setYearForm({ ...yearForm, year: Number((e.target as HTMLInputElement).value) })} />
        <Field label="Say" type="number" value={yearForm.count} onChange={(e) => setYearForm({ ...yearForm, count: Number((e.target as HTMLInputElement).value) })} className="mt-3" />
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={() => setShowAddYear(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600 dark:text-gray-300">Ləğv et</button>
          <button onClick={() => {
            if (!showAddYear) return;
            createYear.mutate({ ...yearForm, projectDetailCompanyId: showAddYear }, { onSuccess: () => setShowAddYear(null) });
          }} disabled={createYear.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Əlavə et</button>
        </div>
      </Modal>
    </div>
  );
}

function FilesTab({ projectId }: { projectId: number }) {
  const { isAdmin } = useAuthStore();
  const { data, isLoading } = useProjectFiles(projectId);
  const upload = useUploadProjectFile(projectId);
  const remove = useDeleteProjectFile(projectId);
  const [showUpload, setShowUpload] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [privacyLevel, setPrivacyLevel] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [downloading, setDownloading] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fl: FileList | null) => {
    if (!fl) return;
    setFiles((prev) => [...prev, ...Array.from(fl)]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) { toast.error("Fayl seçin"); return; }
    for (const f of files) {
      await upload.mutateAsync({ file: f, privacyLevel });
    }
    setShowUpload(false);
    setFiles([]);
  };

  const handleDownload = async (fileId: number, fileName: string) => {
    setDownloading(fileId);
    try {
      const res = await client.get(`projectfiles/download/${fileId}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Fayl yüklənə bilmədi");
    }
    setDownloading(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const extIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    if (["pdf"].includes(ext)) return "text-red-500";
    if (["doc", "docx"].includes(ext)) return "text-blue-600";
    if (["xls", "xlsx"].includes(ext)) return "text-green-600";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "text-purple-500";
    if (["zip", "rar", "7z"].includes(ext)) return "text-amber-600";
    return "text-gray-400";
  };

  if (isLoading) return <Spinner className="mx-auto mt-8 h-6 w-6" />;

  return (
    <div>
      {isAdmin() && (
        <button onClick={() => setShowUpload(true)} className="mb-3 flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
          <Upload size={14} /> Fayl yüklə
        </button>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Fayl adı</th>
              <th className="px-4 py-3">Tip</th>
              <th className="px-4 py-3">Ölçü</th>
              <th className="px-4 py-3">Məxfilik</th>
              <th className="px-4 py-3">Tarix</th>
              <th className="px-4 py-3 w-24" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {(data ?? []).map((f) => (
              <tr key={f.id} className="bg-white dark:bg-gray-800">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileIcon size={16} className={extIcon(f.fileName)} />
                    <span className="font-medium text-gray-900 dark:text-white">{f.fileName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{f.contentType}</td>
                <td className="px-4 py-3 text-gray-500">{formatSize(f.fileSize)}</td>
                <td className="px-4 py-3"><Badge>{f.privacyLevel}</Badge></td>
                <td className="px-4 py-3 text-gray-500">{new Date(f.createdAt).toLocaleDateString("az-AZ")}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDownload(f.id, f.fileName)}
                      disabled={downloading === f.id}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      {downloading === f.id ? <Spinner className="h-4 w-4" /> : <Download size={15} />}
                    </button>
                    {isAdmin() && (
                      <button onClick={() => setDeleteId(f.id)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {(data ?? []).length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Fayl tapılmadı</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={showUpload} onClose={() => { setShowUpload(false); setFiles([]); }} title="Fayl yüklə">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            dragging
              ? "border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20"
              : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
          }`}
        >
          <Upload size={32} className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Faylları sürükləyin və ya <span className="font-medium text-blue-600">seçmək üçün klikləyin</span>
          </p>
          <input ref={inputRef} type="file" multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" />
        </div>

        {files.length > 0 && (
          <div className="mt-3 space-y-1">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm">
                  <FileIcon size={14} className={extIcon(f.name)} />
                  <span className="text-gray-700 dark:text-gray-200">{f.name}</span>
                  <span className="text-xs text-gray-400">{formatSize(f.size)}</span>
                </div>
                <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
              </div>
            ))}
          </div>
        )}

        <Field label="Məxfilik səviyyəsi" type="number" value={privacyLevel} onChange={(e) => setPrivacyLevel(Number((e.target as HTMLInputElement).value))} className="mt-3" />

        <div className="mt-4 flex justify-end gap-3">
          <button onClick={() => { setShowUpload(false); setFiles([]); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600 dark:text-gray-300">Ləğv et</button>
          <button onClick={handleUpload} disabled={upload.isPending || files.length === 0} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {upload.isPending ? "Yüklənir..." : `Yüklə (${files.length})`}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) remove.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }} loading={remove.isPending} />
    </div>
  );
}

function StatesTab({ projectId }: { projectId: number }) {
  const { isAdmin, canWrite } = useAuthStore();
  const { data, isLoading } = useProjectStates(projectId);
  const { data: states } = useStates();
  const promote = useCreateProjectState(projectId);
  const degrade = useDegradeProjectState(projectId);
  const [showPromote, setShowPromote] = useState(false);
  const [showDegrade, setShowDegrade] = useState(false);
  const [stateId, setStateId] = useState(0);
  const [rejectionNote, setRejectionNote] = useState("");

  const currentState = data && data.length > 0 ? data[0] : null;

  const handlePromote = () => {
    if (!stateId) { toast.error("Vəziyyət seçin"); return; }
    const dto: ProjectStatePostDTO = { projectId, stateId, rejectionNote: rejectionNote || null };
    promote.mutate(dto, { onSuccess: () => { setShowPromote(false); setStateId(0); setRejectionNote(""); } });
  };

  const handleDegrade = () => {
    if (!stateId) { toast.error("Vəziyyət seçin"); return; }
    const dto: ProjectStateDegradeDTO = { projectId, stateId, rejectionNote: rejectionNote || null };
    degrade.mutate(dto, { onSuccess: () => { setShowDegrade(false); setStateId(0); setRejectionNote(""); } });
  };

  if (isLoading) return <Spinner className="mx-auto mt-8 h-6 w-6" />;

  const sortedStates = [...(data ?? [])].reverse();
  const currentIdx = sortedStates.length - 1;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {isAdmin() && (
          <button onClick={() => setShowPromote(true)} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">Yüksəlt</button>
        )}
        {canWrite() && (
          <button onClick={() => setShowDegrade(true)} className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-700">Aşağı sal</button>
        )}
      </div>

      {sortedStates.length > 0 && (
        <div className="mb-6">
          <div className="relative flex items-center">
            {sortedStates.map((ps, i) => {
              const variant = stateVariant(ps.stateGetDTO?.name ?? "", ps.stateGetDTO?.sequence);
              const c = PIPE_COLORS[variant];
              const isCurrent = i === currentIdx;

              return (
                <div key={ps.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`relative flex h-10 w-10 items-center justify-center rounded-full text-white text-xs font-bold ${c.bg} ${isCurrent ? `ring-4 ${c.ring} scale-110` : "opacity-80"}`}>
                      {ps.stateGetDTO?.sequence ?? i + 1}
                    </div>
                    <span className={`mt-1.5 max-w-[100px] text-center text-xs font-medium leading-tight ${isCurrent ? c.text : "text-gray-400"}`}>
                      {ps.stateGetDTO?.name ?? "—"}
                    </span>
                    {isCurrent && <span className="mt-0.5 text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">Cari</span>}
                  </div>
                  {i < sortedStates.length - 1 && (
                    <div className={`mx-1 h-1 flex-1 rounded-full ${i < currentIdx ? c.bg : "bg-gray-200 dark:bg-gray-700"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {currentState?.rejectionNote && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-700 dark:text-red-400">
            Rədd qeydi: <strong>{currentState.rejectionNote}</strong>
          </p>
        </div>
      )}

      <div className="space-y-2">
        {sortedStates.map((ps, i) => {
          const variant = stateVariant(ps.stateGetDTO?.name ?? "", ps.stateGetDTO?.sequence);
          const c = PIPE_COLORS[variant];
          const isCurrent = i === currentIdx;

          return (
            <div key={ps.id} className={`rounded-lg border p-3 ${isCurrent ? c.border + " " + c.light : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold ${c.bg}`}>
                    {ps.stateGetDTO?.sequence ?? "?"}
                  </div>
                  <span className={`font-medium ${isCurrent ? c.text : "text-gray-700 dark:text-gray-200"}`}>
                    {ps.stateGetDTO?.name ?? "—"}
                  </span>
                  {isCurrent && <Badge variant="success">Cari</Badge>}
                </div>
                {ps.rejectionNote && (
                  <span className="text-xs text-red-500 dark:text-red-400">{ps.rejectionNote}</span>
                )}
              </div>
            </div>
          );
        })}
        {sortedStates.length === 0 && <p className="py-8 text-center text-sm text-gray-400">Vəziyyət tapılmadı</p>}
      </div>

      <Modal open={showPromote} onClose={() => setShowPromote(false)} title="Vəziyyəti yüksəlt">
        <Select label="Yeni vəziyyət" value={stateId} onChange={(e) => setStateId(Number(e.target.value))} options={(states ?? []).map((s) => ({ value: s.id, label: `${s.name} (${s.sequence})` }))} placeholder="Seçin" />
        <Field label="Qeyd (opsional)" as="textarea" value={rejectionNote} onChange={(e) => setRejectionNote((e.target as HTMLTextAreaElement).value)} className="mt-3" />
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={() => setShowPromote(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600 dark:text-gray-300">Ləğv et</button>
          <button onClick={handlePromote} disabled={promote.isPending} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">Yüksəlt</button>
        </div>
      </Modal>

      <Modal open={showDegrade} onClose={() => setShowDegrade(false)} title="Vəziyyəti aşağı sal">
        <Select label="Hədəf vəziyyət" value={stateId} onChange={(e) => setStateId(Number(e.target.value))} options={(states ?? []).map((s) => ({ value: s.id, label: `${s.name} (${s.sequence})` }))} placeholder="Seçin" />
        <Field label="Rədd qeydi" as="textarea" value={rejectionNote} onChange={(e) => setRejectionNote((e.target as HTMLTextAreaElement).value)} className="mt-3" />
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={() => setShowDegrade(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600 dark:text-gray-300">Ləğv et</button>
          <button onClick={handleDegrade} disabled={degrade.isPending} className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50">Aşağı sal</button>
        </div>
      </Modal>
    </div>
  );
}