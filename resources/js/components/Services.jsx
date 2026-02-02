import { useEffect, useState } from "react";
import api from "../lib/api";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";

const DEFAULT_IMAGE = "/images/default-img.webp";

export default function Services({ limit }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setServices(limit ? data.slice(0, limit) : data);
      } catch {
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [limit]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="row g-4">
      {services.map(service => (
        <div className="col-md-4" key={service.id}>
          <div className="card service-card h-100 overflow-hidden">

            {/* IMAGE */}
            <img
              src={service.image_url || DEFAULT_IMAGE}
              alt={service.name}
              className="card-img-top"
              style={{ height: "200px", objectFit: "cover" }}
              onError={(e) => {
                e.target.onerror = null; // prevent infinite loop
                e.target.src = DEFAULT_IMAGE;
              }}
            />

            {/* CONTENT */}
            <div className="card-body text-center bg-dark">
              <h5 className="gold-text">{service.name}</h5>

              <p className="gold-text">
                {service.description ?? "No description available."}
              </p>

              <strong className="gold-text">
                ₱{service.price ?? "0.00"}
              </strong>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}
