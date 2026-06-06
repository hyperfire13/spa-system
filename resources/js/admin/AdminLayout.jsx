import { Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { NavLink } from "react-router-dom";

export default function AdminLayout() {

  const { logout } = useAuth();

  return (
    <div className="min-vh-100 bg-black text-light">

      <nav className="navbar navbar-expand-lg bg-dark px-4 py-3 border-bottom border-secondary">

        <div className="container-fluid">

            {/* BRAND */}
            <span
            className="navbar-brand mb-0 h1 text-warning fw-bold"
            style={{
                letterSpacing: "1px"
            }}
            >
            Admin Panel
            </span>

            {/* NAVIGATION */}
            <div className="d-flex align-items-center gap-3">

            <NavLink
                to="/admin/services"
                className={({ isActive }) =>
                `btn btn-sm ${
                    isActive
                    ? "btn-warning text-dark"
                    : "btn-outline-warning"
                }`
                }
            >
                Manage Services
            </NavLink>

            <NavLink
                to="/admin/reservations"
                className={({ isActive }) =>
                `btn btn-sm ${
                    isActive
                    ? "btn-warning text-dark"
                    : "btn-outline-warning"
                }`
                }
            >
                View Reservations
            </NavLink>

            <button
                className="btn btn-outline-danger btn-sm"
                onClick={logout}
            >
                Logout
            </button>

            </div>

        </div>

        </nav>

      <div className="container py-4">
        <Outlet />
      </div>

    </div>
  );
}
