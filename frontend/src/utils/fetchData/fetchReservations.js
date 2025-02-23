import { createApiClient } from '../apiClient';

export const fetchReservations = async (token) => {
    try {
        const apiClient = createApiClient(token);
        const getReservations = await apiClient.get('/user/reservations');
        return getReservations.data;
    } catch (error) {
        console.error("Failed to fetch reservations:", error);
    }
};