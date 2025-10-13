import React, { useEffect, useState } from 'react';
import { Card, Typography } from '@mui/joy';
import './ForecastCard.css';
import { allIcons } from '../utils/weatherIcons';

const ForecastCard = ({ city }) => {
  const [forecastData, setForecastData] = useState([]); // Holds daily forecast summaries

  // Groups forecast list items by date (YYYY-MM-DD)
  function groupByDate(list) {
    if (!list) return {};
    return list.reduce((acc, item) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
  }

  // Summarizes a day's data: min, max, avg temperature and weather icon
  const summariseDay = (dayList) => {
    const temps = dayList.map((item) => item.main.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
    const icon = dayList[0].weather[0].icon; // Take first icon as representative
    return { minTemp, maxTemp, avgTemp, icon };
  };

  // Fetch forecast data for the city and summarize it per day
  const search = async () => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${
        import.meta.env.VITE_APP_ID
      }&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      const grouped = groupByDate(data.list);
      const summaries = Object.keys(grouped).map((date) => ({
        date,
        ...summariseDay(grouped[date]),
        details: grouped[date], // Keep raw data if needed
      }));

      setForecastData(summaries);
      console.log(summaries); // Debugging
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  };

  // Fetch new forecast whenever city changes
  useEffect(() => {
    if (city) search();
  }, [city]);

  return (
    <div className="forecast-container">
      {forecastData &&
        forecastData.slice(1, 5).map((day) => (
          <div key={day.date} className="forecast-day">
            {/* Weekday */}
            <Typography level="body-lg" sx={{ mb: 1, color: '#faf7f7ff' }}>
              {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long' })}
            </Typography>

            {/* Weather icon */}
            <img
              src={allIcons[day.icon]}
              alt="Weather Icon"
              style={{ width: '50px', height: '50px' }}
            />

            {/* Average temperature */}
            <Typography level="body-lg" sx={{ mb: 1, color: '#faf7f7ff' }}>
              {Math.floor(day.avgTemp)}°C
            </Typography>

            {/* Min/Max temperatures */}
            <div
              className="temps"
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '100%',
                gap: '10px',
              }}
            >
              <Typography level="body-md" sx={{ color: 'gray' }}>
                L: {Math.floor(day.minTemp)}°C
              </Typography>
              <Typography level="body-md" sx={{ color: 'gray' }}>
                H: {Math.ceil(day.maxTemp)}°C
              </Typography>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ForecastCard;
