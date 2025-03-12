import axios from "axios";
import { getToken } from "../utils";

const baseUrl = import.meta.env.MODE === 'development' 
    ? import.meta.env.VITE_BASE_URL_LOCAL 
    : import.meta.env.VITE_BASE_URL;

export const RequirementsAPI = {
    ActiveRequirementsList: async function (UserId, cancel = false) {
      const activeRequirementsURL = `${baseUrl}/api/ReqApi/GetActiveRequirements/`;
      const token = getToken();
      const response = await axios.post(activeRequirementsURL, {UserId}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response;
    },
    GetListRequirementDetails: async function (folioNumber, cancel = false) {
      const filteredByFolioRequirementsURL = `${baseUrl}/api/ReqApi/GetListRequirementDetails/`;
      const token = getToken();
      const response = await axios.post(filteredByFolioRequirementsURL, {strREQFolio: folioNumber}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      return response;
    },
    GetListRequirementSKUEndCustomer: async function (objectFilter, cancel = false) {
      const filteredBySKUEndCustomerRequirementsURL = `${baseUrl}/api/ReqApi/GetListRequirementSKUEndCustomer/`;
      const token = getToken();
      const response = await axios.post(filteredBySKUEndCustomerRequirementsURL, objectFilter, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      return response;
    },
    GetListRequirementCQFolio: async function (objectFilter, cancel = false) {
      const filteredByCQFolioURL = `${baseUrl}/api/ReqApi/GetListRequirementCQFolio/`;
      const token = getToken();
      const response = await axios.post(filteredByCQFolioURL, objectFilter, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      return response;
    },
    GetListRequirementCQCustomerFolio: async function (objectFilter, cancel = false) {
      const filteredByCQCustomerFolioURL = `${baseUrl}/api/ReqApi/GetListRequirementCQCustomerFolio/`;
      const token = getToken();
      const response = await axios.post(filteredByCQCustomerFolioURL, objectFilter, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      return response;
    },
    GetListRequirementSupplier: async function (objectFilter, cancel = false) {
      const filteredBySupplierURL = `${baseUrl}/api/ReqApi/GetListRequirementSupplier/`;
      const token = getToken();
      const response = await axios.post(filteredBySupplierURL, objectFilter, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      return response;
    },
    GetRequirementTypes: async function () {
      const getRequirementsURL = `${baseUrl}/api/ReqApi/GetRequirementTypes/`;
      const token = getToken();
      const response = await axios.post(getRequirementsURL, null, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
      });
      return response;
    },
    PostRequirement: async function (objectFilter, cancel = false) {
      const logurl = `${baseUrl}/api/CustomLayer/SaveExternalRequirement/`;
    
          const response = await axios.post(logurl, objectFilter);
  
          return response
    },
    GetProductDetails: async function (objectFilter){
      const getProductDetailsURL = `${baseUrl}/api/CustomLayer/GetProductDetails/`;
      const token = getToken();
      const response = await axios.post(getProductDetailsURL, objectFilter, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      return response;
    },
    GetSKUList: async function (objectFilter){
      const getSKUListURL = `${baseUrl}/api/ReqApi/GetSKUList/`;
      const token = getToken();
      const response = await axios.post(getSKUListURL, objectFilter, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      return response;
    },
    GetSupplierList: async function (objectFilter){
      const getSupplierListURL = `${baseUrl}/api/ReqApi/GetSupplierList/`;
      const token = getToken();
      const response = await axios.post(getSupplierListURL, objectFilter, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      return response;
    }
}