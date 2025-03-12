import axios from "axios";
import { getToken } from "../utils";

const baseUrl = import.meta.env.MODE === 'development' 
    ? import.meta.env.VITE_BASE_URL_LOCAL 
    : import.meta.env.VITE_BASE_URL;

export const CatalogoAPI = {
    GetEndCustomer: async function (filters, cancel = false) {
        const url =`${baseUrl}/api/CatApi/GetEndCustomer/`;
        const token = getToken();
        const response = await axios.post(url, filters, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return response;
    },
    GetProductSKUCustom: async function (filters, cancel = false) {
        const url =`${baseUrl}/api/CatApi/GetProductSKUCustom/`;
        const token = getToken();
        const response = await axios.post(url, filters, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return response;
    },
    GetSupplier: async function (filters, cancel = false) {
        const url =`${baseUrl}/api/CatApi/GetSupplier/`;
        const token = getToken();
        const response = await axios.post(url, filters, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return response;
    },
    GetSupplierSKU: async function (filters, cancel = false) {
        const url =`${baseUrl}/api/CatApi/GetSupplierSKU/`;
        const token = getToken();
        const response = await axios.post(url, filters, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return response;
    },
}
