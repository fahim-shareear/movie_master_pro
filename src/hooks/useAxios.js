import axios from 'axios';
import { use } from 'react';
import { AuthContext } from '../providers/AuthContext';

const useAxios = () => {
    const { user } = use(AuthContext);

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3000',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // Add auth token to requests
    axiosInstance.interceptors.request.use(
        (config) => {
            if (user) {
                config.headers.Authorization = `Bearer ${user.accessToken || ''}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Handle response errors
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                console.error('Unauthorized: Please login again');
            }
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useAxios;
