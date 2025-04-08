import { createApiClient } from '../../apiClient';

export const fetchUserReservationsAdmin = async (token, id) => {
        const apiClient = createApiClient(token);
        const userReservationsData = await apiClient.get(`/users/${id}/reservations`);
        return userReservationsData.data;
};