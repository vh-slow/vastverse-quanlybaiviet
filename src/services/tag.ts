import axiosInstance from '@/src/services/axios';

export const apiTag = {
    getTrendingTags: async (limit = 10) => {
        try {
            const response = await axiosInstance.get(
                `/Tags/trending?limit=${limit}`
            );
            return response.data;
        } catch (error) {
            console.error('Fetch trending tags error:', error);
            throw error;
        }
    },

    getRelatedTags: async (bookId: number, limit = 5) => {
        try {
            const response = await axiosInstance.get(
                `/Tags/related/${bookId}?limit=${limit}`
            );
            return response.data;
        } catch (error) {
            console.error('Fetch related tags error:', error);
            throw error;
        }
    },
};
