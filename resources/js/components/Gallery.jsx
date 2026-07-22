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

    const FALLBACK_IMAGE =
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80";

    return (
        <div className="gallery-grid">
            {slides.map((slide, index) => (
                <div className="gallery-card" key={index}>
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
            ))}
        </div>
    );
}
