import { createApiClient } from '../../apiClient';

export const fetchRoom = async (token, room_number) => {
    try {
        const apiClient = createApiClient(token);
        const getRoom = await apiClient.get(`/rooms/${room_number}`);
        return getRoom.data;
    } catch (error) {
        console.error("Failed to fetch room:", error);
    }
};