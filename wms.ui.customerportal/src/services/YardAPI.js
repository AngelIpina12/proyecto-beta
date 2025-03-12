import axios from "axios";
import { getToken } from "../utils";

const baseUrl = import.meta.env.MODE === 'development' 
    ? import.meta.env.VITE_BASE_URL_LOCAL 
    : import.meta.env.VITE_BASE_URL;

export const YardAPI = {
  YardTrailerSummary: async function (useri, cancel = false) {

    const yardsumurl = `${baseUrl}/api/YardApi/GetSummary/`;
    const token = getToken();
    const response = await axios.post(yardsumurl, useri.singleDat, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response;

  },
  YardManageList: async function (objectfilter, cancel = false) {

    const yardsumurl = `${baseUrl}/api/YardApi/GetYardManagementList/`;
    const token = getToken();
    const response = await axios.post(yardsumurl, objectfilter.FilterDat, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response;

  },
  TrailerHistory: async function (objectfilter, cancel = false) {

    const yardurl = `${baseUrl}/api/YardApi/GetTrailerHistory/`;
    const info = objectfilter.singleDat;
    const token = getToken();
    const response = await axios.post(yardurl, info, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response;

  },
  GetTrailerStatusList: async function (objectfilter, cancel = false) {
    const trailerurl = `${baseUrl}/api/YardApi/GetTrailerStatusTypes/`;
    
    const token = getToken();
    const response = await axios.get(trailerurl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response;
  },
  TrailerHistory: async function (objectfilter, cancel = false) {

    const yardurl = `${baseUrl}/api/YardApi/GetTrailerHistory/`;
    const info = objectfilter.singleDat;
    const token = getToken();
    const response = await axios.post(yardurl, info, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response;

  },
  GetEventImageListPath: async function (objectfilter, cancel = false) {

    const imagerurl = `${baseUrl}/api/YardApi/GetEventImageListPath`;
    const info = objectfilter.EventDat;
    const token = getToken();
    const response = await axios.post(imagerurl, info, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response;


  },
    GetEventFileListPath: async function (objectfilter, cancel = false) {

      const fileurl = `${baseUrl}/api/YardApi/GetEventFileListPath`;
    const info = objectfilter.EventDat;
    const token = getToken();
      const response = await axios.post(fileurl, info, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response;


  },


}
