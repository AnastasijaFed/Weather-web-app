import React from 'react';
import './DetailsCard.css';
import { allIcons } from '../utils/weatherIcons';

const DetailsCard = ({ city }) => {
  const [forecastData, setForecastData] = React.useState([]); // Holds hourly forecast data
  const [weatherData, setWeatherData] = React.useState(null); // Holds current weather details

  // Fetch current weather and short-term forecast whenever the city changes
  React.useEffect(() => {
    if (!city) return;

    const getData = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${
            import.meta.env.VITE_APP_ID
          }&units=metric`
        );
        const json = await res.json();

        if (
          json.cod === '200' &&
          Array.isArray(json.list) &&
          json.list.length > 0
        ) {
          const data = json.list.slice(0, 8); // Take first 8 entries (~24h)
          setForecastData(data);

          const current = data[0];
          if (current && current.weather && current.weather[0]) {
            setWeatherData({
              condition: current.weather[0].description,
              tempMin: current.main.temp_min,
              tempMax: current.main.temp_max,
              feelsLike: current.main.feels_like,
              humidity: current.main.humidity,
              windSpeed: current.wind.speed,
              icon: allIcons[current.weather[0].icon],
              coord: json.city.coord, // For map display
            });
          }
        } else {
          console.error('API error or empty list:', json);
          setForecastData([]);
          setWeatherData(null);
        }
      } catch (err) {
        console.error('Error fetching forecast:', err);
      }
    };

    getData();
  }, [city]);

  return (
    <div className="details-forecast">
      <div className="detailed-weather">
        <div className="left-column">
          {weatherData ? (
            <>
              {/* Weather condition and feels like */}
              <p className="condition" style={{ color: 'gray', fontWeight: 100 }}>
                {weatherData.condition}
              </p>
              <p style={{ fontSize: '1.25rem' }}>
                Feels like: {Math.round(weatherData.feelsLike)}°C
              </p>

              {/* High/Low temperature */}
              <div className="temp-range">
                <p style={{ color: '#bbbbbb', fontSize: '1rem' }}>
                  H: {Math.round(weatherData.tempMax)}°C <i className="bi bi-thermometer-high"></i>
                </p>
                <p style={{ color: '#bbbbbb', fontSize: '1rem' }}>
                  L: {Math.round(weatherData.tempMin)}°C <i className="bi bi-thermometer-low"></i>
                </p>
              </div>

              {/* Humidity and wind speed */}
              <div className="additional-info">
                <p>Humidity: {weatherData.humidity}%</p>
                <p>Wind: {weatherData.windSpeed} m/s</p>
              </div>
            </>
          ) : (
            <p className="loading">Loading current weather...</p>
          )}
        </div>

        {/* Map showing city location */}
        <div className="right-column">
          {weatherData && weatherData.coord ? (
            <iframe
              title="City Map"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: '15px' }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/view?key=${
                import.meta.env.VITE_MAPS_KEY
              }&center=${weatherData.coord.lat},${weatherData.coord.lon}&zoom=10`}
            ></iframe>
          ) : (
            <p style={{ color: 'white' }}>Loading map...</p>
          )}
        </div>
      </div>

      {/* Timeline showing hourly forecast */}
      <div className="timeline">
        {forecastData.length > 0 ? (
          forecastData.map((item) => {
            const time = new Date(item.dt * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              hour12: false,
            });
            const temp = Math.round(item.main.temp);
            const icon = allIcons[item.weather[0].icon];

            return (
              <div key={item.dt} className="timeline-item">
                <p className="time">{time}h</p>
                <img src={icon} alt="icon" className="icon" />
                <p className="temp">{temp}°C</p>
              </div>
            );
          })
        ) : (
          <p className="loading">No data available</p>
        )}
      </div>
    </div>
  );
};

export default DetailsCard;
