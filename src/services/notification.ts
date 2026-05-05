import axiosInstance from './axios';

export const apiNotification = {
    getNotifications: async () => {
        try {
        const response = await axiosInstance.get('/Notifications');
        return response.data;
        } catch (error) {
            console.error('Fetch notifications error:', error);
            throw error;
        }
    },
    markAsRead: async (id: number) => {
        try {
            const response = await axiosInstance.put(`/Notifications/${id}/read`);
            return response.data;
        } catch (error) {
            console.error('Mark notification as read error:', error);
            throw error;
        }
    },
    markAllAsRead: async () => {
        try {
        const response = await axiosInstance.put(`/Notifications/read-all`);
        return response.data;
        } catch (error) {
            console.error('Mark all notifications as read error:', error);

            throw error;
        }
    },
};
