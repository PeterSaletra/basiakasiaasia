const apiRootUrl = import.meta.env.VITE_API_ROOT_URL ?? "http://localhost:8000";

export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== "false";
export const API_ROOT_URL = apiRootUrl;
export const API_BASE_URL = `${API_ROOT_URL}/api/v1`;
export const AUTH_BASE_URL = `${API_ROOT_URL}/api/auth`;
