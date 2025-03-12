import { createSlice } from '@reduxjs/toolkit';
import { setCombinedData } from './combinedDataSlice';

export const initialRequirementData = {
  Id: 0,
  CQCustomerId: null,
  MaterialFrom: "",
  RequirementTypeId: null,
  RequirementFolioNumber: "",
  AddedBy: null,
  ModifiedBy: null,
  RequirementDate: "",
  RequirementTime: "",
  AddedDate: "",
  ModifiedDate: null,
  RequirementFolio: null,
  UploadedDocuments: null,
  CQCustomerName: null,
  CustomerName: null,
  RequirementType: null,
  UploadedFile: null,
  ReceiptType: 0,
  IsManual: false,
  ExeRequirementNotificatioPath: null,
  MailPath: null,
  Folio: null,
  Warehouse: null,
  WarehouseId: 0,
  Address1: null,
  Address2: null,
  SiteUrl: null,
  ReportPath: null,
  guid: "00000000-0000-0000-0000-000000000000",
  IsCustomer: false,
  IsOverrideTimeToFulfill: false,
  Comment: null,
  OverridedDateToFulfill: null,
  Documents: null,
  ExtRequirementDetails: []
};

const requirementDataSlice = createSlice({
  name: 'requirementData',
  initialState: initialRequirementData,
  reducers: {
    setRequirementData: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateRequirementDetails: (state, action) => {
      const actionRows = action.payload;
      const transformedRows = actionRows.map(row => ({
        Id: 0,
        ExternalRequirementId: 0,
        CustomerProductId: null,
        Sku: row[0],
        Description: row[2],
        Quantity: String(row[3]),
        ProductionLine: row[5],
        Lot: row[4],
        Po: row[6],
        Release: row[7],
        Status: null,
        StatusId: 0,
        Supplier: row[1],
        SupplierProductId: null,
        Comment: row[8],
        CpIds: null,
      }));
      return { ...state, ExtRequirementDetails: [...state.ExtRequirementDetails, ...transformedRows] };
    },
    resetRequirementData: () => initialRequirementData,
  }
});

// Thunk para manejar la lógica de despachar acciones
export const updateAndSetCombinedData = (actionRows) => (dispatch, getState) => {
  dispatch(requirementDataSlice.actions.updateRequirementDetails(actionRows));
  const currentState = getState().requirementData;
  dispatch(setCombinedData(currentState.ExtRequirementDetails));
};

export const { setRequirementData, resetRequirementData, updateRequirementDetails } = requirementDataSlice.actions;
export default requirementDataSlice.reducer;