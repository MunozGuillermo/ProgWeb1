const colorButtons = document.querySelectorAll('.color-btn');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const startBtn = document.getElementById('start-btn');
const darkModeBtn = document.getElementById('dark-mode-btn');
const statusMessage = document.getElementById('status-message');
const roundCount = document.getElementById('round-count');
const board = document.getElementById('board');

const DIFFICULTIES = {
  facil:   { numButtons: 4, speed: 800 },
  medio:   { numButtons: 5, speed: 500 },
  dificil: { numButtons: 6, speed: 300 }
};

const ALL_COLORS = ['rojo', 'azul', 'verde', 'amarillo', 'morado', 'naranja'];

let currentDifficulty = 'facil';
let sequence = [];
let playerStep = 0;
let round = 0;
let isPlayingSequence = false;
let gameStarted = false;

difficultyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if(!gameStarted){
      currentDifficulty = btn.dataset.difficulty;

      difficultyButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      setupBoard();
    }
  });
});

function setupBoard() {
  const { numButtons } = DIFFICULTIES[currentDifficulty];
  const activeColors = ALL_COLORS.slice(0, numButtons);

  board.dataset.difficulty = currentDifficulty;

  colorButtons.forEach(btn => {
    if (activeColors.includes(btn.dataset.color)) {
      btn.classList.remove('hidden');
    } else {
      btn.classList.add('hidden');
    }
  });
}

startBtn.addEventListener('click', startGame);

function startGame() {
  sequence = [];
  playerStep = 0;
  round = 0;
  gameStarted = true;
  roundCount.textContent = round;

  setupBoard();
  nextRound();
}

function nextRound() {
  playerStep = 0;
  round++;
  roundCount.textContent = round;

  const { numButtons } = DIFFICULTIES[currentDifficulty];
  const activeColors = ALL_COLORS.slice(0, numButtons);
  const randomColor = activeColors[Math.floor(Math.random() * activeColors.length)];

  sequence.push(randomColor);
  playSequence();
}

function playSequence() {
  isPlayingSequence = true;
  statusMessage.textContent = 'Mira la secuencia...';
  board.classList.add('disabled');

  const { speed } = DIFFICULTIES[currentDifficulty];

  sequence.forEach((color, index) => {
    setTimeout(() => {
      lightUpButton(color);
    }, speed * (index + 1));
  });

  setTimeout(() => {
    isPlayingSequence = false;
    board.classList.remove('disabled');
    statusMessage.textContent = 'Tu turno';
  }, speed * (sequence.length + 1));
}

function lightUpButton(color) {
  const btn = document.getElementById(`btn-${color}`);
  btn.classList.add('active');
  setTimeout(() => {
    btn.classList.remove('active');
  }, 300);
}

colorButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (!gameStarted || isPlayingSequence) return;

    const color = btn.dataset.color;
    lightUpButton(color);
    handlePlayerClick(color);
  });
});

function handlePlayerClick(color) {
  if (color === sequence[playerStep]) {
    playerStep++;

    if (playerStep === sequence.length) {
      statusMessage.textContent = 'A la siguiente...';
      setTimeout(nextRound, 1000);
    }
  } else {
    gameOver();
  }
}

function gameOver() {
  statusMessage.textContent = `Vaya... LLegaste a la ronda ${round}`;
  gameStarted = false;
  board.classList.remove('disabled');
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  darkModeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

darkModeBtn.addEventListener('click', toggleDarkMode);

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'd') {
    toggleDarkMode();
  }
});

setupBoard();
