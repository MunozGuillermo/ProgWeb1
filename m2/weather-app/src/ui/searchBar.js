import { searchCities } from '../api/geocoding.js';

const debounce = (fn, ms = 400) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

export function setupSearch(onSelect) {
  const input = document.querySelector('#search');
  const list = document.querySelector('#suggestions');
  let results = [];

  const clear = () => { list.innerHTML = ''; results = []; };

  const handleInput = debounce(async () => {
    const query = input.value.trim();
    if (query.length < 2) return clear();

    try {
      results = await searchCities(query);
      list.innerHTML = results.length
        ? results.map((r, i) => `
            <li data-index="${i}">
              ${r.name}${r.region ? `, ${r.region}` : ''} — ${r.country ?? ''}
            </li>`).join('')
        : '<li class="empty">Sin resultados</li>';
    } catch (error) {
      list.innerHTML = '<li class="empty">Error al buscar</li>';
      console.error(error);
    }
  });

  input.addEventListener('input', handleInput);

  list.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-index]');
    if (!li) return;
    onSelect(results[li.dataset.index]);
    input.value = '';
    clear();
  });
}