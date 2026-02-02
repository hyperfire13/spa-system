import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-dark fixed-top shadow-sm ">
      <div className="container">
        <span className="navbar-brand fw-bold gold-text">
          SPA BY MJ
        </span>
        <button className="navbar-toggler gold-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
          <span id="hamburger" className="navbar-toggler-icon"></span>
        </button>
        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link to="/" className="nav-link gold-text">Home</Link></li>
            <li className="nav-item"><Link to="/services" className="nav-link gold-text">Services</Link></li>
            <li className="nav-item"><Link to="/reservation" className="nav-link gold-text">Book</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
