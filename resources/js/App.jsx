import { Routes, Route, Navigate } from "react-router-dom";
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
import AdminServices from "./admin/AdminServices";


export default function App() {
  return (
  <>
    <AuthProvider>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/reservation" element={<ReservationPage />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="services" element={<AdminServices />} />
        </Route>

        {/* DEFAULT FALLBACK */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>

    </AuthProvider>
  </>
);
}
