import './styles/main.css';
import { getCities, addCity, removeCity } from './state.js';
import { fetchWeather } from './api/weather.js';
import { mergeData } from './utils/stats.js';
import { setupSearch } from './ui/searchBar.js';
import { renderCards } from './ui/renderCards.js';

async function refresh() {
  const cities = getCities();
  try {
    const weather = await fetchWeather(cities);
    renderCards(mergeData(cities, weather));
  } catch (error) {
    document.querySelector('#cards').textContent = 'No se pudo cargar el tiempo 😕';
    console.error(error);
  }
}

setupSearch(async (city) => {
  if (addCity(city)) await refresh();
});

document.querySelector('#cards').addEventListener('click', async (e) => {
  const btn = e.target.closest('.remove');
  if (!btn) return;
  removeCity(Number(btn.dataset.id));
  await refresh();
});

refresh();