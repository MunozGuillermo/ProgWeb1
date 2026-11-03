import { useLocalStorage } from './hooks/useLocalStorage.js';
import { useWeather } from './hooks/useWeather.js';
import { sortByTemp } from './utils/stats.js';
import SearchBar from './components/SearchBar.jsx';
import CityCard from './components/CityCard.jsx';
import Summary from './components/Summary.jsx';

export default function App() {
  const [cities, setCities] = useLocalStorage('weather-cities', []);
  const [unit, setUnit] = useLocalStorage('weather-unit', 'C');
  const { items, status } = useWeather(cities);

  // Valores derivados: se calculan en cada render, no se guardan en estado
  const visible = sortByTemp(items.filter((i) => cities.some((c) => c.id === i.id)));

  const addCity = (city) =>
    setCities((prev) => (prev.some((c) => c.id === city.id) ? prev : [...prev, city]));

  const removeCity = (id) =>
    setCities((prev) => prev.filter((c) => c.id !== id));

  return (
    <main>
      <h1>El tiempo en el mundo</h1>

      <SearchBar onSelect={addCity} />

      <div className="unit-toggle">
        <button onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}>
          Cambiar a °{unit === 'C' ? 'F' : 'C'}
        </button>
      </div>

      {status === 'error' && <p className="error">No se pudo cargar el tiempo 😕 Inténtalo de nuevo.</p>}
      {status === 'loading' && visible.length === 0 && <p>⏳ Cargando el tiempo...</p>}
      {cities.length === 0 && <p>Busca una ciudad para empezar.</p>}

      <Summary items={visible} unit={unit} />

      <section id="cards" className={status === 'loading' ? 'loading' : ''}>
        {visible.map((city) => (
          <CityCard key={city.id} city={city} unit={unit} onRemove={removeCity} />
        ))}
      </section>
    </main>
  );
}