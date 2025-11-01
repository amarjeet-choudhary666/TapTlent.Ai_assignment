import { createAsyncThunk } from '@reduxjs/toolkit';
import { weatherApi } from '../services/weatherApi';

// Track active requests to prevent duplicates
const activeRequests = new Map<string, AbortController>();

export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrentWeather',
  async (city: string, { rejectWithValue }) => {
    const requestKey = `current_${city}`;

    console.log(`[WeatherThunk] Starting fetch for city: ${city}`);

    // Cancel any existing request for this city
    if (activeRequests.has(requestKey)) {
      activeRequests.get(requestKey)?.abort();
    }

    const controller = new AbortController();
    activeRequests.set(requestKey, controller);

    try {
      console.log(`[WeatherThunk] Calling weatherApi.getCurrentWeather for ${city}`);
      const data = await weatherApi.getCurrentWeather(city);
      console.log(`[WeatherThunk] Received data for ${city}:`, data);
      activeRequests.delete(requestKey);
      const result = {
        city,
        data: {
          city: data.location.name,
          temperature: data.current.temp_c,
          condition: data.current.condition.text,
          humidity: data.current.humidity,
          windSpeed: data.current.wind_kph,
          icon: data.current.condition.icon,
          lastUpdated: Date.now(),
        },
      };
      console.log(`[WeatherThunk] Processed result for ${city}:`, result);
      return result;
    } catch (error: any) {
      console.error(`[WeatherThunk] Error fetching weather for ${city}:`, error);
      activeRequests.delete(requestKey);
      if (error.name === 'AbortError') {
        return rejectWithValue('Request cancelled');
      }
      return rejectWithValue(error.message);
    }
  }
);

export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async (city: string, { rejectWithValue }) => {
    const requestKey = `forecast_${city}`;

    // Cancel any existing request for this city
    if (activeRequests.has(requestKey)) {
      activeRequests.get(requestKey)?.abort();
    }

    const controller = new AbortController();
    activeRequests.set(requestKey, controller);

    try {
      const data = await weatherApi.getForecast(city);
      activeRequests.delete(requestKey);

      // Process daily forecast
      const dailyForecast = data.forecast.forecastday.map((day) => ({
        date: day.date,
        temperature: day.day.avgtemp_c,
        condition: day.day.condition.text,
        icon: day.day.condition.icon,
        minTemp: day.day.mintemp_c,
        maxTemp: day.day.maxtemp_c,
      }));

      // Process hourly forecast (first 24 hours)
      const hourlyForecast = data.forecast.forecastday[0].hour.slice(0, 24).map((hour) => ({
        time: new Date(hour.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temperature: hour.temp_c,
        humidity: hour.humidity,
        windSpeed: hour.wind_kph,
        condition: hour.condition.text,
        icon: hour.condition.icon,
      }));

      return { city, data: { daily: dailyForecast, hourly: hourlyForecast } };
    } catch (error: any) {
      activeRequests.delete(requestKey);
      if (error.name === 'AbortError') {
        return rejectWithValue('Request cancelled');
      }
      return rejectWithValue(error.message);
    }
  }
);

export const searchCities = createAsyncThunk(
  'weather/searchCities',
  async (query: string, { rejectWithValue }) => {
    try {
      const data = await weatherApi.searchCities(query);
      return data.map((city) => city.name);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);