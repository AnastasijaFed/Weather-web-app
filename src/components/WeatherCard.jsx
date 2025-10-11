import React, { use, useEffect, useState } from 'react';
import useWeatherData from '../hooks/useWeatherData';
import { allIcons } from '../utils/weatherIcons';

const WeatherCard = ({ city }) => {
  const data = useWeatherData(city);
  const [weatherData, setWeatherData] = useState(false);

  useEffect(() => {
    if (data) {
      console.log(data);

      setWeatherData({
        city: data.name,
        temperature: Math.floor(data.main.temp),
        icon: allIcons[data.weather[0].icon],
      });
    }
  }, [data]);

  if (!weatherData) return null;
  return (
    <div className="weather-info">
      <h2
        style={{
          fontSize: '4rem',
          color: 'white',
          whiteSpace: 'nowrap',
          maxWidth: '90vw',
          textAlign: 'center',
        }}
      >
        {weatherData.city}
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          width: '100%',
        }}
      >
        {weatherData.icon && (
          <img
            src={weatherData.icon}
            alt="Weather Icon"
            style={{ width: '100px', height: '100px' }}
          />
        )}
        <p style={{ fontSize: '2.5rem', color: 'white' }}>
          {weatherData.temperature}°C
        </p>
      </div>
    </div>
  );
};

export default WeatherCard;
