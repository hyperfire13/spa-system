import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white fixed-top shadow-sm">
      <div className="container">
        <span className="navbar-brand fw-bold gold-text">
          SPA BY MJ
        </span>
        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
            <li className="nav-item"><Link to="/services" className="nav-link">Services</Link></li>
            <li className="nav-item"><Link to="/reservation" className="nav-link">Book</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
