import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import DataTable, { type Column } from "@/components/DataTable";
import Modal from "@/components/Modal";
import Field from "@/components/Field";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useFunctionalFields, useCreateFunctionalField, useUpdateFunctionalField, useDeleteFunctionalField } from "@/hooks/use-lookups";
import { useAuthStore } from "@/stores/auth";
import type { FunctionalFieldGetDTO, FunctionalFieldPostDTO, FunctionalFieldPutDTO } from "@/types";

const empty = { name: "", code: "", serialNumber: 0 };

export default function FunctionalFields() {
  const { isAdmin } = useAuthStore();
  const { data = [], isLoading } = useFunctionalFields();
  const create = useCreateFunctionalField();
  const update = useUpdateFunctionalField();
  const remove = useDeleteFunctionalField();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState(empty);

  const openCreate = () => { setForm(empty); setModalOpen(true); };

  const handleCreate = () => {
    if (!form.name.trim()) return;
    const dto: FunctionalFieldPostDTO = { ...form };
    create.mutate(dto, { onSuccess: () => setModalOpen(false) });
  };

  const handleInlineEdit = (row: FunctionalFieldGetDTO, changes: Record<string, unknown>) => {
    const dto: FunctionalFieldPutDTO = {
      id: row.id,
      name: (changes.name as string) ?? row.name,
      code: (changes.code as string) ?? row.code,
      serialNumber: (changes.serialNumber as number) ?? row.serialNumber,
    };
    update.mutate({ id: row.id, dto });
  };

  const columns: Column<FunctionalFieldGetDTO>[] = [
    { key: "id", header: "ID", className: "w-16" },
    { key: "name", header: "Ad", editable: isAdmin() },
    { key: "code", header: "Kod", editable: isAdmin() },
    { key: "serialNumber", header: "Sıra nömrəsi", editable: isAdmin(), editType: "number" },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Funksional Sahələr</h1>
        {isAdmin() && (
          <button onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"><Plus size={16} /> Yeni</button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        onInlineEdit={isAdmin() ? handleInlineEdit : undefined}
        actions={isAdmin() ? (row) => (
          <button onClick={(e) => { e.stopPropagation(); setDeleteId(row.id); }} className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={15} /></button>
        ) : undefined}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Yeni sahə">
        <div className="space-y-4">
          <Field label="Ad" value={form.name} onChange={(e) => setForm({ ...form, name: (e.target as HTMLInputElement).value })} />
          <Field label="Kod" value={form.code} onChange={(e) => setForm({ ...form, code: (e.target as HTMLInputElement).value })} />
          <Field label="Sıra nömrəsi" type="number" value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: Number((e.target as HTMLInputElement).value) })} />
          <div className="flex justify-end gap-3">
            <button onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Ləğv et</button>
            <button onClick={handleCreate} disabled={create.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Yarat</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) remove.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }} loading={remove.isPending} />
    </div>
  );
}