import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";

const DEFAULT_IMAGE = "/images/default-img.webp";

export default function Services({ limit }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleBook = (service) => {
    navigate("/reservation", { state: { service } });
  };

  return (
    <div className="row g-4">
  {services.map(service => (
    <div className="col-md-4" key={service.id}>

      <div className="card service-card border-0 overflow-hidden">

        <div
          className="position-relative"
          style={{
            height: "120px",
            background: "#F4F5EF"
          }}
        >

          {/* IMAGE */}
          <img
            src={service.image_url || DEFAULT_IMAGE}
            alt={service.name}
            className="w-100 h-100"
            style={{
              objectFit: "cover",
              opacity: 0.28,
              filter: "grayscale(20%) sepia(15%)"
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_IMAGE;
            }}
          />

          {/* LIGHT OVERLAY */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background: "rgba(244,245,239,0.55)"
            }}
          />

          {/* CENTER TEXT */}
          <div
            className="position-absolute top-50 start-50 translate-middle text-center w-100 px-2"
          >
            <h6
              className="mb-0 fw-normal"
              style={{
                color: "#8F8B7E",
                letterSpacing: "0.5px",
                fontFamily: "serif",
                fontSize: "18px"
              }}
            >
              {service.name}
            </h6>
          </div>

        </div>

      </div>

    </div>
  ))}
</div>
  );
}
