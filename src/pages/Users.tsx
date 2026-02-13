import { useState } from "react";
import { Plus, Pencil, KeyRound, ShieldCheck, ShieldX } from "lucide-react";
import DataTable, { type Column } from "@/components/DataTable";
import Modal from "@/components/Modal";
import Field from "@/components/Field";
import Select from "@/components/Select";
import Badge from "@/components/Badge";
import { useUsers, useRoles, useCreateUser, useUpdateUser, useToggleUserActive, useChangePassword } from "@/hooks/use-users";
import { useCompanies } from "@/hooks/use-lookups";
import type { UserGetDTO, UserPostDTO, UserPutDTO } from "@/types";

const emptyPost = { username: "", email: "", password: "", companyIds: [] as string[], roleId: 0, privacyLevel: 3 };
const emptyPut = { username: "", email: "", companyIds: [] as string[], roleId: 0, privacyLevel: 3 };

export default function Users() {
  const { data: users = [], isLoading } = useUsers();
  const { data: roles = [] } = useRoles();
  const { data: companies = [] } = useCompanies();
  const create = useCreateUser();
  const update = useUpdateUser();
  const toggleActive = useToggleUserActive();
  const changePw = useChangePassword();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [editing, setEditing] = useState<UserGetDTO | null>(null);
  const [postForm, setPostForm] = useState(emptyPost);
  const [putForm, setPutForm] = useState(emptyPut);
  const [newPassword, setNewPassword] = useState("");

  const openCreate = () => { setPostForm(emptyPost); setCreateOpen(true); };
  const openEdit = (u: UserGetDTO) => {
    setEditing(u);
    const roleId = roles.find((r) => u.roles.includes(r.name))?.id ?? 0;
    setPutForm({ username: u.username, email: u.email, companyIds: u.companies, roleId, privacyLevel: Number(u.privacyLevel ?? 3) });
    setEditOpen(true);
  };
  const openPw = (u: UserGetDTO) => { setEditing(u); setNewPassword(""); setPwOpen(true); };

  const handleCreate = () => {
    if (!postForm.username.trim() || !postForm.password.trim() || !postForm.roleId) return;
    const dto: UserPostDTO = { ...postForm };
    create.mutate(dto, { onSuccess: () => setCreateOpen(false) });
  };

  const handleUpdate = () => {
    if (!editing || !putForm.username.trim() || !putForm.roleId) return;
    const dto: UserPutDTO = { ...putForm };
    update.mutate({ id: editing.id, dto }, { onSuccess: () => setEditOpen(false) });
  };

  const handlePw = () => {
    if (!editing || !newPassword.trim()) return;
    changePw.mutate({ id: editing.id, password: newPassword }, { onSuccess: () => setPwOpen(false) });
  };

  const companyOptions = [{ value: "*", label: "Hamısı (*)" }, ...companies.map((c) => ({ value: String(c.id), label: c.name }))];

  const handleCompanyToggle = (val: string, current: string[], setter: (ids: string[]) => void) => {
    if (val === "*") { setter(current.includes("*") ? [] : ["*"]); return; }
    const filtered = current.filter((c) => c !== "*");
    setter(filtered.includes(val) ? filtered.filter((c) => c !== val) : [...filtered, val]);
  };

  const columns: Column<UserGetDTO>[] = [
    { key: "id", header: "ID", className: "w-16" },
    { key: "username", header: "İstifadəçi adı" },
    { key: "email", header: "E-poçt" },
    { key: "roles", header: "Rol", render: (r) => r.roles.map((rl) => <Badge key={rl} variant={rl === "Admin" ? "danger" : rl === "Manager" ? "warning" : "default"}>{rl}</Badge>) },
    { key: "isActive", header: "Status", render: (r) => <Badge variant={r.isActive ? "success" : "danger"}>{r.isActive ? "Aktiv" : "Blok"}</Badge> },
    { key: "privacyLevel", header: "Məxfilik", render: (r) => r.privacyLevel ?? "—" },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">İstifadəçilər</h1>
        <button onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"><Plus size={16} /> Yeni</button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={isLoading}
        actions={(row) => (
          <div className="flex justify-end gap-1">
            <button onClick={(e) => { e.stopPropagation(); openEdit(row); }} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" title="Redaktə"><Pencil size={15} /></button>
            <button onClick={(e) => { e.stopPropagation(); openPw(row); }} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" title="Şifrə"><KeyRound size={15} /></button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleActive.mutate({ id: row.id, isActive: !row.isActive }); }}
              className={`rounded p-1.5 ${row.isActive ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" : "text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"}`}
              title={row.isActive ? "Blokla" : "Aktivləşdir"}
            >
              {row.isActive ? <ShieldX size={15} /> : <ShieldCheck size={15} />}
            </button>
          </div>
        )}
      />

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Yeni istifadəçi" wide>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="İstifadəçi adı" value={postForm.username} onChange={(e) => setPostForm({ ...postForm, username: (e.target as HTMLInputElement).value })} />
            <Field label="E-poçt" type="email" value={postForm.email} onChange={(e) => setPostForm({ ...postForm, email: (e.target as HTMLInputElement).value })} />
          </div>
          <Field label="Şifrə" type="password" value={postForm.password} onChange={(e) => setPostForm({ ...postForm, password: (e.target as HTMLInputElement).value })} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Rol" placeholder="Seçin..." value={postForm.roleId} onChange={(e) => setPostForm({ ...postForm, roleId: Number(e.target.value) })} options={roles.map((r) => ({ value: r.id, label: r.name }))} />
            <Field label="Məxfilik səviyyəsi" type="number" value={postForm.privacyLevel} onChange={(e) => setPostForm({ ...postForm, privacyLevel: Number((e.target as HTMLInputElement).value) })} />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Qurumlar</label>
            <div className="flex flex-wrap gap-2">
              {companyOptions.map((o) => (
                <label key={o.value} className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={postForm.companyIds.includes(String(o.value))} onChange={() => handleCompanyToggle(String(o.value), postForm.companyIds, (ids) => setPostForm({ ...postForm, companyIds: ids }))} className="rounded border-gray-300" />
                  {o.label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setCreateOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Ləğv et</button>
            <button onClick={handleCreate} disabled={create.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Yarat</button>
          </div>
        </div>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="İstifadəçini redaktə et" wide>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="İstifadəçi adı" value={putForm.username} onChange={(e) => setPutForm({ ...putForm, username: (e.target as HTMLInputElement).value })} />
            <Field label="E-poçt" type="email" value={putForm.email} onChange={(e) => setPutForm({ ...putForm, email: (e.target as HTMLInputElement).value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Rol" placeholder="Seçin..." value={putForm.roleId} onChange={(e) => setPutForm({ ...putForm, roleId: Number(e.target.value) })} options={roles.map((r) => ({ value: r.id, label: r.name }))} />
            <Field label="Məxfilik səviyyəsi" type="number" value={putForm.privacyLevel} onChange={(e) => setPutForm({ ...putForm, privacyLevel: Number((e.target as HTMLInputElement).value) })} />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Qurumlar</label>
            <div className="flex flex-wrap gap-2">
              {companyOptions.map((o) => (
                <label key={o.value} className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={putForm.companyIds.includes(String(o.value))} onChange={() => handleCompanyToggle(String(o.value), putForm.companyIds, (ids) => setPutForm({ ...putForm, companyIds: ids }))} className="rounded border-gray-300" />
                  {o.label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setEditOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Ləğv et</button>
            <button onClick={handleUpdate} disabled={update.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Yenilə</button>
          </div>
        </div>
      </Modal>

      <Modal open={pwOpen} onClose={() => setPwOpen(false)} title={`Şifrə dəyiş: ${editing?.username}`}>
        <div className="space-y-4">
          <Field label="Yeni şifrə" type="password" value={newPassword} onChange={(e) => setNewPassword((e.target as HTMLInputElement).value)} />
          <div className="flex justify-end gap-3">
            <button onClick={() => setPwOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Ləğv et</button>
            <button onClick={handlePw} disabled={changePw.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Dəyiş</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}