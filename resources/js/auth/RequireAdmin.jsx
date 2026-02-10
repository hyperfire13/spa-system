import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAdmin({ children }) {

  const { admin, loading } = useAuth();

  if (loading) return <div className="p-5 text-center">Loading...</div>;

  if (!admin) return <Navigate to="/admin/login" replace />;

  return children;
}
