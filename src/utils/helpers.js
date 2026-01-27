export const getWeatherDetails = (code) => {
  const map = {
    0: { label: "Ясно небе", icon: "☀️", color: "linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)" },
    1: { label: "Предимно ясно", icon: "🌤️", color: "linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)" },
    2: { label: "Частична облачност", icon: "⛅", color: "linear-gradient(180deg, #89f7fe 0%, #66a6ff 100%)" },
    3: { label: "Облачно", icon: "☁️", color: "linear-gradient(180deg, #606c88 0%, #3f4c6b 100%)" },
    45: { label: "Мъгла", icon: "🌫️", color: "linear-gradient(180deg, #757f9a 0%, #d7dde8 100%)" },
    61: { label: "Слаб дъжд", icon: "🌧️", color: "linear-gradient(180deg, #4b6cb7 0%, #182848 100%)" },
    80: { label: "Дъждовно", icon: "🌦️", color: "linear-gradient(180deg, #2c3e50 0%, #000000 100%)" },
    71: { label: "Слаб сняг", icon: "🌨️", color: "linear-gradient(180deg, #e6e9f0 0%, #eef1f5 100%)" },
    73: { label: "Умерен сняг", icon: "❄️", color: "linear-gradient(180deg, #e6e9f0 0%, #eef1f5 100%)" },
    75: { label: "Силен сняг", icon: "🏔️", color: "linear-gradient(180deg, #83a4d4 0%, #b6fbff 100%)" },
    77: { label: "Снежни зърна", icon: "❄️", color: "linear-gradient(180deg, #83a4d4 0%, #b6fbff 100%)" },
  };
  return map[code] || { 
    label: "Облачно", 
    icon: "☁️", 
    color: "linear-gradient(180deg, #9b67ff 0%, #5d3fd3 100%)" 
  };
};