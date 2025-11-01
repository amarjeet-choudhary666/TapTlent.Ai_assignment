import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  temperatureUnit: 'celsius' | 'fahrenheit';
}

const initialState: SettingsState = {
  temperatureUnit: (localStorage.getItem('temperatureUnit') as 'celsius' | 'fahrenheit') || 'celsius',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTemperatureUnit: (state, action: PayloadAction<'celsius' | 'fahrenheit'>) => {
      state.temperatureUnit = action.payload;
      localStorage.setItem('temperatureUnit', action.payload);
    },
  },
});

export const { setTemperatureUnit } = settingsSlice.actions;
export default settingsSlice.reducer;