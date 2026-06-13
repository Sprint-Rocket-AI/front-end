import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
    timeout: 30000,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const event = new CustomEvent("api-error", {
            detail: "Hubo un error, reintentar más tarde",
        });
        window.dispatchEvent(event);
        return Promise.reject(error);
    },
);

export default apiClient;
