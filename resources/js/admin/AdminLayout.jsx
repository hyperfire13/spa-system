import { Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminLayout() {

  const { logout } = useAuth();

  return (
    <div className="min-vh-100 bg-black text-light">

      <nav className="navbar bg-dark px-4">
        <span className="gold-text fw-bold">
          Admin Panel
        </span>

        <button
          className="btn btn-outline-warning btn-sm"
          onClick={logout}
        >
          Logout
        </button>
      </nav>

      <div className="container py-4">
        <Outlet />
      </div>

    </div>
  );
}
