import { createContext, useContext, useState } from "react";

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [coords, setCoords] = useState({
    lat: 42.6977, lon: 23.3219, city: "Sofia", country: "BG"
  });
  return (
    <WeatherContext.Provider value={{ coords, setCoords }}>
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => useContext(WeatherContext);