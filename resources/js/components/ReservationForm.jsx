export default function ReservationForm() {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="gold-text text-center mb-4">Book an Appointment</h2>

        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card p-4 shadow-sm border-0 rounded-4">
              <input className="form-control mb-3" placeholder="Full Name" />
              <input className="form-control mb-3" placeholder="Phone Number" />
              <input type="date" className="form-control mb-3" />
              <input type="time" className="form-control mb-3" />

              <button className="btn btn-gold w-100">
                Submit Reservation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
