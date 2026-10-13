const PREFIX = 'cache:';

export function getCache(key, ttl) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;

    const { value, time } = JSON.parse(raw);
    if (Date.now() - time > ttl) {          
      localStorage.removeItem(PREFIX + key);
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

export function setCache(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ value, time: Date.now() }));
  } catch {
    // almacenamiento lleno o bloqueado: seguimos sin caché
  }
}