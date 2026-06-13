import Hero from "../components/Hero";
import Gallery from "../components/Gallery";
import Services from "../components/Services";
import ContactSection from "../components/ContactSection";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

import { Link } from "react-router-dom";

export default function Home() {
    const [advancedServices, setAdvancedServices] = useState([]);
    const [enhancementServices, setEnhancementServices] = useState([]);

    useEffect(() => {
    loadCuratedServices();
    }, []);

    const loadCuratedServices = async () => {
    const res = await api.get("/services/curated-skincare");

    const services = res.data;

    setAdvancedServices(services.slice(0, 8));
    setEnhancementServices(services.slice(8, 15));
    };
    return (
        <>
        <div className="container">
        <Hero />
        {/* <Gallery /> */}
        <section className="py-5 text-center">
            <h1 className="gold-text mb-3 font-pinyon">Our Services</h1>
            <p className="fw-medium gold-text font-nourd">
            Indulge in premium treatments crafted to restore balance, beauty, and wellness.
            </p>

            <Services limit={3} />

            <Link to="/services" className="btn btn-gold mt-3">
            View All Services
            </Link>
        </section>
        {/* <section className="py-5 ">
            <div className="container text-center">
            <h2 className="gold-text mb-4">Why Choose Us</h2>
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
        </section> */}
            <section className="py-5">
                <div className="container text-center">
                    <h1
                    className="mb-5 gold-text font-pinyon"
                    >
                    Curated Skincare Rituals
                    </h1>

                    <div className="row text-start">

                    <div className="col-lg-6 mb-4">
                        <h4
                        className="mb-4 gold-text"
                        style={{

                            fontFamily: "serif"
                        }}
                        >
                        ADVANCED SKIN RITUALS
                        </h4>

                        {advancedServices.map(service => (
                        <div
                            key={service.id}
                            className="pb-2 mb-3 font-nourd"
                            style={{
                            borderBottom: "1px solid #C7C2A8"
                            }}
                        >
                            <strong>{service.name}</strong>
                            <span> - £{service.price}</span>
                        </div>
                        ))}
                    </div>

                    <div className="col-lg-6 mb-4">
                        <h4
                        className="mb-4 gold-text"
                        style={{
                            fontFamily: "serif"
                        }}
                        >
                        REFINEMENT & ENHANCEMENTS
                        </h4>

                        {enhancementServices.map(service => (
                        <div
                            key={service.id}
                            className="pb-2 mb-3 font-nourd"
                            style={{
                            borderBottom: "1px solid #C7C2A8"
                            }}
                        >
                            <strong>{service.name}</strong>
                            <span> - £{service.price}</span>
                        </div>
                        ))}
                    </div>

                    </div>

                    <Link
                    to="/reservation"
                    className="btn mt-4 px-5 gold-text btn-outline-warning"
                    style={{
                        border: "1px solid #e0b62e",
                    }}
                    >
                    SECURE YOUR SESSION
                    </Link>

                </div>
            </section>
        <ContactSection />
        </div>
        </>
    );
}
