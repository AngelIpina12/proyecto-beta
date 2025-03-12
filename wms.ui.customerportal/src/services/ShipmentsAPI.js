import axios from "axios";
import { getToken } from "../utils";

const baseUrl = import.meta.env.MODE === 'development' 
    ? import.meta.env.VITE_BASE_URL_LOCAL 
    : import.meta.env.VITE_BASE_URL;

export const ShipmentsAPI = {
    GetListShipmentDetails: async function (shipmentId, cancel = false) {
      const filteredByShipmentIdURL = `${baseUrl}/api/ShipApi/GetShipDetails/`;
      const token = getToken();
      const response = await axios.post(filteredByShipmentIdURL, {intShipmentId: shipmentId}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      return response;
    },
}