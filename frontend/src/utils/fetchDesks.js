import { createApiClient } from './apiClient';

export const fetchDesks = async (token) => {
    try {
        const apiClient = createApiClient(token);
        const getDesks = await apiClient.get('/desks');
        return getDesks.data;
    } catch (error) {
        console.error("Failed to fetch desks:", error);
    }
};