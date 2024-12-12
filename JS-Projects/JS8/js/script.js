// Initialize AOS
AOS.init();

// GSAP Animations (if any additional animations are needed)
gsap.from("#gameCanvas", { duration: 1, opacity: 0, y: -50 });

// Fullscreen Functionality
document.getElementById('fullscreen-btn').addEventListener('click', () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
        elem.requestFullscreen().then(() => {
            displayMessage('Entered Fullscreen Mode');
        }).catch((err) => {
            displayMessage(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen().then(() => {
            displayMessage('Exited Fullscreen Mode');
        });
    }
});

// Difficulty Level
let gameSpeed = 100; // Default Medium
const difficultyOptions = document.querySelectorAll('.difficulty-option');
difficultyOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault();
        gameSpeed = parseInt(option.getAttribute('data-speed'));
        displayMessage(`Difficulty set to ${option.textContent}`);
        startGame(); // Restart the game with new speed
    });
});

// Game Variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const messageBox = document.getElementById('message');
const highScoreElement = document.getElementById('highScore');
const currentScoreElement = document.getElementById('currentScore');

let snake = [{x: 10, y: 10}];
let direction = {x: 1, y: 0}; // Start moving to the right
let food = {x: 15, y: 15};
let score = 1;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval;

// Initialize High Score
highScoreElement.textContent = highScore;

// Event Listener for Key Presses
document.addEventListener('keydown', changeDirection);

// Start the Game
startGame();

// Functions
function startGame() {
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
}

function restartGame() {
    snake = [{x: 10, y: 10}];
    direction = {x: 1, y: 0}; // Reset to initial direction
    food = getRandomFood();
    score = 1;
    currentScoreElement.textContent = score;
    displayMessage('Game Restarted');
}

function gameLoop() {
    console.log('Game loop running'); // Debugging
    update();
    draw();
}

function update() {
    console.log('Updating snake position'); // Debugging
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    // Wrap around the canvas
    head.x = (head.x + (canvas.width / 20)) % (canvas.width / 20);
    head.y = (head.y + (canvas.height / 20)) % (canvas.height / 20);

    // Check Collision with self
    for (let segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    // Check if food eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        currentScoreElement.textContent = score;
        displayMessage('Yum! Snake ate the food.');
        food = getRandomFood();
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('highScore', highScore);
            displayMessage('New High Score!');
        }
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Snake
    ctx.fillStyle = '#28a745';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * 20, segment.y * 20, 18, 18);
    });

    // Draw Food
    ctx.fillStyle = '#dc3545';
    ctx.fillRect(food.x * 20, food.y * 20, 18, 18);
}

function changeDirection(e) {
    console.log('Key pressed:', e.key); // Debugging
    const key = e.key;
    let newDirection = {x: direction.x, y: direction.y};
    if (key === 'ArrowUp' && direction.y === 0) {
        newDirection = {x: 0, y: -1};
    } else if (key === 'ArrowDown' && direction.y === 0) {
        newDirection = {x: 0, y: 1};
    } else if (key === 'ArrowLeft' && direction.x === 0) {
        newDirection = {x: -1, y: 0};
    } else if (key === 'ArrowRight' && direction.x === 0) {
        newDirection = {x: 1, y: 0};
    }
    if (newDirection.x !== direction.x || newDirection.y !== direction.y) {
        direction = newDirection;
        displayMessage(`Moved ${getDirectionName(direction)}`);
        console.log('Direction changed to:', direction); // Debugging
    }
}

function getDirectionName(dir) {
    if (dir.x === 1) return 'Right';
    if (dir.x === -1) return 'Left';
    if (dir.y === 1) return 'Down';
    if (dir.y === -1) return 'Up';
    return '';
}

function getRandomFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / 20)),
        y: Math.floor(Math.random() * (canvas.height / 20))
    };
}

function endGame() {
    clearInterval(gameInterval);
    displayMessage('Game Over! Press any arrow key to restart.');
    document.removeEventListener('keydown', changeDirection);
    document.addEventListener('keydown', restartOnKey, { once: true });
}

function restartOnKey(e) {
    restartGame();
    document.addEventListener('keydown', changeDirection);
}

function displayMessage(msg) {
    messageBox.style.display = 'block';
    messageBox.textContent = msg;
    gsap.fromTo("#message", { opacity: 0 }, { opacity: 1, duration: 0.5 });
    // Hide message after 3 seconds
    gsap.to("#message", { opacity: 0, delay: 2.5, duration: 0.5, onComplete: () => {
        messageBox.style.display = 'none';
    }});
}