import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type RequireAdminProps = {
  children: ReactNode;
  redirectTo?: string;
};

export default function RequireAdmin({ children, redirectTo = "/visite" }: RequireAdminProps) {
  const { isAdmin, loading } = useCurrentUser();
  if (loading) return null;
  if (!isAdmin) return <Navigate to={redirectTo} replace />;
  return <>{children}</>;
}
