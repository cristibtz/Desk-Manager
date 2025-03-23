import { createApiClient } from '../../apiClient';

export const fetchRoomDesks = async (token, id) => {
        const apiClient = createApiClient(token);
        const roomDesks = await apiClient.get(`/rooms/${id}/desks`);
        return roomDesks.data;
};