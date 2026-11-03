# **Proyecto Programacion Web 1 - M3 Reactor Core: El tiempo en el mundo** #

Reconstrucción en **React 19** de mi app de la misión anterior. El usuario busca una ciudad, la añade y aparece una tarjeta con su temperatura, humedad, viento y estado del cielo. Las tarjetas cambian de color según la temperatura y se muestra un resumen con la media, la ciudad más cálida y la más fría. Se puede cambiar entre °C y °F.

## Cómo probarlo ##

Requiere [Node.js](https://nodejs.org) (versión LTS). Desde esta carpeta:

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (normalmente `http://localhost:5173`). Escribe una ciudad, elige una sugerencia y se añadirá su tarjeta. Las ciudades y la unidad elegida se guardan en el navegador. Para quitar una ciudad, pulsa la ✕ de su tarjeta.

Usa las APIs gratuitas de Open-Meteo (geocodificación y previsión), que no necesitan API key.

## Estructura ##

- `src/main.jsx`: punto de entrada, monta `<App />` en `#root`.
- `src/App.jsx`: componente raíz. Guarda el estado (`cities`, `unit`) y compone el resto.
- `src/components/`: `SearchBar.jsx` (buscador con sugerencias), `CityCard.jsx` (tarjeta de una ciudad) y `Summary.jsx` (resumen).
- `src/hooks/`: custom hooks reutilizables: `useLocalStorage`, `useDebounce` y `useWeather`.
- `src/api/`: peticiones con `fetch` + `async/await` (`geocoding.js` y `weather.js`).
- `src/utils/`: funciones puras (`stats.js` con `map`, `filter`, `reduce`, `sort`), traducción de códigos del tiempo (`weatherCodes.js`) y caché con caducidad (`cache.js`).
- `src/styles/main.css`: estilos.

## Decisiones de diseño ##

- **Estado mínimo**: solo guardo en estado la lista de ciudades y la unidad. Lo que se muestra (ciudades ordenadas, temperatura en °C o °F, resumen) se calcula en cada render, sin duplicarlo en otro `useState`.
- **`unit` está en `App`** (*lifting state up*) porque lo necesitan a la vez `CityCard` y `Summary`.
- **`useEffect` solo donde hay sincronización con algo externo**: la API del tiempo, la API de búsqueda, `localStorage` y el temporizador del *debounce*. Cada uno con sus dependencias y, cuando hace falta, *cleanup*.
- **Caché en `localStorage`** (10 minutos para el tiempo y 24 horas para las búsquedas) para no repetir peticiones. Se conserva de la misión anterior.
- **Bonus**: tres custom hooks reutilizables (`useLocalStorage`, `useDebounce`, `useWeather`).

## Uso de IA ##

Herramienta: **Claude** (Anthropic), en el chat de claude.ai.

Qué hice con IA:
- Proponer la estructura del proyecto y migrar la app de la misión 2 (Vite + JavaScript vanilla) a React, reutilizando las carpetas `api/` y `utils/`.
- Generar los primeros borradores de los hooks.
- Los estilos de la página (paleta, degradados, fuentes de Google Fonts) y la caché en `localStorage`.
- Resolver problemas de configuración: instalar Node.js, el error de ejecución de scripts de PowerShell, y añadir React y `@vitejs/plugin-react` a un proyecto de Vite que se había creado sin React.


## Autopsia ##

1 - Meter la lógica de las peticiones en un custom hook (`useWeather`) en vez de escribir el `fetch` dentro de un `useEffect` en `App`. Con el hook, `App` solo compone la interfaz y la lógica de carga (estados `idle | loading | success | error`, descarte de respuestas obsoletas) queda aislada y se puede reutilizar. La alternativa descartada era hacerlo todo directamente en `App`, que es menos código y más fácil de seguir para alguien que acaba de aprender `useEffect`. La desventaja de mi elección es un archivo más y una capa extra de indirección, y que el hook vuelve a pedir el tiempo cada vez que cambia la lista de ciudades (aunque la caché evita repetir las peticiones ya hechas).

2 - Evitar respuestas obsoletas con un flag `ignore` en el *cleanup* del `useEffect`, en vez de cancelar la petición con `AbortController`. Cuando cambian las dependencias, el efecto anterior pone `ignore = true` y su respuesta se descarta, así una respuesta lenta no pisa a una más reciente. Se descartó `AbortController` porque obliga a pasar una señal por `api/` y a distinguir el error de cancelación del resto de errores. La desventaja es que la petición antigua sigue ejecutándose en segundo plano, así que se gasta ancho de banda aunque su resultado se ignore.