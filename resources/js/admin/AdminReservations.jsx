import { useEffect, useState } from "react";
import api from "../lib/api";

export default function AdminReservations() {

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  /* =========================
     Load Reservations
  ========================= */

  useEffect(() => {
    load();
  }, [status]);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/admin/reservations", {
        params: {
          search: search || undefined,
          status: status || undefined,
        }
      });

      const data = res.data.data ?? res.data;
      setRows(data);

    } catch {
      setError("Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    };

  const formatTime = (time) => {
    if (!time) return "";

    const [hour, minute] = time.split(":");

    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);

    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
    };

  /* =========================
     UI
  ========================= */

  return (
    <div className="container-fluid px-0">

      {/* HEADER */}

      <div className="card bg-dark p-4 rounded-4 mb-4">
        <h4 className="gold-text mb-2">
          Reservations
        </h4>

        <div className="row g-2">

          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Search name or phone"
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={status}
              onChange={e=>setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="col-md-2">
            <button
              className="btn btn-outline-warning w-100"
              onClick={load}
            >
              Search
            </button>
          </div>

        </div>
      </div>

      {/* TABLE */}

      <div className="card bg-dark p-3 rounded-4 shadow-sm">

        {loading && (
          <div className="text-center text-secondary p-4">
            Loading reservations…
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {!loading && !error && rows.length === 0 && (
          <div className="text-secondary p-4 text-center">
            No reservations found.
          </div>
        )}

        {!loading && rows.length > 0 && (
          <div className="table-responsive">

            <table className="table table-dark table-hover align-middle mb-0">

              <thead>
                <tr className="text-warning">
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Services</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {rows.map(r => (
                  <tr key={r.id}>

                    <td>#{r.id}</td>

                    <td>
                      <div>{r.customer_name}</div>
                      <div className="small text-secondary">
                        {r.customer_phone}
                      </div>
                    </td>

                    <td>
                      {formatDate(r.reservation_date)}
                    </td>

                    <td>
                      {(r.services || []).map(s => (
                        <div key={s.id} className="small">
                          {s.name} - {formatTime(s.pivot.slot_time)}
                        </div>
                      ))}
                    </td>

                    <td>
                      <StatusBadge value={r.status} />
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>
    </div>
  );
}


/* =========================
   Status Badge
========================= */

function StatusBadge({ value }) {

  const map = {
    pending: "warning",
    confirmed: "success",
    cancelled: "secondary"
  };

  return (
    <span className={`badge bg-${map[value] || "secondary"}`}>
      {value}
    </span>
  );
}
