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
  <div className="gallery-wrapper">

    <div
      id="spaGallery"
      className="carousel slide h-100"
      data-bs-ride="carousel"
      data-bs-interval="2500"
    >

      <div className="carousel-inner h-100 rounded-4">

        {slides.map((slide, i) => (
          <div
            className={`carousel-item h-100 ${i === 0 ? "active" : ""}`}
            key={i}
          >

            <div className="gallery-image-wrapper">

              <img
                src={slide.image}
                alt={slide.title}
                className="gallery-image"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE;
                }}
              />

            </div>

          </div>
        ))}

      </div>

      {/* CONTROLS */}
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
);
}
