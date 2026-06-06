import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../auth/AuthContext";

export default function AdminDashboard() {

  const { admin } = useAuth();

  const [stats, setStats] = useState({
    services: 0,
    activeServices: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =========================
     Load Dashboard Data
  ========================= */

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const servicesRes = await api.get("/services");

        const services = Array.isArray(servicesRes.data)
          ? servicesRes.data
          : servicesRes.data.data || [];

        setStats({
          services: services.length,
          activeServices: services.filter(s => s.is_active).length,
        });

      } catch (e) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* =========================
     UI
  ========================= */

  if (loading) {
    return (
      <div className="card bg-dark p-4 rounded-4">
        <div className="text-center text-secondary">
          Loading dashboard…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-dark p-4 rounded-4">
        <div className="alert alert-danger mb-0">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">

      {/* ================= HEADER ================= */}

      <div className="card bg-dark p-4 rounded-4 mb-4 shadow-sm">
        <h3 className="text-warning mb-1">
          Welcome back, {admin?.name}
        </h3>

        <div className="text-secondary">
          Admin Control Panel
        </div>
      </div>

      {/* ================= STATS ================= */}

      <div className="row g-3 mb-4">

        <StatCard
          title="Total Services"
          value={stats.services}
          subtitle="All configured services"
        />

        <StatCard
          title="Active Services"
          value={stats.activeServices}
          subtitle="Currently bookable"
        />

        <StatCard
          title="System Status"
          value="Online"
          subtitle="API responding"
        />

      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <div className="card bg-dark p-4 rounded-4 shadow-sm">
        <h5 className="text-warning mb-3">
          Quick Actions
        </h5>

        <div className="row g-3">

          <div className="col-md-4">
            <a href="/admin/services"
               className="btn btn-outline-warning w-100">
              Manage Services
            </a>
          </div>

          <div className="col-md-4">
            <a href="/admin/reservations"
               className="btn btn-outline-warning w-100">
              View Reservations
            </a>
          </div>

          <div className="col-md-4">
            <a href="/"
               className="btn btn-outline-secondary w-100">
              View Public Site
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}


/* =========================
   Reusable Stat Card
========================= */

function StatCard({ title, value, subtitle }) {
  return (
    <div className="col-md-4">
      <div className="card bg-dark p-3 rounded-4 shadow-sm h-100">

        <div className="text-secondary small">
          {title}
        </div>

        <div className="text-warning fs-3 fw-semibold">
          {value}
        </div>

        <div className="text-secondary small">
          {subtitle}
        </div>

      </div>
    </div>
  );
}
