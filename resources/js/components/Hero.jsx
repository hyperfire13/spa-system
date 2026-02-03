export default function Hero() {
  return (
    <section className="hero-section mt-5 mb-5">
      <div className="container">
        <div className="row align-items-center fade-up">

          {/* LEFT: LOGO (BIG) */}
          <div className="col-md-6 d-flex justify-content-center">
            <img
              src="/images/spa-logo.webp"
              alt="Spa Logo"
              className="hero-logo-large"
            />
          </div>

          {/* RIGHT: TEXT */}
          <div className="col-md-6 text-center text-md-start">
            <p className="hero-subtitle gold-text">
              WHERE BEAUTY MEETS ARTISTRY
            </p>

            <h1 className="display-5 fw-semibold gold-text">
              Timeless<br />
              Elegance<br />
              Refined Beauty
            </h1>

            <p className="gold-text" style={{ maxWidth: "420px" }}>
              Experience the pinnacle of luxury spa treatments and
              aesthetic services, thoughtfully curated to enhance
              your natural radiance and inner glow.
            </p>

            <button className="btn btn-gold mt-3">
              Book Your Appointment
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
