import { getCache, setCache } from '../utils/cache.js';

const URL = 'https://api.open-meteo.com/v1/forecast';
const TTL = 10 * 60 * 1000; 

async function fetchFromApi(cities) {
  const params = new URLSearchParams({
    latitude: cities.map(c => c.lat).join(','),
    longitude: cities.map(c => c.lon).join(','),
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    timezone: 'auto',
  });

  const response = await fetch(`${URL}?${params}`);
  if (!response.ok) throw new Error(`Error ${response.status}`);

  const data = await response.json();
  const list = Array.isArray(data) ? data : [data];
  return list.map(d => d.current);
}

export async function fetchWeather(cities) {
  if (cities.length === 0) return [];


  const cached = cities.map(c => getCache(`weather:${c.id}`, TTL));


  const missing = cities.filter((_, i) => !cached[i]);
  let fresh = [];
  if (missing.length > 0) {
    fresh = await fetchFromApi(missing);
    missing.forEach((c, i) => setCache(`weather:${c.id}`, fresh[i]));
  }


  let j = 0;
  return cached.map(w => w ?? fresh[j++]);
}