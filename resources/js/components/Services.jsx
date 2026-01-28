import { useEffect, useState } from "react";
import axios from "axios";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("/api/services");

        // Handle different possible API shapes safely
        const data = response.data;

        if (Array.isArray(data)) {
          setServices(data);
        } else if (Array.isArray(data.data)) {
          setServices(data.data); // Laravel paginator or resource
        } else {
          throw new Error("Invalid service data format");
        }

      } catch (err) {
        console.error("Service fetch error:", err);
        setError("Unable to load services at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="py-5 text-center">
        <p className="text-muted">Loading services...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-5 text-center">
        <p className="text-danger">{error}</p>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="py-5 text-center">
        <p className="text-muted">No services available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="py-5 bg-white">
      <div className="container">
        <h2 className="text-warning text-center mb-4">Our Services</h2>

        <div className="row g-4">
          {services.map(service => (
            <div className="col-md-4" key={service.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body text-center">
                  <h5 className="text-warning">
                    {service.name ?? "Unnamed Service"}
                  </h5>

                  <p className="text-muted">
                    {service.description ?? "No description available."}
                  </p>

                  <strong className="text-warning">
                    ₱{service.price ?? "0.00"}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
