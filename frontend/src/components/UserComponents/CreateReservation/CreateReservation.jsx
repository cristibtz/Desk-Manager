import React, { useState, useContext } from "react";
import { createApiClient } from "../../../utils/apiClient";
import { KeycloakContext } from "../../../KeycloakContext";

function CreateReservation() {
  const { token } = useContext(KeycloakContext);

  const [formData, setFormData] = useState({
    room_id: "",
    desk_id: "",
    start_date: "",
    duration: "30", // Default value to avoid empty string
    note: ""
  });
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiClient = createApiClient(token);

    const durationInMinutes = parseInt(formData.duration, 10);

    const formDataToSend = {
      ...formData,
      duration: durationInMinutes
    };

    try {
        console.log(formDataToSend);
        const response = await apiClient.post("/user/reservations", formDataToSend);
        setResponseMessage(response.data.message || "Reservation created successfully!");
    } catch (error) {
      setResponseMessage(error.response?.data?.message || "Failed to create reservation.");
    }
  };

  return (
    <div>
      <h2>Create Reservation</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Room ID:</label>
            <input
              type="number"
              name="room_id"
              value={formData.room_id}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Desk ID:</label>
            <input
              type="number"
              name="desk_id"
              value={formData.desk_id}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Start Date:</label>
            <input
              type="datetime-local"
              name="start_date"
              value={formData.start_date}
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
          <div>
            <label>Note:</label>
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Create Reservation</button>
        </form>
        {responseMessage && <p>{responseMessage}</p>}
      </div>
    </div>
  );
}

export default CreateReservation;