import React, { use, useEffect, useState } from 'react';
import { Card, Typography } from '@mui/joy';
import './ForecastCard.css';
import { allIcons } from '../utils/weatherIcons';

const ForecastCard = ({ city }) => {
  const [forecastData, setForecastData] = useState([]);
  function groupByDate(list) {
    if (!list) return {};
    return list.reduce((acc, item) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
  }

  const summariseDay = (dayList) => {
    const temps = dayList.map((item) => item.main.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(
      1
    );

    const icon = dayList[0].weather[0].icon;

    return { minTemp, maxTemp, avgTemp, icon };
  };

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
        details: grouped[date],
      }));

      setForecastData(summaries);
      console.log(summaries);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  };
  useEffect(() => {
    if (city) search();
  }, [city]);

  return (
    <div className="forecast-container">
      {forecastData &&
        forecastData.slice(1, 5).map((day) => (
          <div key={day.date} className="forecast-day">
            <Typography level="body-lg" sx={{ mb: 1, color: '#faf7f7ff' }}>
              {new Date(day.date).toLocaleDateString(undefined, {
                weekday: 'long',
              })}
            </Typography>
            <img
              src={allIcons[day.icon]}
              alt="Weather Icon"
              style={{ width: '50px', height: '50px' }}
            />
            <Typography level="body-lg" sx={{ mb: 1, color: '#faf7f7ff' }}>
              {Math.floor(day.avgTemp)}°C
            </Typography>
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
