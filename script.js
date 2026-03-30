const GOAL = 20;
let score = 0;
let timeLeft = 30;
let gameActive = false;
let timerInterval;
let spawnInterval;

const winMessages = [
  "Incredible! You've funded a clean water project!",
  "Success! You're a clean water hero!",
  "Amazing! Your speed is bringing water to those in need!"
];

const lossMessages = [
  "Don't give up! Every drop counts.",
  "Almost there! Try again to help build the well.",
  "The mission continues. Let's try again!"
];

function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = ''; 
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell'; 
    grid.appendChild(cell);
  }
}

function spawnCan() {
  if (!gameActive) return;
  const cells = document.querySelectorAll('.grid-cell');
  cells.forEach(cell => cell.innerHTML = '');

  const target = cells[Math.floor(Math.random() * 9)];
  const can = document.createElement('div');
  can.className = 'water-can';
  
  can.onclick = () => {
    if (!gameActive) return;
    score++;
    document.getElementById('current-cans').innerText = score;
    can.remove();
  };
  
  target.appendChild(can);
}

function startGame() {
  if (gameActive) return;
  
  score = 0;
  timeLeft = 30;
  gameActive = true;
  
  document.getElementById('current-cans').innerText = score;
  document.getElementById('timer').innerText = timeLeft;
  document.getElementById('achievements').innerText = '';
  
  createGrid();
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
  
  spawnInterval = setInterval(spawnCan, 900);
}

function endGame() {
  gameActive = false;
  clearInterval(timerInterval);
  clearInterval(spawnInterval);
  
  const display = document.getElementById('achievements');
  if (score >= GOAL) {
    display.innerText = winMessages[Math.floor(Math.random() * winMessages.length)];
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  } else {
    display.innerText = lossMessages[Math.floor(Math.random() * lossMessages.length)];
  }
}

document.getElementById('start-game').onclick = startGame;
createGrid();
