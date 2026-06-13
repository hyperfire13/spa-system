import { useLocation, Navigate } from "react-router-dom";
import ReservationForm from "../components/ReservationForm";

export default function ReservationPage() {
  const location = useLocation();
  const service = location.state?.service || null;

  // If user reloads without selecting service
  if (!service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <section className="py-5">
      <div className="container text-center">
        <h1 className="gold-text mb-4 mt-5 font-youngest">Book an Appointment</h1>
        <ReservationForm service={service} />
      </div>
    </section>
  );
}
