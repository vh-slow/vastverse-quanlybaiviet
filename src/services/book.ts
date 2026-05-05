import axiosInstance, { UPLOAD_CONFIG } from '@/src/services/axios';

export const apiBook = {
    //================= SITE APIS =================
    getPublicBooks: async (params: any) => {
        try {
            const response = await axiosInstance.get('/books', { params });
            return response.data;
        } catch (error) {
            console.error('Fetch public books error: ', error);
            throw error;
        }
    },

    getPublicBookBySlug: async (slug: string) => {
        try {
            const response = await axiosInstance.get(`/books/${slug}`);
            return response.data;
        } catch (error) {
            console.error('Fetch book detail error: ', error);
            throw error;
        }
    },

    getBooksByUsername: async (username: string, params: any) => {
        try {
            const response = await axiosInstance.get(
                `/books/user/${username}`,
                { params }
            );
            return response.data;
        } catch (error) {
            console.error('Fetch user books error:', error);
            throw error;
        }
    },

    getBookById: async (id: number) => {
        try {
            const response = await axiosInstance.get(`/books/detail/${id}`);
            return response.data;
        } catch (error) {
            console.error('Fetch book detail by ID error: ', error);
            throw error;
        }
    },

    updateBook: async (id: number, data: FormData) => {
        try {
            const response = await axiosInstance.put(
                `/books/${id}`,
                data,
                UPLOAD_CONFIG
            );
            return response.data;
        } catch (error) {
            console.error('Update book error:', error);
            throw error;
        }
    },

    getRelatedBooks: async (id: number) => {
        try {
            const response = await axiosInstance.get(`/books/${id}/related`);
            return response.data;
        } catch (error) {
            console.error('Fetch related books error: ', error);
            throw error;
        }
    },

    incrementView: async (id: number) => {
        try {
            const response = await axiosInstance.post(
                `/books/${id}/increment-view`
            );
            return response.data;
        } catch (error) {
            console.error('Increment view error:', error);
        }
    },

    getMyBooks: async (params: any) => {
        try {
            const response = await axiosInstance.get('/books/my-books', {
                params,
            });
            return response.data;
        } catch (error) {
            console.error('Fetch my books error: ', error);
            throw error;
        }
    },

    createBook: async (data: FormData) => {
        try {
            const response = await axiosInstance.post(
                '/books',
                data,
                UPLOAD_CONFIG
            );
            return response.data;
        } catch (error) {
            console.error('Create book error: ', error);
            throw error;
        }
    },

    deleteBook: async (id: number) => {
        try {
            const response = await axiosInstance.delete(`/books/${id}`);
            return response.data;
        } catch (error) {
            console.error('Delete book error:', error);
            throw error;
        }
    },

    toggleVisibility: async (id: number) => {
        try {
            const response = await axiosInstance.put(
                `/books/${id}/toggle-visibility`
            );
            return response.data;
        } catch (error) {
            console.error('Toggle visibility error:', error);
            throw error;
        }
    },

    getFeedBooks: async (params?: any) => {
        try {
            const response = await axiosInstance.get('/Books/feed', { params });
            return response.data;
        } catch (error) {
            console.error('Fetch feed books error:', error);
            throw error;
        }
    },

    //================= ADMIN APIS =================
    getAdminBooks: async (params: any) => {
        try {
            const response = await axiosInstance.get('/admin/books', {
                params,
            });
            return response.data;
        } catch (error) {
            console.error('Fetch admin books error: ', error);
            throw error;
        }
    },

    createBookForAdmin: async (data: FormData) => {
        try {
            const response = await axiosInstance.post(
                '/admin/books',
                data,
                UPLOAD_CONFIG
            );
            return response.data;
        } catch (error) {
            console.error('Error creating book: ', error);
            throw error;
        }
    },

    getBookByIdForAdmin: async (id: number) => {
        try {
            const response = await axiosInstance.get(`/admin/books/${id}`);
            return response.data;
        } catch (error) {
            console.error('Fetch book details error: ', error);
            throw error;
        }
    },

    updateBookForAdmin: async (id: number, data: FormData) => {
        try {
            const response = await axiosInstance.put(
                `/admin/books/${id}`,
                data,
                UPLOAD_CONFIG
            );
            return response.data;
        } catch (error) {
            console.error('Update book error: ', error);
            throw error;
        }
    },

    deleteBookForAdmin: async (id: number) => {
        try {
            const response = await axiosInstance.delete(`/admin/books/${id}`);
            return response.data;
        } catch (error) {
            console.error('Delete book error: ', error);
            throw error;
        }
    },

    getBookHistoryForAdmin: async (id: number) => {
        try {
            const response = await axiosInstance.get(
                `/admin/books/${id}/history`
            );
            return response.data;
        } catch (error) {
            console.error('Fetch book history error: ', error);
            throw error;
        }
    },

    restoreBook: async (id: number) => {
        try {
            const response = await axiosInstance.put(
                `/admin/books/${id}/restore`
            );
            return response.data;
        } catch (error) {
            console.error('Restore book error: ', error);
            throw error;
        }
    },

    approveBook: async (id: number) => {
        try {
            const response = await axiosInstance.put(
                `/admin/books/${id}/approve`
            );
            return response.data;
        } catch (error) {
            console.error('Approve book error: ', error);
            throw error;
        }
    },

    lockBook: async (id: number) => {
        try {
            const response = await axiosInstance.put(`/admin/books/${id}/lock`);
            return response.data;
        } catch (error) {
            console.error('Lock book error: ', error);
            throw error;
        }
    },
};
