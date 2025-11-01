import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchForecast } from '../store/thunks';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X } from 'lucide-react';

interface DetailedViewProps {
  city: string;
  onClose: () => void;
}

const DetailedView: React.FC<DetailedViewProps> = ({ city, onClose }) => {
  const dispatch = useAppDispatch();
  const { forecasts, currentWeather, loading } = useAppSelector((s) => s.weather);
  const temperatureUnit = useAppSelector((s) => s.settings.temperatureUnit);

  useEffect(() => {
    if (!forecasts[city]) dispatch(fetchForecast(city));
  }, [city, dispatch, forecasts]);

  const forecast = forecasts[city];
  const current = currentWeather[city];

  // Add safety checks for data
  if (!forecast && !loading) {
    console.warn(`No forecast data available for ${city}`);
  }
  if (!current && !loading) {
    console.warn(`No current weather data available for ${city}`);
  }

  const convertTemperature = (t: number) =>
    temperatureUnit === 'fahrenheit' ? (t * 9) / 5 + 32 : t;

  const processForecastData = () => {
    if (!forecast || !forecast.daily || !forecast.hourly)
      return { daily: [], hourly: [] };

    const daily = forecast.daily.map((d: any) => ({
      date: new Date(d.date).toLocaleDateString(),
      min: d.minTemp || 0,
      max: d.maxTemp || 0,
      avg: d.temperature || 0,
    }));

    const hourly = forecast.hourly.map((h: any) => ({
      time: h.time || '',
      temperature: convertTemperature(h.temperature || 0),
      humidity: h.humidity || 0,
      windSpeed: h.windSpeed || 0,
    }));

    return { daily, hourly };
  };

  const { daily, hourly } = processForecastData();


  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Early return for loading state to avoid hooks issues
  if (loading && !forecast) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-md p-6">
          <div className="flex items-center">
            <div className="spinner mr-4"></div>
            <span>Loading detailed weather data…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    // Fullscreen overlay wrapper — guarantees edge-to-edge width
    <div
      className="fixed inset-0 z-[1000] bg-black/40"
      onClick={onClose}
    >
      {/* Use the entire viewport for the modal content */}
      <div
        className="fixed inset-0 w-screen h-screen overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar (sticky) */}
        <div className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-white/90 backdrop-blur-sm border-b shadow-sm">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              {city} — Detailed Weather Dashboard
            </h2>
            <p className="text-sm text-slate-600">
              Fullscreen view — press Esc or click outside to exit
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              aria-label="Close detailed view"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 hover:bg-red-100 transition-all duration-200 shadow-sm hover:shadow-md border border-red-200"
              title="Close (Esc)"
            >
              <X size={24} className="text-red-600" />
            </button>
          </div>
        </div>

        {/* Scrollable content area that fills the rest of the screen */}
        <div className="absolute top-[72px] bottom-0 left-0 right-0 overflow-y-auto px-6 py-6 bg-white">
          {/* Current stats row — use full width */}
          {current && (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-extrabold text-sky-700">
                    {Math.round(convertTemperature(current.temperature))}°
                    {temperatureUnit === 'celsius' ? 'C' : 'F'}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Temperature</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-700">
                    {current.humidity}%
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Humidity</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-700">
                    {current.windSpeed} m/s
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Wind Speed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-700 capitalize">
                    {current.condition}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Condition</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Large charts — use full container width */}
          <div className="space-y-8">
            {/* 5-day trend */}
            <section className="w-full">
              <Card>
                <CardHeader>
                  <CardTitle>5-Day Temperature Trend</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div style={{ width: '100%', height: 420, minWidth: 400, position: 'relative' }}>
                    {daily.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={daily}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="max"
                            stroke="#ef4444"
                            strokeWidth={2}
                            name="Max Temp"
                          />
                          <Line
                            type="monotone"
                            dataKey="min"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Min Temp"
                          />
                          <Line
                            type="monotone"
                            dataKey="avg"
                            stroke="#10b981"
                            strokeWidth={2}
                            name="Avg Temp"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-500">
                        No temperature data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 24-hour and smaller charts side-by-side */}
            <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>24-Hour Forecast</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div style={{ width: '100%', height: 360, minWidth: 400, position: 'relative' }}>
                    {hourly.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={hourly}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            dataKey="temperature"
                            fill="#3b82f6"
                            radius={[6, 6, 0, 0]}
                            name={`Temperature (°${temperatureUnit === 'celsius' ? 'C' : 'F'})`}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-500">
                        No hourly data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Hourly Temperature</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div style={{ width: '100%', height: 200, minWidth: 300, position: 'relative' }}>
                      {hourly.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={hourly}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="temperature"
                              stroke="#ef4444"
                              strokeWidth={2}
                              dot={{ r: 2 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                          No data available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Wind Speed Trend</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div style={{ width: '100%', height: 200, minWidth: 300, position: 'relative' }}>
                      {hourly.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={hourly}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="windSpeed"
                              stroke="#10b981"
                              strokeWidth={2}
                              dot={{ r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                          No data available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Additional charts row */}
            <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Humidity Levels</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div style={{ width: '100%', height: 300, minWidth: 400, position: 'relative' }}>
                    {hourly.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={hourly}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            dataKey="humidity"
                            fill="#06b6d4"
                            name="Humidity (%)"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-500">
                        No humidity data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weather Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Average Temperature:</span>
                      <span>
                        {daily.length > 0 
                          ? Math.round(daily.reduce((sum, day) => sum + day.avg, 0) / daily.length) 
                          : 0}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Average Humidity:</span>
                      <span>
                        {hourly.length > 0 
                          ? Math.round(hourly.reduce((sum, hour) => sum + hour.humidity, 0) / hourly.length) 
                          : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Average Wind Speed:</span>
                      <span>
                        {hourly.length > 0 
                          ? Math.round(hourly.reduce((sum, hour) => sum + hour.windSpeed, 0) / hourly.length) 
                          : 0} m/s
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Forecast Days:</span>
                      <span>{daily.length} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* bottom padding so content isn't flush with bottom */}
          <div className="h-20" />
        </div>
      </div>
    </div>
  );
};

export default DetailedView;
