import { useEffect, useState, useRef } from "react";
import api from "../lib/api";

export default function ReservationForm({ service }) {
  const initialForm = {
    name: "",
    phone: "",
    date: "",
  };
  const [form, setForm] = useState(initialForm);
  const [allServices, setAllServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(
    service ? [service] : []
  );
  const [serviceSlots, setServiceSlots] = useState({});
  const [slotOptions, setSlotOptions] = useState({});
  const [loadingServices, setLoadingServices] = useState(true);
  const [error, setError] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const errorRef = useRef(null);
  const [cardAnim, setCardAnim] = useState("");



  /* =========================
     Load services + schedules
  ========================= */
  useEffect(() => {
    if (success) {
      setCardAnim("card-shake");
      setTimeout(() => setCardAnim(""), 1200);
    }
  }, [success]);

  useEffect(() => {
    if (error && (Array.isArray(error) ? error.length : true)) {
      setCardAnim("card-shake");
      setTimeout(() => setCardAnim(""), 600);
    }
  }, [error]);

  // this will auto scroll up when error messages are shown
  useEffect(() => {
    if (error && (Array.isArray(error) ? error.length > 0 : true)) {
      errorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, [error]);


  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/services-with-schedules");
        setAllServices(res.data);
      } catch {
        setError(["Failed to load services."]);
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
    if (!form.date) {
      setSlotOptions({});
      setServiceSlots({});
      return;
    }

    // reload slots for all selected services
    selectedServices.forEach(svc => {
      loadSlotsForService(svc.id);
    });

  }, [form.date, selectedServices]);

  const loadSlotsForService = async (serviceId) => {
    if (!form.date) return;

    try {
      const res = await api.get(`/services/${serviceId}/slots`, {
        params: { date: form.date }
      });

      setSlotOptions(prev => ({
        ...prev,
        [serviceId]: res.data
      }));

    } catch (e) {
      console.error("Slot load failed", e);
      setSlotOptions(prev => ({
        ...prev,
        [serviceId]: []
      }));
    }
  };

  /* =========================
     Handlers
  ========================= */

  const handleSubmit = async () => {
    setError([]);
    setSuccess(null);

    if (!form.name || !form.phone || !form.date) {
      setError(["Please complete required fields"]);
      return;
    }

    for (const svc of selectedServices) {
      if (!serviceSlots[svc.id]) {
        setError([`Select time for ${svc.name}`]);
        return;
      }
    }
    try {
      setSubmitting(true);
      await api.post("/reservations", {
        customer_name: form.name,
        customer_phone: form.phone,
        reservation_date: form.date,
        services: selectedServices.map(s => ({
          service_id: s.id,
          slot_time: serviceSlots[s.id]
        }))
      });
      setError([]);
      setSuccess("Reservation submitted successfully!");
      setSelectedServices([]);
      setServiceSlots({});
      setSlotOptions({});
      setForm(initialForm);

    } catch (e) {
      if (e.response?.data?.errors) {
        // Laravel validation error
        const all = Object.values(e.response.data.errors).flat();
        setError(all);
      } else {
        setError([
          e.response?.data?.message ||
          "Reservation failed. Please try again."
        ]);
      }
    } finally {
        setSubmitting(false);
      }
    };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleService = (svc) => {
    setSelectedServices(prev => {
      const exists = prev.some(s => s.id === svc.id);
      if (exists) {
        setServiceSlots(slots => {
          const copy = { ...slots };
          delete copy[svc.id];
          return copy;
        });

        setSlotOptions(prev => {
          const copy = { ...prev };
          delete copy[svc.id];
          return copy;
        });


        return prev.filter(s => s.id !== svc.id);
      }
      return [...prev, svc];
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
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card  p-4 rounded-4 shadow-sm">
          <h6 className="gold-text text-center mb-3 fs-5">
            Please enter your details and select a date to see available services.
          </h6>
          {/* <p className="text-white">{JSON.stringify(selectedServices)}</p>
          <p className="text-white">{JSON.stringify(serviceSlots)}</p> */}
          {submitting && (
            <div className="text-center gold-text mb-3">
              Processing reservation...
            </div>
          )}
          {error.length > 0 && (
            <div ref={errorRef} className={`alert alert-danger text-start ${cardAnim}`}>
              <ul className="mb-0 ps-3">
                {(Array.isArray(error) ? error : [error]).map((msg, i) => (
                  <li key={i}>* {msg}</li>
                ))}
              </ul>
            </div>
          )}

          {success && (
            <div className={`alert alert-success ${cardAnim}`}>
              {success}
            </div>
          )}

          <input
            className="form-control mb-3"
            placeholder="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            className="form-control mb-3"
            placeholder="Phone Number"
            name="phone"
            value={form.phone}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, "");
              setForm(prev => ({
                ...prev,
                phone: digitsOnly
              }));
            }}
          />
          {/* DATE FIRST */}
          <label className="gold-text mb-1 fs-5">
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

          <h6 className="gold-text fs-5">
            Available Services
          </h6>

          {loadingServices && <p className="text-muted">Loading...</p>}

          {!loadingServices && form.date && availableServices.length === 0 && (
            <p className="text-warning">
              No services available on this day.
            </p>
          )}

          <div style={{ maxHeight: 180, overflowY: "auto" }} className="mb-4 fs-5">
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
          {/* SELECTED SERVICES + SLOT — INLINE */}

          {selectedServices.map(svc => (
            <div
              key={svc.id}
              className="row align-items-center g-2 mb-3 p-2 rounded-3"

            >

              {/* LEFT — SERVICE INFO */}
              <div className="col-12 col-md-6 fs-5">

                <div className="gold-text fw-semibold">
                  {svc.name}
                </div>

                <div className="small gold-text opacity-75">
                  Duration: {svc.duration_minutes ?? "—"} min
                  &nbsp;•&nbsp;
                  £{svc.price}
                </div>

              </div>

              {/* RIGHT — SLOT SELECT */}
              <div className="col-12 col-md-6">

                <select
                  className="form-select"
                  disabled={(slotOptions[svc.id] || []).length === 0}
                  value={serviceSlots[svc.id] || ""}
                  onChange={(e) =>
                    setServiceSlots(prev => ({
                      ...prev,
                      [svc.id]: e.target.value
                    }))
                  }
                >
                  <option value="">Select Time Slot</option>

                  {(slotOptions[svc.id] || []).map(slot => (
                    <option key={slot} value={slot}>
                        {formatTime(slot)}
                    </option>
                  ))}
                </select>

                {(slotOptions[svc.id] || []).length === 0 && (
                  <small className="text-warning">
                    No slots available
                  </small>
                )}

              </div>

            </div>
          ))}
          <button
            className="btn btn-gold w-100 mt-3"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Submitting..." : "Confirm Reservation"}
          </button>
        </div>
      </div>
    </div>
  );
}
