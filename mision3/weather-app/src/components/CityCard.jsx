import { describeWeather } from '../utils/weatherCodes.js';

const tempClass = (t) =>
  t < 10 ? 'cold' : t < 22 ? 'mild' : t < 30 ? 'warm' : 'hot';

export const formatTemp = (celsius, unit) =>
  unit === 'F' ? Math.round(celsius * 9 / 5 + 32) : Math.round(celsius);

export default function CityCard({ city, unit, onRemove }) {
  const { text, icon } = describeWeather(city.weather_code);

  return (
    <article className={`card ${tempClass(city.temperature_2m)}`}>
      <button className="remove" aria-label="Quitar" onClick={() => onRemove(city.id)}>
        ✕
      </button>
      <h2>{city.name}</h2>
      <p className="country">{city.country}</p>
      <p className="icon">{icon}</p>
      <p className="temp">{formatTemp(city.temperature_2m, unit)}°{unit}</p>
      <p>{text}</p>
      <p>💧 {city.relative_humidity_2m}% · 💨 {city.wind_speed_10m} km/h</p>
    </article>
  );
}