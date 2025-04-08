import { createApiClient } from '../../apiClient';

export const fetchDesk = async (token, id) => {
    try {
        const apiClient = createApiClient(token);
        const getDesk = await apiClient.get(`/desks/${id}`);
        return getDesk.data;
    } catch (error) {
        console.error("Failed to fetch desk:", error);
    }
};