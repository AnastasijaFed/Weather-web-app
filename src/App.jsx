import { useEffect, useState, useRef } from 'react';
import './App.css';
import CLOUDS from 'vanta/src/vanta.clouds';
import Aurora from './components/Aurora';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';
import DetailsCard from './components/DetailsCard';

// API configuration for OpenWeatherMap (used in components/hooks)
const api = {
  key: 'd05c9bd2aa9a43b2a03d2d62bbe7483c',
  base: 'https://api.openweathermap.org/data/2.5/',
};

function App() {
  const [city, setCity] = useState('Vilnius'); // Currently selected city
  const detailsRef = useRef(null); // Ref for details container to control scroll

  // Scroll details section to bottom whenever the city changes
  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.scrollTop = detailsRef.current.scrollHeight;
    }
  }, [city]);

  return (
    <div className="App">
      {/* Aurora background effect */}
      <div className="aurora-bg">
        <Aurora
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
          }}
          colorStops={['#3A29FF', '#FF94B4', '#FF3232']} 
          blend={0.5} 
          amplitude={1.0} 
          speed={0.5} 
        />
      </div>

      <div className="content">
        {/* Top navigation bar with search */}
        <div className="nav-bar">
          <SearchBar onSearch={setCity} />
        </div>

        {/* Main container: weather card + details/forecast */}
        <div className="main-container">
          <div className="weather-card">
            <WeatherCard city={city} />
          </div>
          <div className="details" ref={detailsRef}>
            <DetailsCard city={city} />
            <ForecastCard city={city} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
