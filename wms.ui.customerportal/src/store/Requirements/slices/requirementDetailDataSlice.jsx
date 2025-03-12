import { createSlice } from '@reduxjs/toolkit';
    
const initialRequirementDetailData = {
  Id: 0,
  ExternalRequirementId: 0,
  CustomerProductId: null,
  Sku: '',
  Description: null,
  Quantity: '',
  ProductionLine: null,
  Lot: null,
  Po: null,
  Release: null,
  Status: null,
  StatusId: 0,
  Supplier: null,
  SupplierProductId: null,
  Comment: null,
  CpIds: null,
};

const requirementDetailDataSlice = createSlice({
  name: 'requirementDetailData',
  initialState: initialRequirementDetailData,
  reducers: {
    setRequirementDetailData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetRequirementDetailData: () => initialRequirementDetailData,
  },
});

export const { setRequirementDetailData, resetRequirementDetailData } = requirementDetailDataSlice.actions;
export default requirementDetailDataSlice.reducer;