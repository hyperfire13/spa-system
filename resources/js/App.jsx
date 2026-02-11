import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import ServicesPage from "./pages/ServicesPage";
import ReservationPage from "./pages/ReservationPage";

import { AuthProvider } from "./auth/AuthContext";
import RequireAdmin from "./auth/RequireAdmin";

import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminReservations from "./admin/AdminReservations";


export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
      </Routes>
      <AuthProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin"element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="reservations" element={<AdminReservations />} />
            </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}
