import axios, {type AxiosInstance, AxiosError, type InternalAxiosRequestConfig} from 'axios';

const API_BASE_URL = 'http://localhost:8080';

function getToken(): string | null {
    return localStorage.getItem('jwt_token');
}

function setToken(token: string) {
    localStorage.setItem('jwt_token', token);
}

function clearToken() {
    localStorage.removeItem('jwt_token');
}

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor: add Authorization header if token exists
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: if we get 401, clear token and optionally reload/login
apiClient.interceptors.response.use(
    res => res,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            clearToken();
            // Optionally: window.location.reload();
        }
        return Promise.reject(error);
    }
);

export { apiClient, setToken, clearToken };
