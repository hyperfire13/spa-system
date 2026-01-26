export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white fixed-top shadow-sm">
      <div className="container">
        <span className="navbar-brand text-warning fw-bold">SPA BY MJ</span>
        <div className="collapse navbar-collapse show">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><a className="nav-link">Home</a></li>
            <li className="nav-item"><a className="nav-link">Services</a></li>
            <li className="nav-item"><a className="nav-link">About</a></li>
            <li className="nav-item"><a className="nav-link">Contact</a></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
