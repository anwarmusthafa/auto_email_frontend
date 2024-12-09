import axios from 'axios';
import { USER_ACCESS_TOKEN, USER_REFRESH_TOKEN, BASE_URL } from './constants';

// Function to get a new access token using the refresh token
const refreshToken = async (refreshToken) => {
    try {
        const response = await axios.post(`${BASE_URL}/accounts/refresh-token/`, {
            refresh: refreshToken
        });
        return response.data.access;
    } catch (error) {
        throw error;
    }
};

// Create a single axios instance for users
const axiosInstance = axios.create({
    baseURL: BASE_URL
});

// Axios request interceptor
axiosInstance.interceptors.request.use((config) => {
    // Skip Authorization for public APIs
    if (
        config.url === '/accounts/register/' ||
        config.url === '/accounts/login/' ||
        config.url === '/accounts/refresh-token/'
    ) {
        return config;
    }
    // Add Authorization header for protected APIs
    const token = localStorage.getItem(USER_ACCESS_TOKEN);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Axios response interceptor to handle token expiration
axiosInstance.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshTokenValue = localStorage.getItem(USER_REFRESH_TOKEN);
        if (refreshTokenValue) {
            try {
                const newAccessToken = await refreshToken(refreshTokenValue);
                localStorage.setItem(USER_ACCESS_TOKEN, newAccessToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                console.error('Failed to refresh token', refreshError);
                // Optionally redirect to login page or handle logout
            }
        }
    }
    return Promise.reject(error);
});

export { axiosInstance };

