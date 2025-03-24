import React, { useState, useEffect } from "react";
import { createApiClient } from "../../../utils/apiClient";
import { toast } from "react-toastify";


function UpdateRoom({ token, roomsData}) {

    const [formData, setFormData] = useState({
        room_number: "",
        room_alias: ""
    });

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

        try {
            console.log(formData);
            const response = await apiClient.post(`/rooms/${formData.room_number}`, formData);
            toast.success(response.data.message || "Room updated successfully!");
        } catch (error) {
            console.error("Room update failed:", error);
            toast.error(error.response?.data?.message || "Failed to update room.");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white underline p-4 text-center">
                Update Room Alias
            </h2>
            <div className="flex items-center justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-lg p-6">            
                    <div className="flex flex-col justify-center mb-4">
                        <label className="block text-gray-700 text-lg font-bold mb-2">New Room Name:</label>
                        <input
                        type="text"
                        name="room_alias"
                        value={formData.room_alias}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded text-gray-700 focus:outline-none"
                        />
                    </div>

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
                        <button type="submit" className="w-full py-2 px-4 rounded bg-[#f37f0c] text-gray-100 focus:outline-none">Update Room</button>
                    </div>        
                </form>
            </div>
        </div>
    );
}

export default UpdateRoom;