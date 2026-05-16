import { Link } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const navRef = useRef(null);
  const { admin } = useAuth();
  const closeMenu = () => {
    if (navRef.current.classList.contains("show")) {
      navRef.current.classList.remove("show");
    }
  };

  if (admin) {
    return null; // Don't show navbar if admin is logged in
  }

  return (
    <nav className="navbar navbar-expand-lg bg-white  fixed-top shadow-sm">
      <div className="container">
        <span className="navbar-brand fw-bold gold-text">
          SPA BY MJ
        </span>

        <button
          className="navbar-toggler gold-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="nav" className="collapse navbar-collapse" ref={navRef}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link gold-text" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/services" className="nav-link gold-text" onClick={closeMenu}>
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/reservation" className="nav-link gold-text" onClick={closeMenu}>
                Book
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
