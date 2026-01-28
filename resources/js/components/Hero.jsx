export default function Hero() {
  return (
    <section className="hero-section">
      <div className="fade-up">
        <p className="hero-subtitle">WHERE BEAUTY MEETS ARTISTRY</p>

        <h1 className="display-5 fw-semibold gold-text">
          Timeless<br/>
          Elegance<br/>
          Refined Beauty
        </h1>

        <p className="text-muted mx-auto" style={{ maxWidth: "320px" }}>
          Experience the pinnacle of luxury spa treatments and
          aesthetic services, thoughtfully curated to enhance
          your natural radiance and inner glow.
        </p>

        <button className="btn btn-gold mt-3">
          Book Your Appointment
        </button>
      </div>
    </section>
  );
}
