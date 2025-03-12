import axios from "axios";
import { getToken } from "../utils";

const baseUrl = import.meta.env.MODE === 'development' 
    ? import.meta.env.VITE_BASE_URL_LOCAL 
    : import.meta.env.VITE_BASE_URL;

export const GraphPhotosAPI = {
    GetPhotos: async function (payload, cancel = false) {
        const todayInventoryURL =`${baseUrl}/api/GraphPhotos/GetGraphPhotos/`;
        const token = getToken();
        const response = await axios.post(todayInventoryURL, payload, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
}