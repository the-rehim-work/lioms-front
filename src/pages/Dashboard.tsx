import { useProjectSummaries } from "@/hooks/use-projects";
import { useCompanies } from "@/hooks/use-lookups";
import { useAuthStore } from "@/stores/auth";
import Spinner from "@/components/Spinner";
import { FolderKanban, Building2, Layers, FileText } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { data: projects, isLoading: pLoading } = useProjectSummaries();
  const { data: companies, isLoading: cLoading } = useCompanies();

  if (pLoading || cLoading)
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );

  const totalProjects = projects?.length ?? 0;
  const totalCompanies = companies?.length ?? 0;
  const totalDetails = projects?.reduce((s, p) => s + p.projectDetailCount, 0) ?? 0;
  const totalFiles = projects?.reduce((s, p) => s + p.projectFileCount, 0) ?? 0;

  const cards = [
    { label: "Layihələr", value: totalProjects, icon: FolderKanban, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400" },
    { label: "Qurumlar", value: totalCompanies, icon: Building2, color: "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400" },
    { label: "Detallar", value: totalDetails, icon: Layers, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400" },
    { label: "Fayllar", value: totalFiles, icon: FileText, color: "text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Xoş gəldiniz, {user?.username}
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2.5 ${c.color}`}>
                <c.icon size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{c.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{c.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}