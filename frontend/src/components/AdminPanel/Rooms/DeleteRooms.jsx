import React, { useState } from "react";
import { createApiClient } from "../../../utils/apiClient";
import { toast } from "react-toastify";

function DeleteRoom({ token, roomsData}) {
  const [formData, setFormData] = useState({
    room_number: "",
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
      const response = await apiClient.delete(`/rooms/${formData.room_number}`);
      toast.success(response.data.message || "Room deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete room.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white underline p-4 text-center">
        Delete Room
      </h2>
      <div className="flex items-center justify-center">
        {roomsData.length > 0 ? (
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-lg p-6">
            <div className="flex flex-col justify-center mb-4">
            <label className="block text-gray-700 text-lg font-bold mb-2">Room Name:</label>
              <select
                name="room_number"
                value={formData.room_number}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded text-gray-700 focus:outline-none"
              >
                <option value="" className="text-gray-700 text-center">Select a room</option>
                {roomsData.map((room) => (
                  <option key={room.id} value={room.room_number} className="text-gray-700 text-center">
                    {room.room_alias}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="w-full py-2 px-4 rounded bg-[#f37f0c] text-gray-100 focus:outline-none"
              >
                Delete Room
              </button>
            </div>
          </form>
        ) : (
          <p className="text-center text-white">No rooms found.</p>
        )}
      </div>
    </div>
  );
}

export default DeleteRoom;