import { Menu, Moon, Sun, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
import { useLogout } from "@/hooks/use-auth";
import Badge from "./Badge";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const logout = useLogout();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800 lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">{user.username}</span>
            {user.roles.map((r) => (
              <Badge
                key={r}
                variant={r === "Admin" ? "danger" : r === "Manager" ? "warning" : "default"}
              >
                {r}
              </Badge>
            ))}
          </div>
        )}

        <button
          onClick={toggle}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={() => logout.mutate()}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}