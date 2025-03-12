import axios from "axios";
import { getToken } from "../utils";

const baseUrl = import.meta.env.MODE === 'development' 
    ? import.meta.env.VITE_BASE_URL_LOCAL 
    : import.meta.env.VITE_BASE_URL;

export const InventoryAPI = {
    TodayInventoryList: async function (intUserId, cancel = false) {
        const todayInventoryURL =`${baseUrl}/api/InvApi/GetTodayInv/`;
        const token = getToken();
        const response = await axios.post(todayInventoryURL, {intUserId}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetSKUInWork: async function(objectfilter, cancel = false){
        const filteredBySKUInfoProcessWO = `${baseUrl}/api/InvApi/GetSKUInWork/`;
        const token = getToken();
        const response = await axios.post(filteredBySKUInfoProcessWO, objectfilter, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetSKUAllocated: async function(objectfilter, cancel = false){
        const filteredBySKUAllocated = `${baseUrl}/api/InvApi/GetSKUAllocated/`;
        const token = getToken();
        const response = await axios.post(filteredBySKUAllocated, objectfilter, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetSKUNOTAllocated: async function(objectfilter, cancel = false){
        const filteredBySKUNotAllocated = `${baseUrl}/api/InvApi/GetSKUNOTAllocated/`;
        const token = getToken();
        const response = await axios.post(filteredBySKUNotAllocated, objectfilter, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetSKUOnHand: async function(objectfilter, cancel = false){
        const filteredBySKUOnHand = `${baseUrl}/api/InvApi/GetSKUOnHand/`;
        const token = getToken();
        const response = await axios.post(filteredBySKUOnHand, objectfilter, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetInvByEndSKU: async function(objectfilter, cancel = false){
        const filteredByEndCustomerSKU = `${baseUrl}/api/InvApi/GetInvByEndSKU/`;
        const token = getToken();
        const response = await axios.post(filteredByEndCustomerSKU, objectfilter, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetInvByEndCustomer: async function(objectfilter, cancel = false){
        const filteredByEndCustomer = `${baseUrl}/api/InvApi/GetInvByEndCustomer/`;
        const token = getToken();
        const response = await axios.post(filteredByEndCustomer, objectfilter, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetInvBySupplierSKU: async function(objectfilter, cancel = false){
        const filteredBySupplierSKU = `${baseUrl}/api/InvApi/GetInvBySupplierSKU/`;
        const token = getToken();
        const response = await axios.post(filteredBySupplierSKU, objectfilter, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetInvBySupplier: async function(objectfilter, cancel = false){
        const filteredBySupplier = `${baseUrl}/api/InvApi/GetInvBySupplier/`;
        const token = getToken();
        const response = await axios.post(filteredBySupplier, objectfilter, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetSupplierList: async function () {
        const getSupplierListURL = `${baseUrl}/api/InvApi/GetSupplierList/`;
        const token = getToken();
        const response = await axios.post(getSupplierListURL, null, {
          headers: {
              'Authorization': `Bearer ${token}`,
          }
        });
        return response;
      },
}