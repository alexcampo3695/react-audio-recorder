const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment ? 'http://localhost:8002' : '';

export const config = {
    OPENAI_API_KEY: import.meta.env.OPENAI_API_KEY || '',
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8002',
};
