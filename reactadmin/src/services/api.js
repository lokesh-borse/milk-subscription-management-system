import axios from 'axios';

const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:8000`;

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('staffToken');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    } else {
        // Debug: missing token on protected endpoints will cause 401/403
        if (config.method !== 'get') {
            // eslint-disable-next-line no-console
            console.debug('[admin api] no staffToken; request may be rejected', config.url);
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('staffToken');
            localStorage.removeItem('staffUser');
            window.location.href = '#/login';
        }
        return Promise.reject(error);
    }
);

export default api;
export { API_BASE_URL };
