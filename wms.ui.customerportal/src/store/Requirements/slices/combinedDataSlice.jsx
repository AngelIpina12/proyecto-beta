import { createSlice } from '@reduxjs/toolkit';

const initialCombinedData = [];

const combinedDataSlice = createSlice({
  name: 'combinedData',
  initialState: initialCombinedData,
  reducers: {
    setCombinedData: (state, action) => {
      return action.payload;
    },
    addToCombinedData: (state, action) => {
      return [...state, ...action.payload];
    },
    resetCombinedData: () => initialCombinedData,
  },
});

export const { setCombinedData, addToCombinedData, resetCombinedData } = combinedDataSlice.actions;
export default combinedDataSlice.reducer;
