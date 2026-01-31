import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import ServicesPage from "./pages/ServicesPage";
import ReservationPage from "./pages/ReservationPage";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
      </Routes>
    </>
  );
}
