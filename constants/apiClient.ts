import axios from "axios";
import { API_BASE_URL } from "./api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Password: "VfAphuykVVn)LD+_567@"
    },
});

export default apiClient;
