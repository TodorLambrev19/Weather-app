const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export const fetchWeather = async (lat, lon) => {
  const url = `${BASE_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Грешка при мрежата');
  return await response.json();
};