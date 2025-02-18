import React, { useState, useContext, useEffect } from "react";
import { KeycloakContext } from "../../../KeycloakContext";
import { createApiClient } from "../../../utils/apiClient";
import { fetchReservations } from "../../../utils/fetchReservations";

function DeleteReservation() {
    const { token } = useContext(KeycloakContext);
    const [reservations, setReservations] = useState([]);
    const [responseMessage, setResponseMessage] = useState("");
    const [formData, setFormData] = useState({
        reservation_id: "",
     });
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
            <button type="submit">Delete Reservation</button>
          </form>
          {responseMessage && <p>{responseMessage}</p>}
        </div>
      </div>
    );
};

export default DeleteReservation;