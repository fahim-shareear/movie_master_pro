import axios from 'axios';
import { useMemo, use } from 'react'; // Added useMemo
import { AuthContext } from '../providers/AuthContext';

const useAxios = () => {
    const { user } = use(AuthContext);

    const axiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: 'http://localhost:3000',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Add auth token to requests
        instance.interceptors.request.use(
            async (config) => {
                if (user) {
                    // It's safer to get a fresh token from Firebase
                    const token = await user.getIdToken(); 
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return instance;
    }, [user]); // Only recreate if the user object changes

    return axiosInstance;
};

export default useAxios;