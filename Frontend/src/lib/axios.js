import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://chat-app-niuv.onrender.com/api",
    withCredentials: true,
});