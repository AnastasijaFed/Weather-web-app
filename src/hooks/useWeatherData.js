import { useState, useEffect } from 'react';

export default function useWeatherData(city) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!city) return;
    const fetchData = async () => {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_APP_ID}&units=metric`);
      const json = await res.json();
      setData(json);
    };
    fetchData();
  }, [city]);

  return data;
}
