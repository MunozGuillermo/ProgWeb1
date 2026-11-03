import { averageTemp, hottest, coldest } from '../utils/stats.js';
import { formatTemp } from './CityCard.jsx';

export default function Summary({ items, unit }) {
  if (items.length === 0) return null;

  return (
    <section id="summary">
      <p>
        Media: <strong>{formatTemp(averageTemp(items), unit)}°{unit}</strong> ·
        Más cálida: <strong>{hottest(items).name}</strong> ·
        Más fría: <strong>{coldest(items).name}</strong>
      </p>
    </section>
  );
}