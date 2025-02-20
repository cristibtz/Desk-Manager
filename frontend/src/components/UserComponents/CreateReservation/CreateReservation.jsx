import React, { useState, useEffect } from "react";
import { createApiClient } from "../../../utils/apiClient";
import { fetchRoomDesks } from "../../../utils/fetchRoomDesks";
import { toast } from "react-toastify";
function CreateReservation({ token, roomsData }) {

  const [formData, setFormData] = useState({
    room_id: "",
    desk_id: "",
    start_date: "",
    duration: "", 
    note: ""
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [roomDesksData, setRoomDesksData] = useState([]);

  useEffect(() => {
    
    if (formData.room_id) {
      fetchRoomDesks(token, formData.room_id).then(setRoomDesksData);
    }
    
  }, [formData.room_id, token]);

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

    const localDate = new Date(formData.start_date);
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

    const formDataToSend = {
      ...formData,
      start_date: utcDate.toISOString(),
      duration: durationInMinutes
    };

    try {
        console.log(formDataToSend);
        const response = await apiClient.post("/user/reservations", formDataToSend);
        toast.success(response.data.message || "Reservation created successfully!");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to create reservation.");
      }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white underline p-4">
        Create Reservations
      </h2>
      <div>
        <form onSubmit={handleSubmit}>
        <div>
            <label>Room Name:</label>
            <select
              name="room_id"
              value={formData.room_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a room</option>
              {roomsData.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.room_alias}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Desk Number:</label>
            <select
              name="desk_id"
              value={formData.desk_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a desk</option>
              {roomDesksData.map((desk) => (
                <option key={desk.id} value={desk.id}>
                  {desk.desk_number}
                </option>
              ))}
            </select>
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
      </div>
    </div>
  );
}

export default CreateReservation;