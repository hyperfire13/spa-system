import Hero from "../components/Hero";
import Gallery from "../components/Gallery";
import Services from "../components/Services";
import ContactSection from "../components/ContactSection";

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
    <div className="container">
      <Hero />
      {/* <Gallery /> */}
      <section className="py-5 text-center">
        <h2 className="gold-text mb-3">Our Services</h2>
        <p className="text-muted">
          Indulge in premium treatments crafted to restore balance, beauty, and wellness.
        </p>

        <Services limit={3} />

        <Link to="/services" className="btn btn-gold mt-3">
          View All Services
        </Link>
      </section>
      <section className="py-5 ">
        <div className="container text-center">
          <h2 className="gold-text mb-4">Why Choose Usxx</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <h5>Expert Therapists</h5>
              <p className="gold-text">Licensed and highly trained professionals.</p>
            </div>
            <div className="col-md-4">
              <h5>Luxury Ambience</h5>
              <p className="gold-text">Elegant, calming spa environment.</p>
            </div>
            <div className="col-md-4">
              <h5>Premium Products</h5>
              <p className="gold-text">Top-quality skincare and massage oils.</p>
            </div>
          </div>

          <Link to="/reservation" className="btn btn-gold mt-4">
            Book Now
          </Link>
        </div>
      </section>
      <ContactSection />
    </div>
    </>
  );
}
