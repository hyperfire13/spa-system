export default function Hero() {
  return (
    <section className="vh-100 d-flex align-items-center text-center">
      <div className="container">
        <p className="text-muted text-uppercase small">Get Beauty, Rest and Relax</p>
        <h1 className="display-4 text-warning">Timeless Elegance<br/>Refined Beauty</h1>
        <p className="text-secondary mx-auto" style={{maxWidth: "600px"}}>
          Experience the ultimate luxury spa treatments and wellness services,
          thoughtfully curated to enhance your glow.
        </p>
        <button className="btn btn-warning text-white rounded-pill px-4">Book an Appointment</button>
      </div>
    </section>
  )
}
