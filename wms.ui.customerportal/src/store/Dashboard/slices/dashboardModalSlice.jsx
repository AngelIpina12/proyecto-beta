import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modals: [{ id: Math.round(Math.random() * 1000), x: 100, y: 100, name: "Bienvenido a tu dashboard" }],
};

// Guardar el estado en localStorage
const saveStateToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('modalsPosition', serializedState);
  } catch (e) {
    console.error("No se pudo guardar el estado", e);
  }
};

// Cargar el estado desde localStorage
const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('modalsPosition');
    if (serializedState === null) return initialState;
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("No se pudo cargar el estado", e);
    return initialState;
  }
};

const dashboardModalSlice = createSlice({
  name: 'dashboardModal',
  initialState: loadStateFromLocalStorage(),
  reducers: {
    setModals: (state, action) => {
      state.modals = action.payload;
      saveStateToLocalStorage(state.modals);
    },
    resetModals: (state) => {
      state.modals = [];
      saveStateToLocalStorage(state.modals);
    },
  },
});

export const { setModals, resetModals } = dashboardModalSlice.actions;
export default dashboardModalSlice.reducer;