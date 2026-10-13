export const mergeData = (cities, weather) =>
  cities.map((city, i) => ({ ...city, ...weather[i] }));

export const sortByTemp = (items) =>
  [...items].sort((a, b) => b.temperature_2m - a.temperature_2m);

export const averageTemp = (items) =>
  items.reduce((sum, i) => sum + i.temperature_2m, 0) / items.length;

export const hottest = (items) =>
  items.reduce((max, i) => (i.temperature_2m > max.temperature_2m ? i : max));

export const coldest = (items) =>
  items.reduce((min, i) => (i.temperature_2m < min.temperature_2m ? i : min));