import axios from "axios"
import { getToken } from "../utils";

const baseUrl = import.meta.env.MODE === 'development' 
    ? import.meta.env.VITE_BASE_URL_LOCAL 
    : import.meta.env.VITE_BASE_URL;

export const userAPI = {
	validate: async function (userdata, cancel = false) {
		const logurl = `${baseUrl}/api/CustomLayer/ValidateSingleUser/`;
		const response = await axios.post(logurl, userdata.singleDat);
		return response
	},
	getUserInfo: async function (userdata, cancel = false) {
		const logurl = `${baseUrl}/api/UserApi/GetUserInfo/`;
		const token = getToken();
		const response = await axios.post(logurl, userdata.singleDat, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		return response
	},
	getUserInfo2: async function (filters, cancel = false) {
		const url = `${baseUrl}/api/UserApi/GetUserInfo/`;
		const token = getToken();
        const response = await axios.post(url, filters, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
		return response
	},
}
