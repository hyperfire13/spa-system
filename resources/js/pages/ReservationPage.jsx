import { useLocation } from "react-router-dom";
import ReservationForm from "../components/ReservationForm";

export default function ReservationPage() {
  const location = useLocation();
  const initiallySelectedService = location.state?.service ?? null;

  return (
    <section className="py-5">
      <div className="container reservation-page-container text-center">
        <h1 className="gold-text mb-4 mt-5 font-youngest">Book an Appointment</h1>
        <ReservationForm initiallySelectedService={initiallySelectedService} />
      </div>
    </section>
  );
}
