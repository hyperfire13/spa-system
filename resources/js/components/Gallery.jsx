export default function Gallery() {
  const slides = [
    {
      title: "Spa Interior",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Massage Room",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Relax Area",
      image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="container-fluid bg-dark py-5 px-0">
      <div className="container">
        <div
          id="spaGallery"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="2500"
        >
          <div className="carousel-inner rounded-4 shadow-sm">

            {slides.map((slide, i) => (
              <div className={`carousel-item ${i === 0 ? "active" : ""}`} key={i}>
                <div className="position-relative">

                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="d-block w-100"
                    style={{ height: "300px", objectFit: "cover" }}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />

                  {/* Overlay */}
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                      style={{ background: "rgba(0,0,0,0.35)" }}>
                    <h3 className="gold-text">{slide.title}</h3>
                  </div>

                </div>
              </div>
            ))}

          </div>

          {/* Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#spaGallery"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon custom-carousel-icon"></span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#spaGallery"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon custom-carousel-icon"></span>
          </button>
        </div>
      </div>
    </section>
  );
}
