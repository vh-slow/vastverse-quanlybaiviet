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
};
