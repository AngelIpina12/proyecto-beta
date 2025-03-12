import axios from "axios";
import { getToken } from "../utils";

const baseUrl = import.meta.env.MODE === 'development' 
    ? import.meta.env.VITE_BASE_URL_LOCAL 
    : import.meta.env.VITE_BASE_URL;

export const DashboardAPI = {
    GetPalletsValues: async function (filters, cancel = false) {
        const url =`${baseUrl}/api/DashboardApi/GetPalletsValues/`;
        const token = getToken();
        const response = await axios.post(url, filters, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetRequirementsValues: async function (filters, cancel = false) {
        const url =`${baseUrl}/api/DashboardApi/GetRequirementsValues/`;
        const token = getToken();
        const response = await axios.post(url, filters, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetVolumenTrailers: async function (filters, cancel = false) {
        const url =`${baseUrl}/api/DashboardApi/GetVolumenTrailers/`;
        const token = getToken();
        const response = await axios.post(url, filters, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
}