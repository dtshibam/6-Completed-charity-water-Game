// 1. Difficulty Configuration (Requirement: 20 pts)
const modes = {
  easy: { goal: 15, time: 45, speed: 1100 },
  normal: { goal: 20, time: 30, speed: 900 },
  hard: { goal: 35, time: 20, speed: 650 }
};

// 2. Milestone Messages (Requirement: 10 pts LevelUp)
const milestones = [
  "Off to a great start!",
  "Halfway there! Keep it up!",
  "Almost funded! Just a few more!",
  "Final stretch! Faster!"
];

// Game State Variables
let currentMode = modes.normal;
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

// 3. Milestone Logic (Requirement: LevelUp bonus)
function checkMilestones() {
  const display = document.getElementById('achievements');
  const progress = score / currentMode.goal;
  
  // Triggers messages based on progress percentage
  if (score === 5) display.innerText = milestones[0];
  if (progress >= 0.5 && progress < 0.55) display.innerText = milestones[1];
  if (progress >= 0.8 && progress < 0.85) display.innerText = milestones[2];
  if (score === currentMode.goal - 2) display.innerText = milestones[3];
}

function spawnCan() {
  if (!gameActive) return;
  const cells = document.querySelectorAll('.grid-cell');
  
  // DOM Change: Clear old items before spawning new (Requirement: 15 pts)
  cells.forEach(cell => cell.innerHTML = '');

  const target = cells[Math.floor(Math.random() * 9)];
  const can = document.createElement('div');
  can.className = 'water-can';
  
  can.onclick = () => {
    if (!gameActive) return;
    score++;
    
    // LevelUp: Play Sound Effect (Requirement: 10 pts)
    const sound = document.getElementById('collect-sound');
    sound.currentTime = 0; // Rewind to start if clicked rapidly
    sound.play();
    
    // DOM Change: Remove element immediately on click (Requirement: 15 pts)
    can.remove(); 
    
    document.getElementById('current-cans').innerText = score;
    checkMilestones();
  };
  
  target.appendChild(can);
}

function startGame() {
  if (gameActive) return;
  
  // Difficulty Selection Logic (Requirement: 20 pts)
  const selectedDifficulty = document.getElementById('difficulty').value;
  currentMode = modes[selectedDifficulty];
  
  score = 0;
  timeLeft = currentMode.time;
  gameActive = true;
  
  document.getElementById('current-cans').innerText = score;
  document.getElementById('timer').innerText = timeLeft;
  document.getElementById('achievements').innerText = "Game Started! Goal: " + currentMode.goal;
  
  createGrid();
  
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
  
  spawnInterval = setInterval(spawnCan, currentMode.speed);
}

function endGame() {
  gameActive = false;
  clearInterval(timerInterval);
  clearInterval(spawnInterval);
  
  const display = document.getElementById('achievements');
  
  if (score >= currentMode.goal) {
    // Pick random win message from array
    display.innerText = winMessages[Math.floor(Math.random() * winMessages.length)];
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  } else {
    // Pick random loss message from array
    display.innerText = `You collected ${score} cans. ` + lossMessages[Math.floor(Math.random() * lossMessages.length)];
  }
}

// Event Listeners
document.getElementById('start-game').onclick = startGame;

// Initial Grid Setup
createGrid();
