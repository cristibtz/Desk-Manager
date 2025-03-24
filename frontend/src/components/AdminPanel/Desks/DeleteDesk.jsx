import React, { useState } from "react";
import { createApiClient } from "../../../utils/apiClient";
import { toast } from "react-toastify";

function DeleteDesk({ token }) {
  const [formData, setFormData] = useState({
    desk_id: "",
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
      const response = await apiClient.delete(`/desks/${formData.desk_id}`);
      toast.success(response.data.message || "Desk deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete desk.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white underline p-4 text-center">
        Delete Desk
      </h2>
      <div className="flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-lg p-6">
          <div className="flex flex-col justify-center mb-4">
          <label className="block text-gray-700 text-lg font-bold mb-2">Desk ID:</label>
            <input type="number"
              name="desk_id"
              value={formData.desk_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded text-gray-700 focus:outline-none"
            />
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
      </div>
    </div>
  );
}

export default DeleteDesk;