const isDevelopment = import.meta.env.DEV;

<<<<<<< HEAD
export const API_BASE_URL = isDevelopment ? 'http://localhost:8002' : '';

export const config = {
    OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8002',
};
=======
export const API_BASE_URL = isDevelopment ? 'http://localhost:8002' : '';
>>>>>>> 9012301133c1efa5e3e08e5b483030ef462be5fc
