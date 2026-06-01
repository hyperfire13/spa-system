export default function Hero() {
  return (
    <section className="hero-section mt-1">
      <div className="container">
        <div className="row align-items-center fade-up">
          {/* LEFT: TEXT */}
          <div className="col-md-6 text-center text-md-start">
            {/* <p className="hero-subtitle gold-text">
              WHERE BEAUTY MEETS ARTISTRY
            </p> */}

            {/* <h1 className="display-5 fw-semibold gold-text">
              Timeless<br />
              Elegance<br />
              Refined Beauty
            </h1> */}
            <h1 className="display-3 fw-semibold gold-text">
              Return to Stillness.<br/>
            </h1>
            <h3 className="fw-semibold">
              A SANCTUARY FOR THE SENSES.<br/>
            </h3>
            <p className="fw-semibold fs-6" style={{ maxWidth: "420px" }}>
              Welcome to Spa by MJ, a restorative haven where holistic healing meets refined elegance. Immerse yourself in a space of tranquility, designed to soothe the soul and awaken the light within. <br/><br/>
              Experience bespoke rituals crafted for balance and serenity.
            </p>
            <button className="gold-text btn btn-outline-warning mt-3 mb-3">
              <b>BEGIN YOUR JOURNEY.</b>
            </button>

            {/* <p className="gold-text" style={{ maxWidth: "420px" }}>
              Experience the pinnacle of luxury spa treatments and
              aesthetic services, thoughtfully curated to enhance
              your natural radiance and inner glow.
            </p> */}
            {/* <button className="btn btn-gold mt-3">
              BEGIN YOUR JOURNEY.
            </button> */}
          </div>
           {/* RIGHT: LOGO (BIG) */}
          <div className="col-md-6 d-flex justify-content-center mb-5">
            <img
              src="/images/white-logo.jpg"
              alt="Spa Logo"
              className="hero-logo-large"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
