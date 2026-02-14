import { useState } from "react";
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
  Moon,
  Sun,
  LogOut,
  KeyRound,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
import { useLogout } from "@/hooks/use-auth";
import { useChangePassword } from "@/hooks/use-users";
import Badge from "./Badge";
import Modal from "./Modal";
import Field from "./Field";

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
  const { user, isAdmin } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const logout = useLogout();
  const changePw = useChangePassword();
  const items = isAdmin() ? [...nav, ...adminNav] : nav;

  const [pwOpen, setPwOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handlePwChange = () => {
    if (!user || !newPassword.trim()) return;
    changePw.mutate(
      { id: user.id, password: newPassword },
      { onSuccess: () => { setPwOpen(false); setNewPassword(""); } }
    );
  };

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
        <div className="relative border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <X size={18} />
          </button>

          <NavLink
            to="/"
            onClick={onClose}
            className="flex flex-col items-center px-5 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
          >
            <img
              src="/Azerbaijan_MOD_badge.svg"
              alt="MN"
              className="h-20 w-20 object-contain"
            />
            <span className="mt-2 text-center text-md font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
              Layihələrin İdarə Olunması Sistemi
            </span>
          </NavLink>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  "mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
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

        <div className="border-t border-gray-200 px-3 py-3 dark:border-gray-700">
          {user && (
            <div className="mb-3 rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-900/50">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                  <div className="flex gap-1">
                    {user.roles.map((r) => (
                      <Badge
                        key={r}
                        variant={r === "Admin" ? "danger" : r === "Manager" ? "warning" : "default"}
                      >
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={toggle}
              className="flex-1 flex items-center justify-center rounded-lg py-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
              title={theme === "dark" ? "Açıq tema" : "Tünd tema"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setPwOpen(true)}
              className="flex-1 flex items-center justify-center rounded-lg py-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
              title="Şifrə dəyiş"
            >
              <KeyRound size={16} />
            </button>
            <button
              onClick={() => logout.mutate()}
              className="flex-1 flex items-center justify-center rounded-lg py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Çıxış"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <Modal open={pwOpen} onClose={() => setPwOpen(false)} title="Şifrə dəyiş">
        <div className="space-y-4">
          <Field
            label="Yeni şifrə"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword((e.target as HTMLInputElement).value)}
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setPwOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Ləğv et
            </button>
            <button
              onClick={handlePwChange}
              disabled={changePw.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Dəyiş
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}