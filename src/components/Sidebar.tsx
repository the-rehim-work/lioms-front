import { NavLink } from "react-router-dom";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  FolderKanban,
  Building2,
  CalendarRange,
  Layers,
  Puzzle,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";

const nav = [
  { to: "/", label: "Panel", icon: LayoutDashboard },
  { to: "/projects", label: "Layihələr", icon: FolderKanban },
  { to: "/companies", label: "Qurumlar", icon: Building2 },
  { to: "/plans", label: "Planlar", icon: CalendarRange },
  { to: "/states", label: "Vəziyyətlər", icon: Layers },
  { to: "/details", label: "Detallar", icon: Puzzle },
  { to: "/functional-fields", label: "Funksional Sahələr", icon: SlidersHorizontal },
];

const adminNav = [{ to: "/users", label: "İstifadəçilər", icon: Users }];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { isAdmin } = useAuthStore();
  const items = isAdmin() ? [...nav, ...adminNav] : nav;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform dark:border-gray-700 dark:bg-gray-800 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5 dark:border-gray-700">
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            LİOMS
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  "mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}