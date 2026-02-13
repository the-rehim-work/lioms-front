import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { useLogin } from "@/hooks/use-auth";

export default function Login() {
  const { isAuthenticated } = useAuthStore();
  const login = useLogin();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  if (isAuthenticated()) return <Navigate to="/" replace />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !password.trim()) return;
    login.mutate({ userName, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800"
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          LİOMS
        </h1>

        <div className="mb-4 space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            İstifadəçi adı
          </label>
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            autoFocus
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-6 space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Şifrə
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {login.isPending ? "Giriş edilir..." : "Giriş"}
        </button>
      </form>
    </div>
  );
}