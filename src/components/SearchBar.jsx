import { useState } from 'react';
import { useWeather } from '../contexts/WeatherContext';

export default function SearchBar() {
  const [input, setInput] = useState('');
  const { setCoords } = useWeather();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${input}&count=1&language=en&format=json`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const city = data.results[0];
        setCoords({
          lat: city.latitude,
          lon: city.longitude,
          city: city.name
        });
        setInput('');
      } else {
        alert("Градът не е намерен!");
      }
    } catch (err) {
      console.error("Грешка при търсене:", err);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-container">
      <input
        type="text"
        placeholder="Search city..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">🔍</button>
    </form>
  );
}