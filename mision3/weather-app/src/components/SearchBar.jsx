import { useState, useEffect } from 'react';
import { searchCities } from '../api/geocoding.js';
import { useDebounce } from '../hooks/useDebounce.js';

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | done | error

  const debouncedQuery = useDebounce(query.trim());
  const showList = query.trim().length >= 2;   // derivado, no es estado

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setStatus('idle');
      return;
    }

    let ignore = false;
    setStatus('loading');

    searchCities(debouncedQuery)
      .then((found) => {
        if (ignore) return;
        setResults(found);
        setStatus('done');
      })
      .catch((error) => {
        if (ignore) return;
        console.error(error);
        setStatus('error');
      });

    return () => { ignore = true; };
  }, [debouncedQuery]);

  const handleSelect = (city) => {
    onSelect(city);
    setQuery('');
  };

  return (
    <div className="search">
      <input
        id="search"
        type="search"
        placeholder="Busca una ciudad..."
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {showList && (
        <ul id="suggestions">
          {status === 'loading' && <li className="empty">Buscando...</li>}
          {status === 'error' && <li className="empty">Error al buscar</li>}
          {status === 'done' && results.length === 0 && (
            <li className="empty">Sin resultados</li>
          )}
          {status === 'done' && results.map((r) => (
            <li key={r.id} onClick={() => handleSelect(r)}>
              {r.name}{r.region ? `, ${r.region}` : ''} — {r.country ?? ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}