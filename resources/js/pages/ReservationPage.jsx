import ReservationForm from "../components/ReservationForm";

export default function ReservationPage() {
  return (
    <section className="py-5">
      <div className="container text-center">
        {/* <h1 className="gold-text mb-4">Book an Appointment</h1> */}
        <ReservationForm />
      </div>
    </section>
  );
}
