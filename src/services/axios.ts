import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

export const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7120/api/';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    withCredentials: false,
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');

                if (
                    window.location.pathname !== '/login' &&
                    !window.location.pathname.startsWith('/admin')
                ) {
                    window.location.href = '/login';
                    toast.error('Phiên đã hết hạn. Vui lòng đăng nhập lại.');
                }
            }
            console.error('Token expired or invalid!');
        }
        return Promise.reject(error);
    }
);

export const UPLOAD_CONFIG: AxiosRequestConfig = {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
};

export default axiosInstance;
