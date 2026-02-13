import { useState, useMemo, useCallback } from "react";
import { clsx } from "clsx";
import { ChevronUp, ChevronDown, Search, Pencil, Check, X } from "lucide-react";
import Spinner from "./Spinner";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  editable?: boolean;
  editType?: "text" | "number" | "select";
  editOptions?: { value: string | number; label: string }[];
  editRender?: (value: unknown, onChange: (val: unknown) => void) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  keyField?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  actions?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
  onInlineEdit?: (row: T, changes: Record<string, unknown>) => void;
  emptyText?: string;
}

type SortDir = "asc" | "desc" | null;

export default function DataTable<T>({
  columns,
  data,
  loading,
  keyField = "id",
  searchable = true,
  searchPlaceholder = "Axtar...",
  pageSize = 15,
  actions,
  onRowClick,
  onInlineEdit,
  emptyText = "Məlumat tapılmadı",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(0);
  const [editingId, setEditingId] = useState<unknown>(null);
  const [editDraft, setEditDraft] = useState<Record<string, unknown>>({});

  const rec = useCallback((row: T) => row as Record<string, unknown>, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const term = search.toLowerCase();
    return data.filter((row) => {
      const r = rec(row);
      return columns.some((col) => {
        if (col.render) return false;
        const val = r[col.key];
        return val != null && String(val).toLowerCase().includes(term);
      });
    });
  }, [data, search, columns, rec]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = rec(a)[sortKey];
      const bVal = rec(b)[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir, rec]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : sortDir === "desc" ? null : "asc");
      if (sortDir === "desc") setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  };

  const hasEditable = onInlineEdit && columns.some((c) => c.editable);

  const startEdit = (row: T) => {
    const r = rec(row);
    setEditingId(r[keyField]);
    const draft: Record<string, unknown> = {};
    columns.filter((c) => c.editable).forEach((c) => { draft[c.key] = r[c.key]; });
    setEditDraft(draft);
  };

  const cancelEdit = () => { setEditingId(null); setEditDraft({}); };

  const saveEdit = (row: T) => {
    onInlineEdit?.(row, editDraft);
    setEditingId(null);
    setEditDraft({});
  };

  const renderEditCell = (col: Column<T>) => {
    const val = editDraft[col.key];

    if (col.editRender) {
      return col.editRender(val, (v) => setEditDraft({ ...editDraft, [col.key]: v }));
    }

    if (col.editType === "select" && col.editOptions) {
      return (
        <select
          value={String(val ?? "")}
          onChange={(e) => setEditDraft({ ...editDraft, [col.key]: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value) })}
          className="w-full rounded border border-blue-400 bg-white px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500 dark:border-blue-600 dark:bg-gray-700 dark:text-white"
        >
          {col.editOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={col.editType === "number" ? "number" : "text"}
        value={val == null ? "" : String(val)}
        onChange={(e) => setEditDraft({ ...editDraft, [col.key]: col.editType === "number" ? Number(e.target.value) : e.target.value })}
        onKeyDown={(e) => { if (e.key === "Escape") cancelEdit(); }}
        className="w-full rounded border border-blue-400 bg-white px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500 dark:border-blue-600 dark:bg-gray-700 dark:text-white"
        autoFocus
      />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div>
      {searchable && (
        <div className="relative mb-4 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={col.sortable !== false ? () => handleSort(col.key) : undefined}
                  className={clsx(
                    "px-4 py-3 font-medium text-gray-600 dark:text-gray-300",
                    col.sortable !== false && "cursor-pointer select-none hover:text-gray-900 dark:hover:text-white",
                    col.className
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable !== false && sortKey === col.key && (
                      sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </span>
                </th>
              ))}
              {(actions || hasEditable) && (
                <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">Əməliyyat</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions || hasEditable ? 1 : 0)} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {emptyText}
                </td>
              </tr>
            ) : (
              paged.map((row) => {
                const r = rec(row);
                const rowId = r[keyField];
                const isEditing = editingId != null && editingId === rowId;

                return (
                  <tr
                    key={String(rowId)}
                    onClick={!isEditing && onRowClick ? () => onRowClick(row) : undefined}
                    className={clsx(
                      "bg-white dark:bg-gray-800",
                      isEditing && "bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-inset ring-blue-200 dark:ring-blue-800",
                      !isEditing && onRowClick && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    )}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={clsx("px-4 py-2.5 text-gray-700 dark:text-gray-200", col.className)}>
                        {isEditing && col.editable
                          ? renderEditCell(col)
                          : col.render
                            ? col.render(row)
                            : (r[col.key] as React.ReactNode) ?? "—"}
                      </td>
                    ))}
                    {(actions || hasEditable) && (
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isEditing ? (
                            <>
                              <button onClick={() => saveEdit(row)} className="rounded p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" title="Yadda saxla"><Check size={15} /></button>
                              <button onClick={cancelEdit} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" title="Ləğv et"><X size={15} /></button>
                            </>
                          ) : (
                            <>
                              {hasEditable && (
                                <button onClick={(e) => { e.stopPropagation(); startEdit(row); }} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700" title="Redaktə">
                                  <Pencil size={15} />
                                </button>
                              )}
                              {actions?.(row)}
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            {sorted.length} nəticədən {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)}
          </span>
          <div className="flex gap-1">
            <button disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-40 dark:border-gray-600 dark:hover:bg-gray-700">
              Əvvəlki
            </button>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-40 dark:border-gray-600 dark:hover:bg-gray-700">
              Növbəti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}