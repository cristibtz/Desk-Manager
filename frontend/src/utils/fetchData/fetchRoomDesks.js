import { createApiClient } from '../apiClient';

export const fetchRoomDesks = async (token, room_id) => {
    try {
        const apiClient = createApiClient(token);
        const getRoomDesks = await apiClient.get(`/rooms/${room_id}/desks`);
        return getRoomDesks.data;
    } catch (error) {
        console.error("Failed to fetch room's desks:", error);
    }
};