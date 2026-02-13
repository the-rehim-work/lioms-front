import { Navigate } from "react-router-dom";
import { useAuth } from "./auth.store";

export default function Protected({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/" replace />;
  return children;
}
