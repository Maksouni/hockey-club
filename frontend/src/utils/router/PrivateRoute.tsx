import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

interface PrivateRouteProps {
  role?: string;
}

export default function PrivateRoute({
  role: requiredRole,
}: PrivateRouteProps) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
