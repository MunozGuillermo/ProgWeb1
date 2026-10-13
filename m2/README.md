# **Proyecto Programacion Web 1 - El tiempo en el mundo** #

Aplicación web para consultar el tiempo actual de cualquier ciudad del mundo. El usuario busca una ciudad, la añade y aparece una tarjeta con su temperatura, humedad, viento y estado del cielo. Las tarjetas cambian de color según la temperatura y se muestra un resumen con la media, la ciudad más cálida y la más fría.

## Cómo probarlo ##

Requiere [Node.js](https://nodejs.org) (versión LTS). Desde la carpeta `weather-app`:

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (normalmente `http://localhost:5173`). Escribe el nombre de una ciudad, elige una de las sugerencias y se añadirá su tarjeta. Las ciudades se guardan en el navegador, así que siguen ahí al recargar. Para quitar una, pulsa la ✕ de su tarjeta.

Usa las APIs gratuitas de Open-Meteo (geocodificación y previsión), que no necesitan API key.

## Estructura ##

- `src/main.js`: punto de entrada, conecta las piezas.
- `src/state.js`: lista de ciudades guardada en `localStorage`.
- `src/api/`: peticiones con `fetch` + `async/await` (`geocoding.js` y `weather.js`).
- `src/utils/`: funciones puras (`stats.js` con `map`, `filter`, `reduce`, `sort`), traducción de códigos del tiempo (`weatherCodes.js`) y la caché (`cache.js`).
- `src/ui/`: todo lo que toca el DOM (`searchBar.js` y `renderCards.js`).
- `src/styles/main.css`: estilos.

## Uso de IA ##

Usé Claude para ayudarme a estructurar y escribir el código del proyecto. Qué se le pidió:
- Le pedí que me propusiera cómo estructurar el proyecto (qué carpetas y archivos, y qué responsabilidad tiene cada uno) antes de escribir nada.
- Le pregunté cómo obtener los países desde la API. Me explicó que Open-Meteo no tiene listado de países y me propuso dos caminos (usar otra API o dejar que el usuario busque); elegí el buscador.
- Le pedí que me ayudase a escribir los módulos de la aplicación (llamadas a las APIs, estado, utilidades con métodos de array y renderizado de las tarjetas).
- Le pedí añadir una caché en `localStorage` como extra para no repetir peticiones.
- La usé para resolver problemas de configuración: instalar Node.js, el error de ejecución de scripts de PowerShell, crear el proyecto de Vite en JavaScript en vez de TypeScript y colocar los archivos en la carpeta correcta.

## Autopsia ##

1 - Buscador de ciudades en vez de cargar todos los países. La primera idea era mostrar el tiempo de todos los países nada más abrir la página, usando la API REST Countries para obtener la capital y las coordenadas de cada uno. La alternativa descartada obligaba a hacer unas 250 consultas de tiempo (troceadas en lotes de 50) en cada visita, con una carga inicial lenta y mucha presión sobre un servicio gratuito. Se optó por que el usuario busque y añada solo las ciudades que le interesan, usando la API de geocodificación de Open-Meteo, porque es más ligero y más interactivo. La desventaja es que la página arranca vacía, y el usuario no ve nada hasta que añade una ciudad. Además, la búsqueda depende de que escriba bien el nombre.

2 - Caché propia en localStorage con tiempo de caducidad, en vez de usar la Cache API o dejar que el navegador cachee las peticiones. Se escribió un módulo pequeño (`cache.js`) que guarda cada respuesta junto con la hora y la descarta cuando pasa su tiempo de vida (10 minutos para el tiempo, 24 horas para las búsquedas). Se descartó la Cache API porque está pensada para service workers y es más complicada de entender, y la caché HTTP del navegador no deja controlar cuánto dura cada dato. La desventaja es que las entradas caducadas solo se borran cuando se vuelven a consultar, así que `localStorage` puede ir acumulando datos viejos. Además, el tiempo mostrado puede tener hasta 10 minutos de antigüedad.