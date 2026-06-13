export default function ContactSection() {
  return (
    <section className="container-fluid section-soft-dark py-5 px-0">
      <div className="container">
        <div className="text-center mb-4 fs-5">
          <h2 className="gold-text font-pinyon">Contact Us</h2>
          <p className="gold-text font-nourd">
            We’d love to hear from you. Visit us or call to book your session.
          </p>
        </div>

        <div className="row justify-content-center g-4 ">

          {/* Address */}
          <div className="col-md-5 fs-5 ">
            <div className="card service-card h-100 p-4 text-center">
              <h5 className="gold-text mb-3 font-nourd">Our Location</h5>
              <p className="gold-text mb-1 font-nourd">
                Harrison and Co
              </p>
              <p className="gold-text mb-1 font-nourd">
                1040 Anlaby Rd.
              </p>
              <p className="gold-text mb-0 font-nourd">
                Hull HU4 7RA
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="col-md-5 fs-5">
            <div className="card service-card h-100 p-4 text-center ">
              <h5 className="gold-text mb-3 font-nourd">Contact Info</h5>
              <p className="gold-text mb-2 font-nourd">
                Phone:
              </p>
              <p className="gold-text fs-5 mb-0 font-nourd">
                07846 650888
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
