import { useEffect, useState } from "react";
import api from "../lib/api";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";

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
          <div className="card service-card h-100">
            <div className="card-body text-center">
              <h5 className="gold-text">{service.name}</h5>
              <p className="text-muted">{service.description}</p>
              <strong className="gold-text">₱{service.price}</strong>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
