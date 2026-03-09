import { useState, useEffect } from "react";
import { WeatherProvider, useWeather } from "./contexts/WeatherContext";
import { fetchWeather } from "./api/weather";
import SearchBar from "./components/SearchBar";
import WeatherCard, { getWeatherInfo } from "./components/WeatherCard";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return isMobile;
}

function Dashboard() {
  const { coords } = useWeather();
  const [weather, setWeather]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error,   setError]         = useState(null);
  const [contentKey, setContentKey] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    setLoading(true); setError(null);
    fetchWeather(coords.lat, coords.lon)
      .then(d => { setWeather(d); setContentKey(k => k + 1); })
      .catch(() => setError("Failed to load weather data."))
      .finally(() => setLoading(false));
  }, [coords]);

  const info = weather
    ? getWeatherInfo(weather.current.weather_code)
    : { bg: ["#1a1a2e", "#2C3E50", "#0d0d1a"] };
  const [c1, c2, c3] = info.bg;
  const now = new Date();
  const DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dateStr = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()} ${now.getFullYear()}`;

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body, html, #root { height:100%; width:100%; }
        ::placeholder { color: rgba(255,255,255,0.35); }
        ::-webkit-scrollbar { height:4px; width:4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius:2px; }
        @keyframes pulse {
          0%,100% { transform: scale(1) rotate(0deg); }
          50%     { transform: scale(1.08) rotate(4deg); }
        }
        @keyframes bgShift {
          0%,100% { transform: scale(1) translate(0,0); }
          33%     { transform: scale(1.05) translate(1%,1%); }
          66%     { transform: scale(1.03) translate(-1%,0.5%); }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position:-200% center; }
          100% { background-position: 200% center; }
        }
        .hover-row:hover  { background: rgba(255,255,255,0.07) !important; }
        .hover-card:hover { background: rgba(255,255,255,0.1)  !important; transform: translateY(-2px) !important; }
        .hover-sug:hover  { background: rgba(255,255,255,0.07) !important; }
        .loading-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% auto;
          animation: shimmer 1.6s linear infinite;
        }
      `}</style>

      {/* Animated background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: `radial-gradient(ellipse at 15% 25%, ${c1}bb, transparent 50%),
                     radial-gradient(ellipse at 85% 75%, ${c2}77, transparent 50%), ${c3}`,
        transition: "background 1.6s ease",
        animation: "bgShift 12s ease-in-out infinite",
      }} />

      {/* Page */}
      <div style={{
        position: "relative", zIndex: 1,
        minHeight: "100vh", width: "100%",
        fontFamily: "'Outfit', system-ui, sans-serif", color: "white",
        padding: isMobile ? "20px 16px" : "32px 48px",
        display: "flex", flexDirection: "column", gap: isMobile ? 16 : 20,
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600&display=swap" rel="stylesheet" />

        {/* Top bar */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: 14,
        }}>
          {!isMobile && (
            <div>
              <div style={{ fontSize: 12, opacity: 0.4, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Weather Dashboard</div>
              <div style={{ fontSize: 14, opacity: 0.5, marginTop: 2 }}>{dateStr}</div>
            </div>
          )}
          <SearchBar isMobile={isMobile} />
          {isMobile && <div style={{ fontSize: 13, opacity: 0.4 }}>{dateStr}</div>}
        </div>

        {/* Content */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
            {[300, 180, 140].map((h, i) => (
              <div key={i} className="loading-shimmer" style={{ borderRadius: 24, height: h }} />
            ))}
          </div>
        )}
        {error && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#ff6b6b" }}>{error}</div>
        )}
        {!loading && !error && weather && (
          <WeatherCard weather={weather} coords={coords} isMobile={isMobile} contentKey={contentKey} />
        )}
      </div>
    </>
  );
}

export default function App() {
  return <WeatherProvider><Dashboard /></WeatherProvider>;
}