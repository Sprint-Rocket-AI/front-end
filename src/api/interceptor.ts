import axios from "axios";
import { getOidcToken } from "../modules/auth/utils/token";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081",
    timeout: 3000000,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = getOidcToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        let errorMessage = "Hubo un error, reintentar más tarde";
        const data = error.response?.data;

        if (data) {
            if (Array.isArray(data.errores) && data.errores.length > 0) {
                const specificErrors = data.errores.map((e: any) => e.mensaje).join(", ");
                errorMessage = data.mensaje ? `${data.mensaje}: ${specificErrors}` : specificErrors;
            } else if (typeof data.mensaje === "string" && data.mensaje.trim() !== "") {
                errorMessage = data.mensaje;
            } else if (typeof data === "string" && data.trim() !== "") {
                errorMessage = data;
            } else if (error.message) {
                errorMessage = error.message;
            }
        }

        const event = new CustomEvent("api-error", {
            detail: errorMessage,
        });
        window.dispatchEvent(event);
        return Promise.reject(error);
    },
);

export default apiClient;
