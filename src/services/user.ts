import axiosInstance, { UPLOAD_CONFIG } from '@/src/services/axios';

export const apiUser = {
    //================= SITE APIS =================
    getMyProfile: async () => {
        try {
            const response = await axiosInstance.get('/users/me');
            return response.data;
        } catch (error) {
            console.error('Fetch my profile error: ', error);
            throw error;
        }
    },

    getPublicProfile: async (username: string) => {
        try {
            const response = await axiosInstance.get(
                `/Users/profile/${username}`
            );
            return response.data;
        } catch (error) {
            console.error('Fail to fetch public profile:', error);
            throw error;
        }
    },

    updateMyProfile: async (data: FormData) => {
        try {
            const response = await axiosInstance.put(
                '/users/me',
                data,
                UPLOAD_CONFIG
            );
            return response.data;
        } catch (error) {
            console.error('Update profile error: ', error);
            throw error;
        }
    },

    changePassword: async (data: {
        oldPassword: string;
        newPassword: string;
    }) => {
        try {
            const response = await axiosInstance.put(
                '/users/change-password',
                data
            );
            return response.data;
        } catch (error) {
            console.error('Change password error: ', error);
            throw error;
        }
    },

    getUserStats: async (username: string) => {
        try {
            const response = await axiosInstance.get(
                `/users/stats/${username}`
            );
            return response.data;
        } catch (error) {
            console.error('Fetch user stats error:', error);
            throw error;
        }
    },

    //================= ADMIN APIS =================
    getAdminUsers: async (params: any) => {
        try {
            const response = await axiosInstance.get('/admin/users', {
                params,
            });
            return response.data;
        } catch (error) {
            console.error('Fetch admin users error: ', error);
            throw error;
        }
    },

    getUserDetail: async (id: number) => {
        try {
            const response = await axiosInstance.get(`/admin/users/${id}`);
            return response.data;
        } catch (error) {
            console.error('Get user detail error: ', error);
            throw error;
        }
    },

    lockUser: async (id: number) => {
        try {
            const response = await axiosInstance.put(`/admin/users/${id}/lock`);
            return response.data;
        } catch (error) {
            console.error('Lock user error: ', error);
            throw error;
        }
    },

    unlockUser: async (id: number) => {
        try {
            const response = await axiosInstance.put(
                `/admin/users/${id}/unlock`
            );
            return response.data;
        } catch (error) {
            console.error('Unlock user error: ', error);
            throw error;
        }
    },

    getUserBooksByAdmin: async (id: number, params: any) => {
        try {
            const response = await axiosInstance.get(
                `/admin/users/${id}/books`,
                { params }
            );
            return response.data;
        } catch (error) {
            console.error('Fetch user books error: ', error);
            throw error;
        }
    },
};
