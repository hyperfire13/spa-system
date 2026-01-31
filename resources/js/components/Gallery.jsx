export default function Gallery() {
  const slides = ["Spa Interior", "Massage Room", "Relax Area"];

  return (
    <section className="container py-5">
      <div
        id="spaGallery"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="2500"
        data-bs-theme="dark"
      >
        <div className="carousel-inner rounded-4 shadow-sm">
          {slides.map((title, i) => (
            <div className={`carousel-item ${i === 0 ? "active" : ""}`} key={i}>
              <div
                className="d-flex justify-content-center align-items-center bg-light"
                style={{ height: "300px" }}
              >
                <h3 className="gold-text">{title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#spaGallery" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#spaGallery" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </section>
  );
}
