import { createApiClient } from '../../apiClient';

export const fetchUsers = async (token) => {
    try {
        const apiClient = createApiClient(token);
        const getUsers = await apiClient.get('/users');
        return getUsers.data;
    } catch (error) {
        console.error("Failed to fetch users:", error);
    }
};