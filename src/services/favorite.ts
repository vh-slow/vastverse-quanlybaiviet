import axiosInstance from '@/src/services/axios';

export const apiFavorite = {
    getMyFavorites: async () => {
        try {
            const response = await axiosInstance.get('/favorites/my-favorites');
            return response.data;
        } catch (error) {
            console.error('Fetch my favorites error:', error);
            throw error;
        }
    },

    toggleFavorite: async (id: number) => {
        try {
            const response = await axiosInstance.post(`/favorites/book/${id}`);
            return response.data;
        } catch (error) {
            console.error('Toggle favorite error:', error);
            throw error;
        }
    },
};
