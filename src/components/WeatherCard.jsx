import React, { useEffect, useState } from 'react';
import useWeatherData from '../hooks/useWeatherData';
import { allIcons } from '../utils/weatherIcons';
import '../components/WeatherCard.css';

const WeatherCard = ({ city }) => {
  // Fetch weather data using custom hook
  const data = useWeatherData(city);
  const [weatherData, setWeatherData] = useState(false);

  // Update local state when new data is fetched
  useEffect(() => {
    if (data) {
      console.log(data); // For debugging, can be removed in production

      setWeatherData({
        city: data.name,
        temperature: Math.floor(data.main.temp),
        icon: allIcons[data.weather[0].icon],
      });
    }
  }, [data]);

  // Render nothing if data is not yet available
  if (!weatherData) return null;

  return (
    <div className="weather-info">
      {/* City name */}
      <h2
        style={{
          fontSize: '3rem',
          color: 'white',
          maxWidth: '90vw',
          textAlign: 'center',
        }}
      >
        {weatherData.city}
      </h2>

      {/* Weather icon and temperature */}
      <div className="weather-details">
        {weatherData.icon && (
          <img 
            src={weatherData.icon}
            alt="Weather Icon"
            style={{ width: '100px', height: '100px' }}
          />
        )}
        <p style={{ fontSize: '2.5rem', color: 'white', whiteSpace: 'nowrap' }}>
          {weatherData.temperature}°C
        </p>
      </div>
    </div>
  );
};

export default WeatherCard;
