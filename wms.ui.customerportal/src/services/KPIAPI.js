import axios from "axios";
import { getToken } from "../utils";

const baseUrl = import.meta.env.MODE === 'development' 
    ? import.meta.env.VITE_BASE_URL_LOCAL 
    : import.meta.env.VITE_BASE_URL;

export const KPIAPI = {
    GetWarehousesToSelect: async function (filters, cancel = false) {
        const url =`${baseUrl}/api/KPIApi/GetWareHouses/`;
        const token = getToken();
        const response = await axios.post(url, filters, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetCustomersToSelect: async function (filters, cancel = false) {
        const url =`${baseUrl}/api/KPIApi/GetCustomersFromWareHouse/`;
        const token = getToken();
        const response = await axios.post(url, filters, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetUsersToSelect: async function (filters, cancel = false) {
        const url =`${baseUrl}/api/KPIApi/GetUsersToSelect/`;
        const token = getToken();
        const response = await axios.post(url, filters, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetCustomerModules: async function (filters, cancel = false) {
        const url =`${baseUrl}/api/KPIApi/GetCustomerModules/`;
        const token = getToken();
        const response = await axios.post(url, filters, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    InsertUpdateCustomOption: async function (body, cancel = false) {
        const url =`${baseUrl}/api/KPIApi/InsertUpdateCustomOption/`;
        const token = getToken();
        const response = await axios.post(url, body, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    UpdateCustomOptions: async function (body, cancel = false) {
        const url =`${baseUrl}/api/KPIApi/UpdateCustomOptions/`;
        const token = getToken();
        const response = await axios.post(url, body, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetKPIOptions: async function (UserId, cancel = false) {
        const url = `${baseUrl}/api/KPIApi/GetKPIOptionsForUserId/`;
        const token = getToken();
        const response = await axios.post(url, {intUserId: UserId}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetKPIOptionsForWarehouseAndCustomer: async function (filter, cancel = false) {
        const url = `${baseUrl}/api/KPIApi/GetKPIOptionsForWarehouseAndCustomer/`;
        const token = getToken();
        const response = await axios.post(url, filter, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    SetBaseUrlToUsers: async function (body, cancel = false) {
        const url =`${baseUrl}/api/KPIApi/SetBaseUrlToUsers/`;
        const token = getToken();
        const response = await axios.post(url, body, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetBaseOptionForUserId: async function (filter, cancel = false) {
        const url = `${baseUrl}/api/KPIApi/GetBaseOptionForUserId/`;
        const token = getToken();
        const response = await axios.post(url, filter, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
}