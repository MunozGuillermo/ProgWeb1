import { useState, useEffect } from 'react';

export function useDebounce(value, ms = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(timer);   // cleanup: cancela el temporizador anterior
  }, [value, ms]);

  return debounced;
}