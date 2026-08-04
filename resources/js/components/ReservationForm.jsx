import { useEffect, useRef, useState } from "react";
import api from "../lib/api";

const EMPTY_CUSTOMER_DETAILS = {
  name: "",
  phone: "",
  date: "",
};

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function ReservationForm({ initiallySelectedService }) {
  const [customerDetails, setCustomerDetails] = useState(EMPTY_CUSTOMER_DETAILS);
  const [allServices, setAllServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(
    initiallySelectedService ? [initiallySelectedService] : []
  );
  const [selectedSlotsByService, setSelectedSlotsByService] = useState({});
  const [availableSlotsByService, setAvailableSlotsByService] = useState({});
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [cardAnimation, setCardAnimation] = useState("");
  const errorRef = useRef(null);

  useEffect(() => {
    if (!successMessage) return;

    setCardAnimation("card-shake");
    const animationTimer = setTimeout(() => setCardAnimation(""), 1200);
    return () => clearTimeout(animationTimer);
  }, [successMessage]);

  useEffect(() => {
    if (errors.length === 0) return;

    setCardAnimation("card-shake");
    errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    const animationTimer = setTimeout(() => setCardAnimation(""), 600);
    return () => clearTimeout(animationTimer);
  }, [errors]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await api.get("/services-with-schedules");
        setAllServices(response.data);
      } catch {
        setErrors(["Failed to load services."]);
      } finally {
        setIsLoadingServices(false);
      }
    };

    loadServices();
  }, []);

  useEffect(() => {
    if (!customerDetails.date || allServices.length === 0) {
      setAvailableServices([]);
      return;
    }

    const selectedDay = new Date(`${customerDetails.date}T00:00:00`).getDay();
    const servicesAvailableOnDate = allServices.filter(service =>
      service.schedules.some(schedule => schedule.day_of_week === selectedDay)
    );

    setAvailableServices(servicesAvailableOnDate);
    setSelectedServices(previousServices =>
      previousServices.filter(selectedService =>
        servicesAvailableOnDate.some(service => service.id === selectedService.id)
      )
    );
  }, [customerDetails.date, allServices]);

  useEffect(() => {
    if (!customerDetails.date) {
      setAvailableSlotsByService({});
      setSelectedSlotsByService({});
      return;
    }

    const loadAvailableSlots = async serviceId => {
      try {
        const response = await api.get(`/services/${serviceId}/slots`, {
          params: { date: customerDetails.date },
        });

        setAvailableSlotsByService(previousSlots => ({
          ...previousSlots,
          [serviceId]: response.data,
        }));
      } catch (error) {
        console.error("Slot load failed", error);
        setAvailableSlotsByService(previousSlots => ({
          ...previousSlots,
          [serviceId]: [],
        }));
      }
    };

    selectedServices.forEach(service => loadAvailableSlots(service.id));
  }, [customerDetails.date, selectedServices]);

  const handleCustomerDetailsChange = event => {
    setCustomerDetails(previousDetails => ({
      ...previousDetails,
      [event.target.name]: event.target.value,
    }));
  };

  const handlePhoneChange = event => {
    const phone = event.target.value.replace(/\D/g, "");
    setCustomerDetails(previousDetails => ({ ...previousDetails, phone }));
  };

  const toggleService = service => {
    setSelectedServices(previousServices => {
      const isSelected = previousServices.some(
        selectedService => selectedService.id === service.id
      );

      if (!isSelected) return [...previousServices, service];

      setSelectedSlotsByService(previousSlots => {
        const remainingSlots = { ...previousSlots };
        delete remainingSlots[service.id];
        return remainingSlots;
      });
      setAvailableSlotsByService(previousSlots => {
        const remainingSlots = { ...previousSlots };
        delete remainingSlots[service.id];
        return remainingSlots;
      });

      return previousServices.filter(
        selectedService => selectedService.id !== service.id
      );
    });
  };

  const handleSlotChange = (serviceId, slotTime) => {
    setSelectedSlotsByService(previousSlots => ({
      ...previousSlots,
      [serviceId]: slotTime,
    }));
  };

  const submitReservation = async event => {
    event.preventDefault();
    setErrors([]);
    setSuccessMessage(null);

    if (!customerDetails.name || !customerDetails.phone || !customerDetails.date) {
      setErrors(["Please complete required fields."]);
      return;
    }

    if (selectedServices.length === 0) {
      setErrors(["Please select at least one service."]);
      return;
    }

    const serviceWithoutSlot = selectedServices.find(
      service => !selectedSlotsByService[service.id]
    );
    if (serviceWithoutSlot) {
      setErrors([`Select time for ${serviceWithoutSlot.name}.`]);
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post("/reservations", {
        customer_name: customerDetails.name,
        customer_phone: customerDetails.phone,
        reservation_date: customerDetails.date,
        services: selectedServices.map(service => ({
          service_id: service.id,
          service_name: service.name,
          slot_time: selectedSlotsByService[service.id],
        })),
      });

      setSuccessMessage("Reservation submitted successfully!");
      setSelectedServices([]);
      setSelectedSlotsByService({});
      setAvailableSlotsByService({});
      setCustomerDetails(EMPTY_CUSTOMER_DETAILS);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(Object.values(error.response.data.errors).flat());
      } else {
        setErrors([
          error.response?.data?.message || "Reservation failed. Please try again.",
        ]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = time => {
    if (!time) return "";

    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(hour, minute);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-10 col-xl-8 font-nourd">
        <form
          className="card reservation-form-card p-3 p-md-4 rounded-4 shadow-sm text-start"
          onSubmit={submitReservation}
        >
          <h6 className="gold-text text-center mb-3 fs-5">
            Please enter your details and select a date to see available services.
          </h6>

          {isSubmitting && (
            <div className="text-center gold-text mb-3">Processing reservation...</div>
          )}

          {errors.length > 0 && (
            <div ref={errorRef} className={`alert alert-danger ${cardAnimation}`}>
              <ul className="mb-0 ps-3">
                {errors.map((message, index) => <li key={index}>{message}</li>)}
              </ul>
            </div>
          )}

          {successMessage && (
            <div className={`alert alert-success ${cardAnimation}`}>{successMessage}</div>
          )}

          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label className="gold-text mb-1" htmlFor="customer-name">Full Name</label>
              <input
                id="customer-name"
                className="form-control"
                name="name"
                autoComplete="name"
                value={customerDetails.name}
                onChange={handleCustomerDetailsChange}
                required
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="gold-text mb-1" htmlFor="customer-phone">Phone Number</label>
              <input
                id="customer-phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                className="form-control"
                name="phone"
                autoComplete="tel"
                value={customerDetails.phone}
                onChange={handlePhoneChange}
                required
              />
            </div>
          </div>

          <label className="gold-text mb-1 fs-5" htmlFor="reservation-date">Select Date</label>
          <input
            id="reservation-date"
            type="date"
            className="form-control mb-3"
            name="date"
            value={customerDetails.date}
            onChange={handleCustomerDetailsChange}
            required
          />

          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
            <h6 className="gold-text fs-5 mb-0">Available Services</h6>
            {selectedServices.length > 0 && (
              <span className="badge reservation-selection-count">
                {selectedServices.length} selected
              </span>
            )}
          </div>

          {isLoadingServices && <p className="text-muted">Loading...</p>}
          {!isLoadingServices && customerDetails.date && availableServices.length === 0 && (
            <p className="text-warning">No services available on this day.</p>
          )}

          <div className="services-scroll-container mb-4">
            {availableServices.map(service => {
              const checkboxId = `reservation-service-${service.id}`;
              return (
                <div key={service.id} className="reservation-service-item">
                  <input
                    id={checkboxId}
                    type="checkbox"
                    className="reservation-checkbox"
                    checked={selectedServices.some(item => item.id === service.id)}
                    onChange={() => toggleService(service)}
                  />
                  <label className="gold-text reservation-service-label" htmlFor={checkboxId}>
                    <span className="d-block">{service.name} — £{service.price}</span>
                    {(service.schedules || []).map(schedule => (
                      <small key={schedule.id} className="d-block text-secondary">
                        {DAY_NAMES[schedule.day_of_week]} • {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                      </small>
                    ))}
                  </label>
                </div>
              );
            })}
          </div>

          {selectedServices.length > 0 && (
            <div className="selected-services-section mb-2">
              <h6 className="gold-text fs-5 mb-3">Choose a time for each service</h6>
              <div className="selected-services-list">
                {selectedServices.map(service => {
                  const availableSlots = availableSlotsByService[service.id] || [];
                  return (
                    <div key={service.id} className="selected-service-card rounded-3">
                      <div className="selected-service-details">
                        <div className="gold-text fw-semibold">{service.name}</div>
                        <div className="small gold-text opacity-75">
                          {service.duration_minutes ?? "—"} min • £{service.price}
                        </div>
                      </div>
                      <div className="selected-service-slot">
                        <label className="visually-hidden" htmlFor={`service-slot-${service.id}`}>
                          Time slot for {service.name}
                        </label>
                        <select
                          id={`service-slot-${service.id}`}
                          className="form-select"
                          disabled={availableSlots.length === 0}
                          value={selectedSlotsByService[service.id] || ""}
                          onChange={event => handleSlotChange(service.id, event.target.value)}
                          required
                        >
                          <option value="">Select Time Slot</option>
                          {availableSlots.map(slot => (
                            <option key={slot} value={slot}>{formatTime(slot)}</option>
                          ))}
                        </select>
                        {availableSlots.length === 0 && (
                          <small className="text-warning d-block mt-1">No slots available</small>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button className="btn btn-gold w-100 mt-3" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Confirm Reservation"}
          </button>
        </form>
      </div>
    </div>
  );
}
