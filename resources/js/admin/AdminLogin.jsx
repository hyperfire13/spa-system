import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminLogin() {

  const { admin, login } = useAuth();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);

  const submit = async e => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await login(email,password);
      window.location.href = "/admin";
    } catch (e) {
      setError(e.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (admin) return <Navigate to="/admin/" replace />;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-4">

          <div className="card bg-dark p-4 rounded-4 shadow">

            <h3 className="gold-text text-center mb-4">
              Admin Login
            </h3>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={submit}>
              <input className="form-control mb-3"
                placeholder="Email"
                value={email}
                onChange={e=>setEmail(e.target.value)}
              />

              <input type="password"
                className="form-control mb-3"
                placeholder="Password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
              />

              <button className="btn btn-gold w-100" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
