import { createApiClient } from '../../apiClient';

export const fetchReservationAdmin = async (token, id) => {
        const apiClient = createApiClient(token);
        const reservationData = await apiClient.get(`/reservations/${id}`);
        return reservationData.data;
};