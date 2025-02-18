import React, { useState, useContext, useEffect } from "react";
import { KeycloakContext } from "../../../KeycloakContext";
import { createApiClient } from "../../../utils/apiClient";
import { fetchReservations } from "../../../utils/fetchReservations";

function UpdateReservation() {
    const { token } = useContext(KeycloakContext);
    const [formData, setFormData] = useState({
      new_start_date: "",
      duration: "",
    });
    const [reservations, setReservations] = useState([]);
    const [responseMessage, setResponseMessage] = useState("");

    useEffect(() => {
      if (token) {
        fetchReservations(token).then(setReservations);
      }
    }, [token]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const apiClient = createApiClient(token);

      const durationInMinutes = parseInt(formData.duration, 10);

      const formDataToSend = {
        ...formData,
        duration: durationInMinutes,
      };

      try {
        const response = await apiClient.post(`/user/reservations/${formData.reservation_id}`, formDataToSend);
        setResponseMessage(response.data.message || "Reservation updated successfully!");
      } catch (error) {
        setResponseMessage(error.response?.data?.message || "Failed to update reservation.");
      }
    };

    return (
      <div>
        <h2>Update Reservation</h2>
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Reservation ID:</label>
              <select
                name="reservation_id"
                value={formData.reservation_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a reservation</option>
                {reservations.map((reservation) => (
                  <option key={reservation.id} value={reservation.id}>
                    {reservation.id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>New Start Date:</label>
              <input
                type="datetime-local"
                name="new_start_date"
                value={formData.new_start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Duration:</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="duration"
                    value="30"
                    checked={formData.duration === "30"}
                    onChange={handleChange}
                    required
                  />
                  30 minutes
                </label>
                <label>
                  <input
                    type="radio"
                    name="duration"
                    value="60"
                    checked={formData.duration === "60"}
                    onChange={handleChange}
                    required
                  />
                  1 hour
                </label>
                <label>
                  <input
                    type="radio"
                    name="duration"
                    value="90"
                    checked={formData.duration === "90"}
                    onChange={handleChange}
                    required
                  />
                  1 hour 30 mins
                </label>
                <label>
                  <input
                    type="radio"
                    name="duration"
                    value="120"
                    checked={formData.duration === "120"}
                    onChange={handleChange}
                    required
                  />
                  2 hours
                </label>
              </div>
            </div>
            <button type="submit">Update Reservation</button>
          </form>
          {responseMessage && <p>{responseMessage}</p>}
        </div>
      </div>
    );
};

export default UpdateReservation;