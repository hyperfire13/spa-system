import { useState } from "react";

export default function ReservationForm({ service }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.date || !form.time) {
      setError("Please complete all fields.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // LATER: connect to API
      // await api.post("/reservations", {
      //   ...form,
      //   service_id: service.id,
      // });

      setSuccess("Your reservation has been submitted!");
      setForm({ name: "", phone: "", date: "", time: "" });
    } catch {
      setError("Failed to submit reservation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card p-4 shadow-sm border-0 rounded-4 bg-dark">

          <h5 className="gold-text mb-3">
            Service: {service.name}
          </h5>

          <p className="gold-text mb-3">
            Price: ₱{service.price}
          </p>

          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}

          <form onSubmit={handleSubmit}>
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

            <input
              type="date"
              className="form-control mb-3"
              name="date"
              value={form.date}
              onChange={handleChange}
            />

            <input
              type="time"
              className="form-control mb-3"
              name="time"
              value={form.time}
              onChange={handleChange}
            />

            <button className="btn btn-gold w-100" disabled={submitting}>
              {submitting ? "Submitting..." : "Confirm Reservation"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
