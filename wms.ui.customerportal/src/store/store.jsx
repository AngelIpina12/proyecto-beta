import { configureStore } from '@reduxjs/toolkit';
import requirementDataReducer from './Requirements/slices/requirementDataSlice';
import requirementDetailDataReducer from './Requirements/slices/requirementDetailDataSlice';
import combinedDataReducer from './Requirements/slices/combinedDataSlice';
import dashboardModalReducer from './Dashboard/slices/dashboardModalSlice';

const store = configureStore({
  reducer: {
    requirementData: requirementDataReducer,
    requirementDetailData: requirementDetailDataReducer,
    combinedData: combinedDataReducer,
    dashboardModal: dashboardModalReducer,
  },
});

export default store;