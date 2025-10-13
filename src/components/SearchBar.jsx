import React, { useEffect, useState, useMemo, useRef} from 'react';
import debounce from 'lodash.debounce';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const suggestionsRef = useRef(null);


  const fetchCities = async (value) => {
    try {
      const response = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${value}&limit=5`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
            'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
          },
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      console.log(data);
      setSuggestions(data.data);
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
  };


  const debouncedFetch = useMemo(() => debounce(fetchCities, 500), []);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    if (value.length > 2) debouncedFetch(value);
    else setSuggestions([]);
  };

  const handleSelect = (cityName) => {
    onSearch(cityName);
    setInput(cityName);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setSuggestions([]);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setSuggestions([]); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (

    <div className="nav-bar">
  <div className="search-and-suggestions-wrapper">
    <form className="search-bar" onSubmit={handleSubmit}>
     
      <div className="input-container"> 
        <input
          type="text"
          placeholder="Enter city"
          value={input}
          onChange={handleChange}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list" ref={suggestionsRef}>
            {suggestions.map((city) => (
              <li
                key={city.id}
                onClick={() => handleSelect(`${city.name}, ${city.countryCode}`)}
              >
                {city.name}, {city.countryCode}
              </li>
            ))}
          </ul>
        )}
      </div> 
      
      <button type="submit"><i class="bi bi-search"></i></button>
    </form>
  </div>
</div>
    
  );
};

export default SearchBar;
