// Define constants for game elements
const gameBoardElement = document.getElementById("game-board");
const instructionTextElement = document.getElementById("instruction-text");
const logoElement = document.getElementById("logo");
const scoreElement = document.getElementById("score");
const highScoreTextElement = document.getElementById("highScore");
const mobileWarningElement = document.getElementById("mobile-warning");

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let isGameStarted = false;

// Get the high score from localStorage on page load
window.addEventListener("load", () => {
  const storedHighScore = localStorage.getItem("snakeHighScore");
  if (storedHighScore) {
    highScore = parseInt(storedHighScore, 10);
    displayHighScore();
  }
});

// Draw game map, snake, food
function renderGame() {
  gameBoardElement.innerHTML = "";
  renderSnake();
  renderFood();
  updateScore();
}

// Draw snake on the game board
function renderSnake() {
  snake.forEach((segment) => {
    const snakeSegmentElement = createGameElement("div", "snake");
    setPosition(snakeSegmentElement, segment);
    gameBoardElement.appendChild(snakeSegmentElement);
  });
}

// Create a game element (snake or food cube)
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of snake or food on the game board
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Draw food on the game board
function renderFood() {
  if (isGameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    gameBoardElement.appendChild(foodElement);
  }
}

// Generate random position for food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Move the snake on the game board
function moveSnake() {
  const head = { ...snake[0] };
  // Update the position of the snake head based on the direction
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }

  snake.unshift(head);

  // Check for collision with food
  if (head.x === food.x && head.y === food.y) {
    handleFoodCollision();
  } else {
    // Remove the last segment of the snake if no collision with food
    snake.pop();
  }
}

// Handle collision with food
function handleFoodCollision() {
  food = generateFood();
  increaseSpeed();
  restartGameInterval();
}

// Restart game interval with updated speed
function restartGameInterval() {
  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    moveSnake();
    checkCollision();
    renderGame();
  }, gameSpeedDelay);
}

// Start the game
function startGame() {
  isGameStarted = true;
  hideInstructionsAndLogo();
  restartGameInterval();
}

// Hide instruction and logo elements
function hideInstructionsAndLogo() {
  instructionTextElement.style.display = "none";
  logoElement.style.display = "none";
}

// Handle keypress event
function handleKeyPress(event) {
  if (!isGameStarted && (event.code === "Space" || event.key === " ")) {
    startGame();
  } else {
    handleArrowKeyPress(event.key);
  }
}

// Handle arrow key press events
function handleArrowKeyPress(key) {
  switch (key) {
    case "ArrowUp":
      direction = "up";
      break;
    case "ArrowDown":
      direction = "down";
      break;
    case "ArrowLeft":
      direction = "left";
      break;
    case "ArrowRight":
      direction = "right";
      break;
  }
}

document.addEventListener("keydown", handleKeyPress);

// Increase game speed based on current delay
function increaseSpeed() {
  if (gameSpeedDelay > 25) {
    if (gameSpeedDelay > 150) {
      gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 100) {
      gameSpeedDelay -= 1.5;
    } else if (gameSpeedDelay > 50) {
      gameSpeedDelay -= 1;
    } else {
      gameSpeedDelay -= 0.5;
    }
  }
}

// Check for collisions with boundaries or self
function checkCollision() {
  const head = snake[0];

  // Check for collision with game boundaries
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  // Check for collision with self
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

// Reset the game state
function resetGame() {
  updateHighScore();
  stopGame();
  initializeGame();
}

// Update and display the high score
function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    localStorage.setItem("snakeHighScore", highScore.toString());
    displayHighScore();
  }
}

// Display the high score element
function displayHighScore() {
  highScoreTextElement.textContent = highScore.toString().padStart(3, "0");
  highScoreTextElement.style.display = "block";
}

// Initialize the game state
function initializeGame() {
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
}

// Update and display the score
function updateScore() {
  scoreElement.textContent = (snake.length - 1).toString().padStart(3, "0");
}

// Stop the game and display instructions and logo
function stopGame() {
  clearInterval(gameInterval);
  isGameStarted = false;
  displayInstructionsAndLogo();
}

// Display instructions and logo elements
function displayInstructionsAndLogo() {
  instructionTextElement.style.display = "block";
  logoElement.style.display = "block";
}
