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
            let data = [{"id":25,"name":"Japanese Head Spa","description":"massage for the body","price":"200.00","duration_minutes":60,"is_active":true,"created_at":"2026-02-17T15:54:08.000000Z","updated_at":"2026-02-17T15:54:08.000000Z","image_url":null},{"id":26,"name":"Eyebrow Contour","description":"spa for your foot","price":"150.00","duration_minutes":29,"is_active":true,"created_at":"2026-02-17T15:54:40.000000Z","updated_at":"2026-02-17T15:54:40.000000Z","image_url":null},{"id":24,"name":"Skincare Journey","description":"massage for the head yehey","price":"500.00","duration_minutes":40,"is_active":true,"created_at":"2026-02-17T15:42:47.000000Z","updated_at":"2026-02-17T15:55:17.000000Z","image_url":null}];
            if (typeof limit === "undefined") {
                const res = await api.get("/services");
                data = Array.isArray(res.data) ? res.data : res.data.data || [];
            }
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
    <>
        {limit === undefined ? (

        /* FULL CARD LAYOUT */
        <div className="row g-4 ">
            {services.map(service => (
            <div className="col-md-4" key={service.id}>
                <div className="card service-card h-100 overflow-hidden">

                <img
                    src={service.image_url || DEFAULT_IMAGE}
                    alt={service.name}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_IMAGE;
                    }}
                />

                <div className="card-body text-center d-flex flex-column p-4">
                    {/* TITLE */}
                    <h3
                        className="mb-2 gold-text"
                        style={{
                        letterSpacing: "1.5px",
                        fontFamily: "serif",
                        fontSize: "clamp(22px, 2vw, 34px)",
                        textTransform: "uppercase",
                        textShadow: "0 2px 10px rgba(0,0,0,0.08)",
                        lineHeight: "1.2"
                        }}
                    >
                        {service.name}
                    </h3>
                    {/* DESCRIPTION */}
                    <p
                        className="mb-4"
                        style={{
                        color: "#8F8B7E",
                        fontFamily: "sans-serif",
                        fontSize: "15px",
                        fontWeight: "300",
                        lineHeight: "1.7",
                        opacity: 0.9
                        }}
                    >
                        {service.description ?? "Luxury spa experience crafted for relaxation and wellness."}
                    </p>
                    {/* PRICE */}
                    <strong
                        style={{
                        color: "#8F8B7E",
                        fontSize: "22px",
                        fontWeight: "600",
                        letterSpacing: "1px"
                        }}
                    >
                        £{service.price ?? "0.00"}
                    </strong>
                    <button
                        className="btn btn-gold mt-auto"
                        onClick={() => handleBook(service)}
                    >
                        Book This Service
                    </button>
                </div>
                </div>
            </div>
            ))}
        </div>

        ) : (

        /* MINI HERO LAYOUT */
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

                    <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                        background: "rgba(244,245,239,0.55)"
                    }}
                    />

                    <div
                    className="position-absolute top-50 start-50 translate-middle text-center w-100 px-2"
                    >
                    <h3
                        className="mb-0 fw-semibold gold-text"
                        style={{
                        color: "#8F8B7E",
                        letterSpacing: "1.5px",
                        fontFamily: "serif",
                        fontSize: "clamp(20px, 2vw, 32px)",
                        textTransform: "uppercase",
                        textShadow: "0 2px 10px rgba(0,0,0,0.08)"
                        }}
                    >
                        {service.name}
                    </h3>
                    </div>

                </div>

                </div>

            </div>
            ))}
        </div>

        )}
    </>
    );
}
