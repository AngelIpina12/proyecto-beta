import axios from "axios";
import { getToken } from "../utils";

const baseUrl = import.meta.env.MODE === 'development' 
    ? import.meta.env.VITE_BASE_URL_LOCAL 
    : import.meta.env.VITE_BASE_URL;

export const ReceiveAPI = {
    TodayReceiveList: async function (UserId, cancel = false) {
        const todayReceiveURL =`${baseUrl}/api/RecepApi/GetTodayReceiveList/`;
        const token = getToken();
        const response = await axios.post(todayReceiveURL, {UserId}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return response;
    },
    GetReceiveListByRecFolio: async function (folioNumber, cancel = false) {
        const filteredByFolioReceivesURL = `${baseUrl}/api/RecepApi/GetReceiveListByRecFolio/`;
        const token = getToken();
        const response = await axios.post(filteredByFolioReceivesURL, {strRECFolio: folioNumber}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
        });
        return response;
    },
    GetReceiveSKUAndFolioInfo: async function (objectfilter, cancel = false) {
        const receiveSKUInfoURL = `${baseUrl}/api/RecepApi/GetReceiveSKUAndFolioInfo/`;
        const token = getToken();
        const response = await axios.post(receiveSKUInfoURL, objectfilter, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
        });
        return response;
    },
    GetReceiveListByCustomerDate: async function(objectfilter, cancel = false){
        const filteredByEndCustomerReceivesURL = `${baseUrl}/api/RecepApi/GetReceiveListByCustomerDate/`;
        const token = getToken();
        const response = await axios.post(filteredByEndCustomerReceivesURL, objectfilter, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetReceiveListBySKUDate: async function (objectfilter, cancel = false) {
        const filterBySKUReceiveURL = `${baseUrl}/api/RecepApi/GetReceiveListBySKUDate/`;
        const token = getToken();
        const response = await axios.post(filterBySKUReceiveURL, objectfilter, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetReceiveListBySupplierDate: async function (objectfilter, cancel = false) {
        const filterBySupplierReceiveURL = `${baseUrl}/api/RecepApi/GetReceiveListBySupplierDate/`;
        const token = getToken();
        const response = await axios.post(filterBySupplierReceiveURL, objectfilter, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetReceiveListByDate: async function (objectfilter, cancel = false) {
        const filterByDatesReceiveURL = `${baseUrl}/api/RecepApi/GetReceiveListByDate/`;
        const token = getToken();
        const response = await axios.post(filterByDatesReceiveURL, objectfilter, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    },
    GetEndCustomerList: async function () {
        const getEndCustomerListURL = `${baseUrl}/api/RecepApi/GetEndCustomerList/`;
        const token = getToken();
        const response = await axios.post(getEndCustomerListURL, null, {
          headers: {
              'Authorization': `Bearer ${token}`,
          }
        });
        return response;
      },
      GetSupplierList: async function () {
        const getSupplierListURL = `${baseUrl}/api/RecepApi/GetSupplierList/`;
        const token = getToken();
        const response = await axios.post(getSupplierListURL, null, {
          headers: {
              'Authorization': `Bearer ${token}`,
          }
        });
        return response;
      },
}