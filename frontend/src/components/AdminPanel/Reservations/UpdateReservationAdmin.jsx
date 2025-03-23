import React, { useState } from "react";
import { createApiClient } from "../../../utils/apiClient";
import { toast } from "react-toastify";

function UpdateReservationAdmin({ token, reservationsData = [] }) {
  const [formData, setFormData] = useState({
    reservation_id: "",
    new_start_date: "",
    duration: "",
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

    const durationInMinutes = parseInt(formData.duration, 10);

    const localDate = new Date(formData.new_start_date);
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

    const formDataToSend = {
      ...formData,
      new_start_date: utcDate.toISOString(),
      duration: durationInMinutes,
    };

    try {
      const response = await apiClient.post(`/reservations/${formData.reservation_id}`, formDataToSend);
      toast.success(response.data.message || "Reservation updated successfully.");
    } catch (error) {
      toast.error(error.response.data.message || "Failed to update reservation.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white underline p-4 text-center">
        Update Reservations
      </h2>
      <div className="flex items-center justify-center">
        {reservationsData.length > 0 ? (
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-lg p-6">
            <div className="flex flex-col justify-center mb-4">
              <label className="block text-gray-700 text-lg font-bold mb-2">Reservation ID:</label>
              <select
                name="reservation_id"
                value={formData.reservation_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded text-gray-700 focus:outline-none"
              >
                <option value="" className="text-gray-700 text-center">Select a reservation</option>
                {reservationsData.map((reservation) => (
                  <option key={reservation.id} value={reservation.id} className="text-gray-700 text-center">
                    {reservation.id}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-center mb-4">
              <label className="block text-gray-700 text-lg font-bold mb-2">New Start Date:</label>
              <input
                type="datetime-local"
                name="new_start_date"
                value={formData.new_start_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded text-gray-700 focus:outline-none"
              />
            </div>
            <div className="flex flex-col justify-center mb-4">
              <label className="block text-gray-700 text-lg font-bold mb-2">Duration:</label>
              <div className="px-4 py-2">
                <label className="block">
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
                <label className="block">
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
                <label className="block">
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
                <label className="block">
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
            <div className="flex justify-center mt-6">
              <button type="submit" className="w-full py-2 px-4 rounded bg-[#f37f0c] text-gray-100 focus:outline-none">Update Reservation</button>
            </div>
          </form>
        ) : (
          <p className="text-center text-white">No reservations found.</p>
        )}
      </div>
    </div>
  );
}

export default UpdateReservationAdmin;