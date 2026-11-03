const KEY = 'weather-cities';

let cities = JSON.parse(localStorage.getItem(KEY) ?? '[]');

const save = () => localStorage.setItem(KEY, JSON.stringify(cities));

export const getCities = () => cities;

export function addCity(city) {
  if (cities.some(c => c.id === city.id)) return false;   // evita duplicados
  cities = [...cities, city];
  save();
  return true;
}

export function removeCity(id) {
  cities = cities.filter(c => c.id !== id);
  save();
}