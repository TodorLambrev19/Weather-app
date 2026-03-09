import { useState, useCallback } from "react";
import { useWeather } from "../contexts/WeatherContext";
import { searchCity } from "../api/weather";

export default function SearchBar({ isMobile }) {
  const { setCoords } = useWeather();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [focused, setFocused] = useState(false);

  const handleSearch = useCallback(async (val) => {
    setQuery(val);
    if (val.length < 2) { setSuggestions([]); return; }
    try {
      const results = await searchCity(val);
      setSuggestions(results.slice(0, 6));
    } catch { setSuggestions([]); }
  }, []);

  const selectCity = (city) => {
    setCoords({ lat: city.latitude, lon: city.longitude, city: city.name, country: city.country_code });
    setQuery(""); setSuggestions([]); setFocused(false);
  };

  return (
    <div style={{ position: "relative", width: isMobile ? "100%" : 300 }}>
      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: 0.4, pointerEvents: "none" }}>🔍</span>
      <input
        style={{
          width: "100%",
          padding: isMobile ? "13px 16px 13px 42px" : "11px 16px 11px 40px",
          background: focused ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)",
          border: `1px solid ${focused ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)"}`,
          borderRadius: 14, color: "white",
          fontSize: isMobile ? 15 : 14,
          outline: "none", fontFamily: "inherit", transition: "all 0.25s",
        }}
        placeholder="Search city..."
        value={query}
        onChange={e => handleSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => { setFocused(false); setSuggestions([]); }, 200)}
      />
      {suggestions.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
          background: "rgba(15,20,35,0.97)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16,
          overflow: "hidden", zIndex: 100, boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}>
          {suggestions.map((s, i) => (
            <div key={i} className="hover-sug" onMouseDown={() => selectCity(s)} style={{
              padding: "11px 16px", cursor: "pointer",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", gap: 10,
              fontSize: 14, transition: "background 0.15s",
            }}>
              <span style={{ opacity: 0.4 }}>📍</span>
              <span>{s.name}</span>
              <span style={{ opacity: 0.35, fontSize: 12, marginLeft: "auto" }}>
                {s.admin1 ? `${s.admin1}, ` : ""}{s.country_code}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}