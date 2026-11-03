import { getCache, setCache } from '../utils/cache.js';

const URL = 'https://geocoding-api.open-meteo.com/v1/search';
const TTL = 24 * 60 * 60 * 1000; 

export async function searchCities(name) {
  const key = `geo:${name.toLowerCase()}`;
  const hit = getCache(key, TTL);
  if (hit) return hit;

  const params = new URLSearchParams({ name, count: 6, language: 'es', format: 'json' });
  const response = await fetch(`${URL}?${params}`);
  if (!response.ok) throw new Error(`Error ${response.status}`);

  const data = await response.json();
  const results = (data.results ?? []).map(r => ({
    id: r.id,
    name: r.name,
    region: r.admin1,
    country: r.country,
    lat: r.latitude,
    lon: r.longitude,
  }));

  setCache(key, results);
  return results;
}