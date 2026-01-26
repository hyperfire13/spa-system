import services from "../data/services";

export default function Services() {
  return (
    <section className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="text-warning mb-4">Our Services</h2>
        <div className="row g-4">
          {services.map(s => (
            <div className="col-md-4 col-sm-6" key={s.id}>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5>{s.name}</h5>
                  <p className="text-muted">{s.description}</p>
                  <span className="fw-bold text-warning">₱ {s.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
