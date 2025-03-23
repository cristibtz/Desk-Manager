import { createApiClient } from '../../apiClient';

export const fetchRooms = async (token) => {
    try {
        const apiClient = createApiClient(token);
        const getRooms = await apiClient.get('/rooms');
        return getRooms.data;
    } catch (error) {
        console.error("Failed to fetch rooms:", error);
    }
};