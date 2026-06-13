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
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    const fetchServices = async () => {
        try {
            let data = [{"id":25,"name":"Japanese Head Spa","description":"massage for the body","price":"200.00","duration_minutes":60,"is_active":true,"created_at":"2026-02-17T15:54:08.000000Z","updated_at":"2026-02-17T15:54:08.000000Z","image_url":null},{"id":26,"name":"Eyebrow Contour","description":"spa for your foot","price":"150.00","duration_minutes":29,"is_active":true,"created_at":"2026-02-17T15:54:40.000000Z","updated_at":"2026-02-17T15:54:40.000000Z","image_url":null},{"id":24,"name":"Skincare Journey","description":"massage for the head yehey","price":"500.00","duration_minutes":40,"is_active":true,"created_at":"2026-02-17T15:42:47.000000Z","updated_at":"2026-02-17T15:55:17.000000Z","image_url":null}];
            if (typeof limit === "undefined") {
                const res = await api.get("/services-with-schedules");
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
  const categories = [
    "ALL",
    ...new Set(
        services.map(service => service.description)
    )
  ];

  const filteredServices =
    selectedCategory === "ALL"
      ? services
      : services.filter(
          service => service.description === selectedCategory
        );

  const groupedServices = filteredServices.reduce((acc, service) => {
    const key = service.description || "OTHER";

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(service);

    return acc;
  }, {});

  const handleBook = (service) => {
    navigate("/reservation", { state: { service } });
  };

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
    ];

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

    return (
    <>
        {limit === undefined ? (

        /* FULL CARD LAYOUT */
        <div className="container font-nourd">
            {/* FILTER */}
            <div className="d-flex justify-content-center mb-5 gold-text">
                <select
                className="form-select gold-text"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                    maxWidth: "320px",
                    borderRadius: "0",
                    border: "1px solid #CFC8B8",
                    padding: "12px 18px",
                    boxShadow: "none"
                }}
                >
                {categories.map(category => (
                    <option key={category} value={category}>
                    {category}
                    </option>
                ))}
                </select>
            </div>
            {/* GROUPED SERVICES */}
            {Object.entries(groupedServices).map(([group, items]) => (
                <div key={group} className="mb-5">

                {/* CATEGORY HEADER */}
                <div className="text-center mb-4 gold-text font-nourd">
                    <h2
                    style={{
                        fontSize: "clamp(2rem, 4vw, 3rem)",
                        letterSpacing: "2px",
                        textTransform: "uppercase"
                    }}
                    >
                    {group}
                    </h2>

                    <div
                    className="mx-auto mt-2 gold-text"
                    style={{
                        width: "80px",
                        height: "1px",
                        background: "#CFC8B8"
                    }}
                    />

                </div>

                {/* SERVICES */}
                <div className="row g-3">
                    {items.map(service => (
                    <div className="col-md-4 col-lg-3" key={service.id}>
                        <div
                        className="card border-0 h-100 overflow-hidden"
                        style={{
                            background: "#FAF8F4",
                            transition: "0.3s ease"
                        }}
                        >
                        {/* IMAGE */}
                        <img
                            src={service.image_url || DEFAULT_IMAGE}
                            alt={service.name}
                            className="card-img-top"
                            style={{
                            height: "170px",
                            objectFit: "cover"
                            }}
                            onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_IMAGE;
                            }}
                        />
                        {/* BODY */}
                        <div className="card-body text-center p-3 gold-text">
                            <h5
                            className="mb-2"
                            style={{
                                fontSize: "20px",
                                textTransform: "uppercase",
                                lineHeight: "1.3"
                            }}
                            >
                            {service.name}
                            </h5>
                            {/* <p
                            style={{

                                fontSize: "13px",
                                opacity: 0.8,
                                minHeight: "55px"
                            }}
                            >
                            Luxury spa experience crafted for relaxation and wellness.
                            </p> */}
                            <div
                            className="mb-3"
                            style={{
                                color: "#8F8B7E",
                                fontWeight: "600",
                                fontSize: "20px"
                            }}
                            >
                            £{service.price}
                            </div>
                            <div className="mb-3">

                                {(service.schedules || []).length > 0 ? (

                                    (service.schedules || []).map(schedule => (
                                    <div
                                        key={schedule.id}
                                        className="small text-secondary"
                                    >
                                        {days[schedule.day_of_week]} •{" "}
                                        {formatTime(schedule.start_time)} -{" "}
                                        {formatTime(schedule.end_time)}
                                    </div>
                                    ))

                                ) : (

                                    <div className="small gold-text">
                                    Schedule will be announced soon.
                                    </div>

                                )}

                            </div>
                            <button
                            className="btn btn-gold w-100 "
                            onClick={() => handleBook(service)}
                            >
                            BOOK NOW
                            </button>
                        </div>

                        </div>
                    </div>
                    ))}

                </div>

                </div>
            ))}

        </div>

        ) : (

        /* MINI HERO LAYOUT */
        <div className="row g-4 font-nourd">
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
