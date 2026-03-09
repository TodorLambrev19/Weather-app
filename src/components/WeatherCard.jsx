import { useState, useEffect } from "react";

const WMO_CODES = {
  0:  { label: "Clear Sky",          icon: "☀️",  bg: ["#FF6B35","#F7C59F","#1a1a2e"] },
  1:  { label: "Mainly Clear",       icon: "🌤️",  bg: ["#FF6B35","#F7C59F","#1a1a2e"] },
  2:  { label: "Partly Cloudy",      icon: "⛅",   bg: ["#4A90D9","#7FB3D3","#0d1b2a"] },
  3:  { label: "Overcast",           icon: "☁️",  bg: ["#6B7C93","#A8B4C0","#0d1b2a"] },
  45: { label: "Foggy",              icon: "🌫️",  bg: ["#8E9EAB","#B0BEC5","#1a1a2e"] },
  48: { label: "Icy Fog",            icon: "🌫️",  bg: ["#8E9EAB","#B0BEC5","#1a1a2e"] },
  51: { label: "Light Drizzle",      icon: "🌦️",  bg: ["#2C5F8A","#4A90D9","#0a0e1a"] },
  53: { label: "Drizzle",            icon: "🌦️",  bg: ["#2C5F8A","#4A90D9","#0a0e1a"] },
  55: { label: "Heavy Drizzle",      icon: "🌧️",  bg: ["#1a3a5c","#2C5F8A","#0a0e1a"] },
  61: { label: "Light Rain",         icon: "🌧️",  bg: ["#1a3a5c","#2C5F8A","#0a0e1a"] },
  63: { label: "Rain",               icon: "🌧️",  bg: ["#1a3a5c","#2C5F8A","#0a0e1a"] },
  65: { label: "Heavy Rain",         icon: "⛈️",  bg: ["#0d1b2a","#1a3a5c","#050a0f"] },
  71: { label: "Light Snow",         icon: "🌨️",  bg: ["#5B6E8C","#8FA3B1","#1a1f2e"] },
  73: { label: "Snow",               icon: "❄️",  bg: ["#4A5C6A","#7A8FA0","#1a1f2e"] },
  75: { label: "Heavy Snow",         icon: "🌨️",  bg: ["#3A4A55","#5C6E7A","#0f1520"] },
  80: { label: "Rain Showers",       icon: "🌦️",  bg: ["#1a3a5c","#2C5F8A","#0a0e1a"] },
  95: { label: "Thunderstorm",       icon: "⛈️",  bg: ["#0d1b2a","#1a0a2e","#050508"] },
  99: { label: "Heavy Thunderstorm", icon: "⛈️",  bg: ["#050508","#0d0a1a","#020205"] },
};

export const getWeatherInfo = (code) =>
  WMO_CODES[code] || { label: "Unknown", icon: "🌡️", bg: ["#2C3E50","#4A5568","#1a1a2e"] };

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function AnimCounter({ target, duration = 800, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const to = Math.round(target);
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * ease));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <>{val}{suffix}</>;
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(18px)",
      transition: "opacity 0.55s ease, transform 0.55s ease",
      ...style,
    }}>
      {children}
    </div>
  );
}

function RainBar({ value, max }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(max > 0 ? Math.min((value / max) * 100, 100) : 0), 200);
    return () => clearTimeout(t);
  }, [value, max]);
  return (
    <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, margin: "0 12px" }}>
      <div style={{ width: `${width}%`, height: "100%", background: "rgba(120,190,255,0.6)", borderRadius: 2, transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)" }} />
    </div>
  );
}

function StatCard({ icon, label, value, sub, delay = 0 }) {
  const [hover, setHover] = useState(false);
  return (
    <FadeIn delay={delay} style={{ flex: 1 }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: hover ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${hover ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.09)"}`,
          borderRadius: 20, padding: "18px 20px",
          display: "flex", flexDirection: "column", gap: 5,
          transform: hover ? "translateY(-3px)" : "translateY(0)",
          transition: "all 0.25s ease", cursor: "default", height: "100%",
        }}
      >
        <div style={{ fontSize: 20 }}>{icon}</div>
        <div style={{ fontSize: 10, opacity: 0.4, letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 500 }}>{value}</div>
        {sub && <div style={{ fontSize: 11, opacity: 0.35 }}>{sub}</div>}
      </div>
    </FadeIn>
  );
}

export default function WeatherCard({ weather, coords, isMobile, contentKey }) {
  const [activeDay, setActiveDay] = useState(0);
  const info = getWeatherInfo(weather.current.weather_code);
  const [c1] = info.bg;
  const now = new Date();

  const hourlySlice = (() => {
    const h = now.getHours();
    const count = isMobile ? 8 : 12;
    return Array.from({ length: count }, (_, i) => {
      const idx = h + i;
      return {
        temp: weather.hourly.temperature_2m[idx] ?? 0,
        code: weather.hourly.weather_code[idx] ?? 0,
        label: i === 0 ? "Now" : `${(idx % 24).toString().padStart(2, "0")}:00`,
      };
    });
  })();

  const maxRain = Math.max(...weather.daily.precipitation_sum, 0.1);
  const glass = {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
    border: "1px solid rgba(255,255,255,0.1)",
  };
  const sectionLabel = { fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", opacity: 0.4, textTransform: "uppercase", marginBottom: 14 };

  return (
    <div key={contentKey} style={{ display: "flex", flexDirection: "column", gap: isMobile ? 16 : 20 }}>

      {/* Hero row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.9fr", gap: isMobile ? 16 : 20 }}>
        <FadeIn delay={100}>
          <div style={{ ...glass, borderRadius: 28, padding: isMobile ? "28px 24px" : "40px 36px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: isMobile ? "auto" : 300, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: `radial-gradient(circle, ${c1}55, transparent 70%)`, pointerEvents: "none", transition: "background 1.4s ease" }} />
            <div>
              <div style={{ fontSize: isMobile ? 26 : 30, fontWeight: 600, letterSpacing: "-0.5px" }}>{coords.city}</div>
              <div style={{ fontSize: 13, opacity: 0.4, marginTop: 3 }}>{coords.country}</div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, margin: isMobile ? "16px 0 12px" : "20px 0 16px" }}>
              <div style={{ fontSize: isMobile ? 90 : 110, fontWeight: 200, lineHeight: 1, letterSpacing: "-5px" }}>
                <AnimCounter target={weather.current.temperature_2m} suffix="°" />
              </div>
              <div style={{ paddingBottom: isMobile ? 10 : 14, fontSize: isMobile ? 56 : 64, lineHeight: 1, animation: "pulse 3s ease-in-out infinite", display: "inline-block" }}>
                {info.icon}
              </div>
            </div>
            <div>
              <div style={{ fontSize: isMobile ? 17 : 19, fontWeight: 300, opacity: 0.8 }}>{info.label}</div>
              <div style={{ fontSize: 13, opacity: 0.4, marginTop: 4 }}>
                Feels {Math.round(weather.current.apparent_temperature)}° · H:{Math.round(weather.daily.temperature_2m_max[0])}° L:{Math.round(weather.daily.temperature_2m_min[0])}°
              </div>
            </div>
          </div>
        </FadeIn>

        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 12 : 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 10 : 14 }}>
            <StatCard icon="💧" label="Humidity"  value={`${weather.current.relative_humidity_2m}%`}           sub="Relative humidity" delay={150} />
            <StatCard icon="💨" label="Wind"      value={`${Math.round(weather.current.wind_speed_10m)} km/h`}  sub="Surface wind"      delay={200} />
            <StatCard icon="🌡️" label="Pressure"  value={`${Math.round(weather.current.surface_pressure)} hPa`} sub="Surface pressure"  delay={250} />
            <StatCard icon="🌧️" label="Precip."   value={`${weather.current.precipitation} mm`}                 sub="Current"           delay={300} />
          </div>
          <FadeIn delay={350} style={{ flex: 1 }}>
            <div style={{ ...glass, borderRadius: 20, padding: isMobile ? "16px 20px" : "20px 28px", display: "flex", alignItems: "center", gap: isMobile ? 16 : 32, height: "100%" }}>
              <div>
                <div style={{ fontSize: 10, opacity: 0.4, letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Sunrise</div>
                <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 300 }}>🌅 {weather.daily.sunrise[0].split("T")[1]}</div>
              </div>
              <div style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 1, position: "relative" }}>
                <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: `${Math.min(Math.max(((now.getHours() - 6) / 12) * 100, 0), 100)}%`, fontSize: 16, lineHeight: 1, marginLeft: -8, animation: "pulse 3s ease-in-out infinite" }}>☀️</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, opacity: 0.4, letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Sunset</div>
                <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 300 }}>{weather.daily.sunset[0].split("T")[1]} 🌇</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Hourly */}
      <FadeIn delay={400}>
        <div style={{ ...glass, borderRadius: 24, padding: isMobile ? "20px" : "22px 28px" }}>
          <div style={sectionLabel}>Hourly Forecast</div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
            {hourlySlice.map((h, i) => (
              <div key={i} className="hover-card" style={{
                flexShrink: 0, background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18,
                padding: isMobile ? "14px 16px" : "16px 18px",
                textAlign: "center", minWidth: isMobile ? 68 : 78,
                display: "flex", flexDirection: "column", gap: 7, alignItems: "center",
                transition: "all 0.2s ease", cursor: "default",
                animation: "fadeSlideUp 0.4s ease both",
                animationDelay: `${i * 40}ms`,
              }}>
                <span style={{ fontSize: 11, opacity: 0.5 }}>{h.label}</span>
                <span style={{ fontSize: isMobile ? 24 : 28 }}>{getWeatherInfo(h.code).icon}</span>
                <span style={{ fontSize: isMobile ? 14 : 16, fontWeight: 500 }}>{Math.round(h.temp)}°</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* 7-day */}
      <FadeIn delay={500}>
        <div style={{ ...glass, borderRadius: 24, padding: isMobile ? "20px 16px" : "22px 28px" }}>
          <div style={sectionLabel}>7-Day Forecast</div>
          {weather.daily.time.map((d, i) => {
            const date = new Date(d);
            const dayInfo = getWeatherInfo(weather.daily.weather_code[i]);
            const rain = weather.daily.precipitation_sum[i];
            return (
              <div key={i} className="hover-row" onClick={() => setActiveDay(i)} style={{
                display: "flex", alignItems: "center", gap: isMobile ? 10 : 16,
                padding: isMobile ? "10px 10px" : "11px 14px", borderRadius: 14, cursor: "pointer",
                background: activeDay === i ? "rgba(255,255,255,0.09)" : "transparent",
                transition: "background 0.2s ease",
                animation: "fadeSlideUp 0.4s ease both",
                animationDelay: `${500 + i * 50}ms`,
              }}>
                <span style={{ fontSize: isMobile ? 13 : 15, fontWeight: 500, width: isMobile ? 72 : 100, opacity: 0.8, flexShrink: 0 }}>
                  {i === 0 ? "Today" : i === 1 ? "Tomorrow" : DAYS[date.getDay()]}
                </span>
                <span style={{ fontSize: isMobile ? 20 : 22, width: 28, flexShrink: 0 }}>{dayInfo.icon}</span>
                {!isMobile && <span style={{ fontSize: 13, opacity: 0.45, width: 120, flexShrink: 0 }}>{dayInfo.label}</span>}
                <RainBar value={rain} max={maxRain} />
                <span style={{ fontSize: 11, opacity: 0.3, width: isMobile ? 44 : 60, flexShrink: 0, textAlign: "right" }}>
                  {rain > 0.1 ? `${rain.toFixed(1)}mm` : "—"}
                </span>
                <div style={{ display: "flex", gap: isMobile ? 8 : 14, fontSize: isMobile ? 13 : 15, fontWeight: 500, flexShrink: 0 }}>
                  <span>{Math.round(weather.daily.temperature_2m_max[i])}°</span>
                  <span style={{ opacity: 0.35 }}>{Math.round(weather.daily.temperature_2m_min[i])}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </FadeIn>

      <FadeIn delay={600}>
        <div style={{ textAlign: "center", opacity: 0.2, fontSize: 11, letterSpacing: "0.05em", paddingBottom: 8 }}>
          Data · Open-Meteo · Updated just now
        </div>
      </FadeIn>
    </div>
  );
}