import axiosInstance from './axios';
import { LoginRequest, LoginResponse, User } from '../types/user';

export const apiAuth = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await axiosInstance.post('/login', data);
            return response.data;
        } catch (e) {
            console.error('Login error: ', e);
            throw e;
        }
    },

    register: async (data: any) => {
        try {
            const response = await axiosInstance.post('/register', data);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    forgotPassword: async (data: { email: string }) => {
        try {
            const response = await axiosInstance.post('/forgot-password', data);
            return response.data;
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        }
    },

    resetPassword: async (data: {
        email: string;
        token: string;
        newPassword: string;
    }) => {
        try {
            const response = await axiosInstance.post('/reset-password', data);
            return response.data;
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    },
};
