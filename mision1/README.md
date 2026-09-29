# **Proyecto Programacion Web 1 - Simon Dice** #

Mini juego tipo "Simon dice" con un tablero de botones de colores, 3 niveles de dificultad (que varían el número de botones y la velocidad de la secuencia) y un modo oscuro.

## Cómo probarlo ##

Abre index.html en el navegador (o usa Live Server). Elige una dificultad, pulsa "Empezar" y repite la secuencia de colores que se ilumina. Si fallas, la partida termina y se muestra en qué ronda te quedaste.

## Uso de IA ##

Usé Claude para ayudarme a estructurar y escribir el código del proyecto. Qué se le pidió:
- Le pedí que me propusiera cómo estructurar el proyecto (qué archivos, qué responsabilidad tiene cada uno) antes de escribir nada.
- Le pedí varias guias breves sobre la estructura y funcionamientos de un fichero de JavaScript.
- También pregunté por guias y consejos para el desarrollo del estilo de la página: para mover de sitio componentes, para añadir fondos que no fuesen solo colores, para integrar fonts de internet, etc.
- Usé la IA mayoritariamente para irme ayudando a escribir las funciones y las lineas del html correctamente durante todo el proyecto.

##  Autopsia ##

1 - Reproducir la secuencia con setTimeout encadenados en vez de async/await. El código usa un forEach con setTimeout(..., speed * (index + 1)) para ir iluminando los botones en orden, y otro setTimeout adicional para saber cuándo termina la secuencia y desbloquear el tablero. La alternativa descartada era escribir una función async que usara await delay(speed) entre cada botón: sería más legible y fácil de seguir línea a línea, pero se optó por los setTimeout porque es el patrón más directo de explicar para un primer proyecto, aunque tiene el riesgo de que si cambias la lógica más adelante, los tiempos calculados a mano (speed * (sequence.length + 1)) se puedan descuadrar fácilmente si no se actualizan todos a la vez.

2 - Cambiar el tema con una clase dark-mode en el body + variables CSS, en vez de guardar el estado del tema en una variable de JavaScript o en el DOM con un atributo data-theme. Se descartó usar algo como document.body.dataset.theme = 'dark' con selectores [data-theme="dark"] en CSS, que es una alternativa igual de válida y quizás más explícita. Se eligió classList.toggle('dark-mode') por ser más simple de leer para quien no ha visto data-* antes, aunque tiene la desventaja de que si en el futuro quisiera añadir más de dos temas (por ejemplo, un tercer tema de "alto contraste"), el sistema de una sola clase booleana no escala tan bien como un atributo con varios valores posibles.