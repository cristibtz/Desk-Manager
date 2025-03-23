import { createApiClient } from '../../apiClient';

export const fetchUser = async (token, id) => {
    try {
        
        const apiClient = createApiClient(token);
        const getUser = await apiClient.get(`/users/${id}`);
        return getUser.data;
    } catch (error) {
        console.error("Failed to fetch users:", error);
    }
};