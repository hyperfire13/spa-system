import { useEffect, useState } from "react";
import api from "../lib/api";

export default function ReservationForm({ service }) {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
  });
  const [slots, setSlots] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(
    service ? [service] : []
  );

  const [loadingServices, setLoadingServices] = useState(true);
  const [error, setError] = useState(null);

  /* =========================
     Load services + schedules
  ========================= */

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/services-with-schedules");
        setAllServices(res.data);
      } catch {
        setError("Failed to load services.");
      } finally {
        setLoadingServices(false);
      }
    };

    load();
  }, []);

  /* =========================
     Filter by selected date
  ========================= */

  useEffect(() => {
    if (!form.date || allServices.length === 0) {
      setAvailableServices([]);
      return;
    }

    const day = new Date(form.date).getDay(); // 0–6

    const filtered = allServices.filter(svc =>
      svc.schedules.some(s => s.day_of_week === day)
    );

    setAvailableServices(filtered);

    // remove selections not valid for that day
    setSelectedServices(prev =>
      prev.filter(sel =>
        filtered.some(f => f.id === sel.id)
      )
    );

  }, [form.date, allServices]);

  useEffect(() => {
    if (!form.date || selectedServices.length === 0) {
      setSlots([]);
      return;
    }

    api.get(`/services/${selectedServices[0].id}/slots`, {
      params: { date: form.date }
    })
    .then(res => setSlots(res.data))
    .catch(() => setSlots([]));

  }, [form.date, selectedServices]);


  /* =========================
     Handlers
  ========================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleService = (svc) => {
    setSelectedServices(prev =>
      prev.some(s => s.id === svc.id)
        ? prev.filter(s => s.id !== svc.id)
        : [...prev, svc]
    );
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card bg-dark p-4 rounded-4 shadow-sm">

          <h4 className="gold-text text-center mb-3">
            Book Appointment
          </h4>

          {error && <p className="text-danger text-center">{error}</p>}

          <input
            className="form-control mb-3"
            placeholder="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            placeholder="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          {/* DATE FIRST */}

          <label className="gold-text mb-1">
            Select Date
          </label>

          <input
            type="date"
            className="form-control mb-3"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          {/* SERVICES BASED ON DATE */}

          <h6 className="gold-text">
            Available Services
          </h6>

          {loadingServices && <p className="text-muted">Loading...</p>}

          {!loadingServices && form.date && availableServices.length === 0 && (
            <p className="text-warning">
              No services available on this day.
            </p>
          )}

          <div style={{ maxHeight: 180, overflowY: "auto" }}>
            {availableServices.map(svc => (
              <div key={svc.id} className="form-check text-start">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedServices.some(s => s.id === svc.id)}
                  onChange={() => toggleService(svc)}
                />
                <label className="form-check-label gold-text">
                  {svc.name} — ₱{svc.price}
                </label>
              </div>
            ))}
          </div>

          {/* TIME — next step will be slot-driven */}

          <select
            className="form-control mt-3"
            name="time"
            value={form.time}
            onChange={handleChange}
          >
            <option value="">Select Time Slot</option>

            {slots.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
