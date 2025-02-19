import React, { useState } from "react";
import { createApiClient } from "../../../utils/apiClient";

function DeleteReservation({token, reservationsData = []}) {
    const [responseMessage, setResponseMessage] = useState("");
    const [formData, setFormData] = useState({
        reservation_id: "",
     });

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

      try {
        const response = await apiClient.delete(`/user/reservations/${formData.reservation_id}`);
        setResponseMessage(response.data.message || "Reservation deleted successfully!");
      } catch (error) {
        setResponseMessage(error.response?.data?.message || "Failed to delete reservation.");
      }
    };

    return (
      <div>
        <h2>Delete Reservation</h2>
        <div>
          {reservationsData.length > 0 ? (
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
                {reservationsData.map((reservation) => (
                  <option key={reservation.id} value={reservation.id}>
                    {reservation.id}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit">Delete Reservation</button>
          </form>
          ) : (
            <div>No reservations available to delete.</div>
          )}
          {responseMessage && <p>{responseMessage}</p>}
        </div>
      </div>
    );
};

export default DeleteReservation;