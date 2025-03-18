import axios from "axios";
import { API_BASE_URL } from "./api";

const apiClient = axios.create({
    baseURL: API_BASE_URL, // Uses the centralized API base URL
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export default apiClient;
