import React, { useState, useEffect } from "react";
import { createApiClient } from "../../../utils/apiClient";
import { fetchRoomDesks } from "../../../utils/fetchData/fetchRoomDesks";
import { toast } from "react-toastify";

import { fetchUsers } from "../../../utils/fetchData/AdminData/fetchUsers";

function CreateReservationAdmin({ token, roomsData }) {

    const [formData, setFormData] = useState({
        user_id: "",
        room_id: "",
        desk_id: "",
        start_date: "",
        duration: "", 
        note: ""
    });

    const [responseMessage, setResponseMessage] = useState("");
    const [roomDesksData, setRoomDesksData] = useState([]);
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        if (token && formData.room_id) {
            fetchRoomDesks(token, formData.room_id).then(setRoomDesksData);
        }
        fetchUsers(token).then(setUsersData);
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
            const response = await apiClient.post("/reservations", formDataToSend);
            toast.success(response.data.message || "Reservation created successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create reservation.");
        }
    };

    return (
        <div>
        <h2 className="text-2xl font-bold text-white underline p-4 text-center">
            Create Reservations
        </h2>
        <div className="flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-lg p-6">
            <div className="flex flex-col justify-center mb-4">
                <label className="block text-gray-700 text-lg font-bold mb-2">User Email:</label>
                <select
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded text-gray-700 focus:outline-none"
                >
                    <option value="" className="text-gray-700 text-center">Select a user</option>
                    {usersData.map((user) => (
                        <option key={user.id} value={user.id} className="text-gray-700 text-center">
                            {user.email}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col justify-center mb-4">
                <label className="block text-gray-700 text-lg font-bold mb-2">Room Name:</label>
                <select
                name="room_id"
                value={formData.room_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded text-gray-700 focus:outline-none"
                >
                <option value="" className="text-gray-700 text-center">Select a room</option>
                {roomsData.map((room) => (
                    <option key={room.id} value={room.id} className="text-gray-700 text-center">
                    {room.room_alias}
                    </option>
                ))}
                </select>
            </div>
            <div className="flex flex-col justify-center mb-4">
                <label className="block text-gray-700 text-lg font-bold mb-2">Desk Number:</label>
                <select
                name="desk_id"
                value={formData.desk_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded text-gray-700 focus:outline-none"
                >
                <option value="" className="text-gray-700 text-center">Select a desk</option>
                {roomDesksData.map((desk) => (
                    <option key={desk.id} value={desk.id} className="text-gray-700 text-center">
                    {desk.desk_number}
                    </option>
                ))}
                </select>
            </div>
            <div className="flex flex-col justify-center mb-4">
                <label className="block text-gray-700 text-lg font-bold mb-2">Start Date:</label>
                <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
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
            <div className="flex flex-col justify-center mb-4">
                <label className="block text-gray-700 text-lg font-bold mb-2">Note:</label>
                <input
                type="text"
                name="note"
                value={formData.note}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded text-gray-700 focus:outline-none"
                />
            </div>
            <div className="flex justify-center mt-6">
                <button type="submit" className="w-full py-2 px-4 rounded bg-[#f37f0c] text-gray-100 focus:outline-none">Create Reservation</button>
            </div>        
            </form>
        </div>
        </div>
    );
}

export default CreateReservationAdmin;