import axiosInstance from '@/src/services/axios';

export const apiComment = {
    // ================= SITE APIS =================
    getCommentsByBook: async (bookId: number) => {
        try {
            const response = await axiosInstance.get(
                `/Comments/Book/${bookId}`
            );
            return response.data;
        } catch (error) {
            console.error('Fetch comments error: ', error);
            throw error;
        }
    },
    createComment: async (data: { bookId: number; content: string }) => {
        try {
            const response = await axiosInstance.post('/Comments', data);
            return response.data;
        } catch (error) {
            console.error('Create comment error: ', error);
            throw error;
        }
    },
    updateComment: async (id: number, data: { content: string }) => {
        try {
            const response = await axiosInstance.put(`/Comments/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Update comment error: ', error);
            throw error;
        }
    },
    deleteComment: async (id: number) => {
        try {
            const response = await axiosInstance.delete(`/Comments/${id}`);
            return response.data;
        } catch (error) {
            console.error('Delete comment error: ', error);
            throw error;
        }
    },

    //ADMIN APIS
    getAdminComments: async (params: any) => {
        try {
            const response = await axiosInstance.get('/admin/comments', {
                params,
            });
            return response.data;
        } catch (error) {
            console.error('Fetch admin comments error: ', error);
            throw error;
        }
    },

    deleteCommentForAdmin: async (id: number) => {
        try {
            const response = await axiosInstance.delete(
                `/admin/comments/${id}`
            );
            return response.data;
        } catch (error) {
            console.error('Delete comment error: ', error);
            throw error;
        }
    },

    restoreComment: async (id: number) => {
        try {
            const response = await axiosInstance.put(
                `/admin/comments/${id}/restore`
            );
            return response.data;
        } catch (error) {
            console.error('Restore comment error: ', error);
            throw error;
        }
    },
};
