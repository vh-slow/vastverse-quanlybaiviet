// src/services/category.ts
import axiosInstance, { UPLOAD_CONFIG } from '@/src/services/axios';

export const apiCategory = {
    getAllCategories: async () => {
        try {
            const response = await axiosInstance.get('/categories');
            return response.data;
        } catch (error) {
            console.error('Fetch categories error: ', error);
            throw error;
        }
    },

    // ================= ADMIN APIS =================

    getAdminCategories: async (params: any) => {
        try {
            const response = await axiosInstance.get('/admin/categories', {
                params,
            });
            return response.data;
        } catch (error) {
            console.error('Fetch admin categories error: ', error);
            throw error;
        }
    },

    getCategoryById: async (id: number) => {
        try {
            const response = await axiosInstance.get(`/admin/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category by id: ', error);
            throw error;
        }
    },

    createCategory: async (data: FormData) => {
        try {
            const response = await axiosInstance.post(
                '/admin/categories',
                data,
                UPLOAD_CONFIG
            );
            return response.data;
        } catch (error) {
            console.error('Error creating category: ', error);
            throw error;
        }
    },

    updateCategory: async (id: number, data: FormData) => {
        try {
            const response = await axiosInstance.put(
                `/admin/categories/${id}`,
                data,
                UPLOAD_CONFIG
            );
            return response.data;
        } catch (error) {
            console.error('Error updating category: ', error);
            throw error;
        }
    },

    deleteCategory: async (id: number) => {
        try {
            const response = await axiosInstance.delete(
                `/admin/categories/${id}`
            );
            return response.data;
        } catch (error) {
            console.error('Delete category error: ', error);
            throw error;
        }
    },

    restoreCategory: async (id: number) => {
        try {
            const response = await axiosInstance.put(
                `/admin/categories/${id}/restore`
            );
            return response.data;
        } catch (error) {
            console.error('Restore category error: ', error);
            throw error;
        }
    },
};
