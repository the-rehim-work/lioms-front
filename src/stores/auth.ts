import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserGetDTO, Role } from "@/types";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserGetDTO | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: UserGetDTO) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: Role) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
  isViewer: () => boolean;
  canWrite: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setUser: (user) => set({ user }),

      logout: () => set({ accessToken: null, refreshToken: null, user: null }),

      isAuthenticated: () => !!get().accessToken,

      hasRole: (role) => get().user?.roles.includes(role) ?? false,

      isAdmin: () => get().user?.roles.includes("Admin") ?? false,

      isManager: () => get().user?.roles.includes("Manager") ?? false,

      isViewer: () => get().user?.roles.includes("Viewer") ?? false,

      canWrite: () => {
        const roles = get().user?.roles ?? [];
        return roles.includes("Admin") || roles.includes("Manager");
      },
    }),
    {
      name: "lioms-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);