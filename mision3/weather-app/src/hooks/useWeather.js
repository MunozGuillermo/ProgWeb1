import { useState, useEffect } from 'react';
import { fetchWeather } from '../api/weather.js';
import { mergeData } from '../utils/stats.js';

export function useWeather(cities) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  useEffect(() => {
    if (cities.length === 0) {
      setItems([]);
      setStatus('idle');
      return;
    }

    let ignore = false;
    setStatus('loading');

    fetchWeather(cities)
      .then((weather) => {
        if (ignore) return;
        setItems(mergeData(cities, weather));
        setStatus('success');
      })
      .catch((error) => {
        if (ignore) return;
        console.error(error);
        setStatus('error');
      });

    return () => { ignore = true; };   // cleanup: descarta respuestas obsoletas
  }, [cities]);

  return { items, status };
}