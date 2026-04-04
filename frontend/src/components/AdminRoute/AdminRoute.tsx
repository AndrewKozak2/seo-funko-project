import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const user = useAuthStore((state) => state.user);

  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
