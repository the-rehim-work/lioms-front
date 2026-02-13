import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { useMe } from "@/hooks/use-auth";
import Spinner from "@/components/Spinner";

export default function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const { isLoading } = useMe();

  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner className="h-8 w-8" />
      </div>
    );

  return <>{children}</>;
}