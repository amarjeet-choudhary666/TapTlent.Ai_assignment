import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';
const GEO_URL = 'https://api.weatherapi.com/v1';

// Add logging for debugging
const logRequest = (method: string, url: string) => {
  console.log(`[WeatherAPI] ${method} ${url} at ${new Date().toISOString()}`);
};

interface WeatherResponse {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    humidity: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
  };
}

interface ForecastResponse {
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
      hour: Array<{
        time: string;
        temp_c: number;
        humidity: number;
        wind_kph: number;
        condition: {
          text: string;
          icon: string;
        };
      }>;
    }>;
  };
}

interface GeoResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

class WeatherCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // Increased to 5 minutes

  get(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`[WeatherCache] Cache hit for ${key}`);
      return cached.data;
    }
    if (cached) {
      console.log(`[WeatherCache] Cache expired for ${key}`);
      this.cache.delete(key);
    }
    return null;
  }

  set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
    console.log(`[WeatherCache] Cached data for ${key}`);
  }
}

const cache = new WeatherCache();

export const weatherApi = {
  async getCurrentWeather(city: string): Promise<WeatherResponse> {
    const cacheKey = `current_${city}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${city}`;
    logRequest('GET', url);
    const response = await axios.get<WeatherResponse>(url);

    // Transform icon URL to use HTTPS and ensure proper format
    const transformedData = {
      ...response.data,
      current: {
        ...response.data.current,
        condition: {
          ...response.data.current.condition,
          icon: response.data.current.condition.icon.startsWith('//')
            ? `https:${response.data.current.condition.icon}`
            : response.data.current.condition.icon
        }
      }
    };

    cache.set(cacheKey, transformedData);
    return transformedData;
  },

  async getForecast(city: string): Promise<ForecastResponse> {
    const cacheKey = `forecast_${city}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5`;
    logRequest('GET', url);
    const response = await axios.get<ForecastResponse>(url);

    // Transform icon URLs to use HTTPS and ensure proper format
    const transformedData = {
      ...response.data,
      forecast: {
        ...response.data.forecast,
        forecastday: response.data.forecast.forecastday.map(day => ({
          ...day,
          day: {
            ...day.day,
            condition: {
              ...day.day.condition,
              icon: day.day.condition.icon.startsWith('//')
                ? `https:${day.day.condition.icon}`
                : day.day.condition.icon
            }
          },
          hour: day.hour.map(hour => ({
            ...hour,
            condition: {
              ...hour.condition,
              icon: hour.condition.icon.startsWith('//')
                ? `https:${hour.condition.icon}`
                : hour.condition.icon
            }
          }))
        }))
      }
    };

    cache.set(cacheKey, transformedData);
    return transformedData;
  },

  async searchCities(query: string): Promise<GeoResponse[]> {
    const url = `${GEO_URL}/search.json?key=${API_KEY}&q=${query}`;
    logRequest('GET', url);
    const response = await axios.get<{ location: GeoResponse[] }>(url);
    return response.data.location || [];
  },

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherResponse> {
    const cacheKey = `coords_${lat}_${lon}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}`;
    logRequest('GET', url);
    const response = await axios.get<WeatherResponse>(url);

    // Transform icon URL to use HTTPS and ensure proper format
    const transformedData = {
      ...response.data,
      current: {
        ...response.data.current,
        condition: {
          ...response.data.current.condition,
          icon: response.data.current.condition.icon.startsWith('//')
            ? `https:${response.data.current.condition.icon}`
            : response.data.current.condition.icon
        }
      }
    };

    cache.set(cacheKey, transformedData);
    return transformedData;
  },
};