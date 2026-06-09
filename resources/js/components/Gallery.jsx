export default function Gallery() {
  const slides = [
    {
      title: "",
      image: "/images/promo-pic-2.PNG",
    },
    {
      title: "",
      image: "/images/mjspa-promo-pic.PNG",
    },
    {
      title: "",
      image: "/images/promo-pic-3.PNG",
    },
  ];

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="container-fluid mt-5 px-0">
        <div className="container  w-100 h-100">
            <div
            className="mx-auto"
            style={{
                maxWidth: "900px"

            }}
            >
            <div
                id="spaGallery"
                className="carousel slide w-100 h-100"
                data-bs-ride="carousel"
                data-bs-interval="2500"

            >
                <div className="carousel-inner rounded-4 shadow-sm">

                {slides.map((slide, i) => (
                    <div
                    className={`carousel-item ${i === 0 ? "active" : ""}`}
                    key={i}
                    >
                    <div className="position-relative w-100 h-100">
                       <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-100 h-100"
                            style={{
                                objectFit: "cover",
                                objectPosition: "center"
                            }}
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = FALLBACK_IMAGE;
                            }}
                        />

                        {/* <div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"

                        >
                        <h3 className="gold-text">{slide.title}</h3>
                        </div> */}

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

        </div>
    </section>
  );
}
