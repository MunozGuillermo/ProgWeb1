const CODES = {
  0: ['Despejado', '☀️'],
  1: ['Mayormente despejado', '🌤️'],
  2: ['Parcialmente nublado', '⛅'],
  3: ['Nublado', '☁️'],
  45: ['Niebla', '🌫️'],
  48: ['Niebla con escarcha', '🌫️'],
  51: ['Llovizna', '🌦️'],
  61: ['Lluvia', '🌧️'],
  63: ['Lluvia moderada', '🌧️'],
  65: ['Lluvia fuerte', '🌧️'],
  71: ['Nieve', '🌨️'],
  80: ['Chubascos', '🌦️'],
  95: ['Tormenta', '⛈️'],
};

export const describeWeather = (code) => {
  const [text, icon] = CODES[code] ?? ['Desconocido', '❓'];
  return { text, icon };
};