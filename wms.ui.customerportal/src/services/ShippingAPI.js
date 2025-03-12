import axios from "axios";
import { getToken } from "../utils";

const baseUrl = import.meta.env.MODE === 'development' 
    ? import.meta.env.VITE_BASE_URL_LOCAL 
    : import.meta.env.VITE_BASE_URL;

export const ShippingAPI = {
	GetShipTodaySummary: async function (userId, cancel = false) {
		const shippingUrl = `${baseUrl}/api/ShipApi/GetShipTodaySummary/`;
		const token = getToken();
		const response = await axios.post(shippingUrl, {intUserId: userId }, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		return response;
    },
	GetShipTodayDetail: async function (userId, cancel = false) {
		const shippingUrl = `${baseUrl}/api/ShipApi/GetShipTodayDetail/`;
		const token = getToken();
		const response = await axios.post(shippingUrl, {intUserId: userId }, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		return response;
	},
	GetShipDetailByReqFolio: async function (filters, cancel = false) {
		const shippingUrl = `${baseUrl}/api/ShipApi/GetShipDetailByReqFolio/`;
		const token = getToken();
		const response = await axios.post(shippingUrl, filters, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		return response;
	},
	GetShipDetailByEndCustomer: async function (filters, cancel = false) {
		const shippingUrl = `${baseUrl}/api/ShipApi/GetShipDetailByEndCustomer/`;
		const token = getToken();
		const response = await axios.post(shippingUrl, filters, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		return response;
	},
	GetShipDetailByTrailerN: async function (filters, cancel = false) {
		const shippingUrl = `${baseUrl}/api/ShipApi/GetShipDetailByTrailerN/`;
		const token = getToken();
		const response = await axios.post(shippingUrl, filters, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		return response;
	},
	GetShipByEndSKuCustom: async function (filters, cancel = false) {
		const shippingUrl = `${baseUrl}/api/ShipApi/GetShipByEndSKuCustom/`;
		const token = getToken();
		const response = await axios.post(shippingUrl, filters, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		return response;
	},
	GetShipDetailByShipFolio: async function (filters, cancel = false) {
		const shippingUrl = `${baseUrl}/api/ShipApi/GetShipDetailByShipFolio/`;
		const token = getToken();
		const response = await axios.post(shippingUrl, filters, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		return response;
	},
}