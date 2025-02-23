import { createApiClient } from '../apiClient';

export const fetchReservation = async (token, id) => {
        const apiClient = createApiClient(token);
        const reservationData = await apiClient.get(`/user/reservations/${id}`);
        return reservationData.data;
};