import axiosInstance from '@/src/services/axios';

export const apiDashboard = {
    getSummary: async () => {
        try {
            const response = await axiosInstance.get('/dashboard/summary');
            return response.data;
        } catch (error) {
            console.error('Fetch dashboard summary error:', error);
            throw error;
        }
    },

    getAnalytics: async () => {
        try {
            const response = await axiosInstance.get('/dashboard/analytics');
            return response.data;
        } catch (error) {
            console.error('Fetch dashboard analytics error:', error);
            throw error;
        }
    },
};
