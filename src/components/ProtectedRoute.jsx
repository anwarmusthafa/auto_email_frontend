import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { axiosInstance } from '../services/axiosSetUp';
import { USER_ACCESS_TOKEN, USER_REFRESH_TOKEN } from '../services/constants';

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        authenticate().catch(() => setIsAuthorized(false));
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(USER_REFRESH_TOKEN);
        try {
            const response = await axiosInstance.post('/accounts/refresh-token/', {
                refresh: refreshToken,
            });
            if (response.status === 200) {
                localStorage.setItem(USER_ACCESS_TOKEN, response.data.access); // Corrected line
                localStorage.setItem(USER_REFRESH_TOKEN, response.data.refresh); // Set refresh token properly
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            setIsAuthorized(false);
        }
    };

    const authenticate = async () => {
        const token = localStorage.getItem(USER_ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;
            console.log("Token Expiry:", tokenExpiration, "Current Time:", now);
            if (tokenExpiration < now) {
                await refreshToken();
            } else {
                setIsAuthorized(true);
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            setIsAuthorized(false);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
