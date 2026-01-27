import { useState, useEffect } from 'react';
import { fetchWeather } from './api/weather';
import { useWeather } from './contexts/WeatherContext';
import { getWeatherDetails } from './utils/helpers'; // Внасяме хелпъра
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';

function App() {
  const { coords } = useWeather();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchWeather(coords.lat, coords.lon);
        setData(result);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    loadData();
  }, [coords]);
  const weatherClass = data ? `theme-${data.current.weather_code}` : 'theme-default';

  return (
    <div className={`app-wrapper ${weatherClass}`}>
      <div className="main-content">
        <SearchBar />
        {loading ? <div className="loader">Loading...</div> : 
         data && <WeatherCard data={data} city={coords.city} />}
      </div>
    </div>
  );
}

export default App;