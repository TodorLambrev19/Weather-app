import { getWeatherDetails } from '../utils/helpers';

const WeatherCard = ({ data, city }) => {
  if (!data || !data.current) return null;

  const { current, daily, hourly } = data;
  const currentInfo = getWeatherDetails(current.weather_code);

  return (
    <div className="weather-dashboard">
      <section className="card-left">
        <h1 className="city-title">{city}</h1>
        
        <div className="temp-wrapper">
          <img 
            src="/cloudeoverall.png" 
            alt="weather-icon" 
            className="floating-icon-dashboard" 
          />
          <div className="big-temp">{Math.round(current.temperature_2m)}°</div>
        </div>

        <p className="weather-desc">{currentInfo.label}</p>
        <div className="extra-info">
          <span>Влажност: {current.relative_humidity_2m}%</span>
        </div>
      </section>
      <section className="card-middle">
        <h3>Почасова прогноза</h3>
        <div className="hourly-grid">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const info = getWeatherDetails(hourly.weather_code[i]);
            const hour = (new Date().getHours() + i) % 24;
            return (
              <div key={i} className="hour-card">
                <span className="hour-time">{i === 0 ? 'Сега' : `${hour}:00`}</span>
                <span className="icon">{info.icon}</span>
                <span className="temp">{Math.round(hourly.temperature_2m[i])}°</span>
              </div>
            );
          })}
        </div>
      </section>
      <section className="card-right">
        <h3>Прогноза за седмицата</h3>
        <div className="daily-rows">
          {daily.time.slice(1, 6).map((date, i) => {
            const info = getWeatherDetails(daily.weather_code[i + 1]);
            const dayName = new Date(date).toLocaleDateString('bg-BG', { weekday: 'short' });
            
            return (
              <div key={date} className="day-line">
                <span className="day-name">{dayName}</span>
                <span className="day-icon">{info.icon}</span>
                
                <div className="day-temps">
                  <span className="min-t">
                    {Math.round(daily.temperature_2m_min[i + 1])}°
                  </span>
                  <span className="temp-divider">/</span>
                  <span className="max-t">
                    {Math.round(daily.temperature_2m_max[i + 1])}°
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default WeatherCard;