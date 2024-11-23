const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Canvas and game settings
canvas.width = 400;
canvas.height = 400;
const tileSize = 20;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let speed = 100;
let gameRunning = true; // Pause state

// Snake and food
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: 0, y: 0 };

// Sounds
const eatSound = new Audio("eat.mp3");
const gameOverSound = new Audio("game-over.mp3");

// Display high score
document.getElementById("score").innerText = `Score: ${score} | High Score: ${highScore}`;

// Generate initial food position
function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / tileSize)) * tileSize;
    food.y = Math.floor(Math.random() * (canvas.height / tileSize)) * tileSize;
}
placeFood();

// Game loop
function gameLoop() {
    if (!gameRunning) return; // Skip loop if paused

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move snake
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score++;
        eatSound.play();
        document.getElementById("score").innerText = `Score: ${score} | High Score: ${highScore}`;
        placeFood();

        // Increase speed every 5 points
        if (score % 5 === 0 && speed > 50) speed -= 10;
    } else {
        snake.pop(); // Remove tail if no food eaten
    }

    // Check for collisions
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOverSound.play();

        // Update high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }

        alert(`Game Over! Your score: ${score}`);
        document.location.reload();
    }

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, tileSize, tileSize);

    // Draw snake
    ctx.fillStyle = "lime";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, tileSize, tileSize);
    });

    setTimeout(gameLoop, speed);
}

// Keyboard controls
window.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -tileSize };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: tileSize };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -tileSize, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: tileSize, y: 0 };
            break;
        case " ":
            gameRunning = !gameRunning; // Toggle pause
            if (gameRunning) gameLoop(); // Resume game
            break;
    }
});

// Start the game
gameLoop();
