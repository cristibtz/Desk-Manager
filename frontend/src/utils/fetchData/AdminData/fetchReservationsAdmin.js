import { createApiClient } from '../../apiClient';

export const fetchReservationsAdmin = async (token) => {
    try {
        const apiClient = createApiClient(token);
        const getReservations = await apiClient.get('/reservations');
        return getReservations.data;
    } catch (error) {
        console.error("Failed to fetch reservations:", error);
    }
};