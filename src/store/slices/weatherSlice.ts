import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchCurrentWeather, fetchForecast } from '../thunks';

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  lastUpdated: number;
}

interface ForecastData {
  daily: Array<{
    date: string;
    temperature: number;
    condition: string;
    icon: string;
    minTemp: number;
    maxTemp: number;
  }>;
  hourly: Array<{
    time: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    icon: string;
  }>;
}

interface WeatherState {
  currentWeather: Record<string, WeatherData>;
  forecasts: Record<string, ForecastData>;
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  currentWeather: {},
  forecasts: {},
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setCurrentWeather: (state, action: PayloadAction<{ city: string; data: WeatherData }>) => {
      state.currentWeather[action.payload.city] = action.payload.data;
    },
    setForecast: (state, action: PayloadAction<{ city: string; data: ForecastData }>) => {
      state.forecasts[action.payload.city] = action.payload.data;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather[action.payload.city] = action.payload.data;
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.loading = false;
        state.forecasts[action.payload.city] = action.payload.data;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentWeather, setForecast, setLoading, setError } = weatherSlice.actions;
export default weatherSlice.reducer;