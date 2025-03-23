import React, { useState } from "react";
import { createApiClient } from "../../../utils/apiClient";
import { toast } from "react-toastify";

function DeleteReservation({ token, reservationsData = [] }) {
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
      const response = await apiClient.delete(`/reservations/${formData.reservation_id}`);
      toast.success(response.data.message || "Reservation deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete reservation.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white underline p-4 text-center">
        Delete Reservations
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
            <div className="flex justify-center mt-6">
              <button type="submit" className="w-full py-2 px-4 rounded bg-[#f37f0c] text-gray-100 focus:outline-none">Delete Reservation</button>
            </div>
          </form>
        ) : (
          <p className="text-center text-white">No reservations found.</p>
        )}
      </div>
    </div>
  );
}

export default DeleteReservation;