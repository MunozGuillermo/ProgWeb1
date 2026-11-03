import { describeWeather } from '../utils/weatherCodes.js';
import { sortByTemp, averageTemp, hottest, coldest } from '../utils/stats.js';

const tempClass = (t) =>
  t < 10 ? 'cold' : t < 22 ? 'mild' : t < 30 ? 'warm' : 'hot';

const card = (item) => {
  const { text, icon } = describeWeather(item.weather_code);
  return `
    <article class="card ${tempClass(item.temperature_2m)}">
      <button class="remove" data-id="${item.id}" aria-label="Quitar">✕</button>
      <h2>${item.name}</h2>
      <p class="country">${item.country ?? ''}</p>
      <p class="icon">${icon}</p>
      <p class="temp">${Math.round(item.temperature_2m)}°C</p>
      <p>${text}</p>
      <p>💧 ${item.relative_humidity_2m}% · 💨 ${item.wind_speed_10m} km/h</p>
    </article>`;
};

export function renderCards(items) {
  const cards = document.querySelector('#cards');
  const summary = document.querySelector('#summary');

  if (items.length === 0) {
    cards.innerHTML = '<p>Busca una ciudad para empezar.</p>';
    summary.innerHTML = '';
    return;
  }

  cards.innerHTML = sortByTemp(items).map(card).join('');

  summary.innerHTML = `
    <p>Media: <strong>${averageTemp(items).toFixed(1)}°C</strong> ·
       Más cálida: <strong>${hottest(items).name}</strong> ·
       Más fría: <strong>${coldest(items).name}</strong></p>`;
}