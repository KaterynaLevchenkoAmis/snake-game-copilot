let canvas = document.getElementById('gameArea');
let ctx = canvas.getContext('2d');

let blockSize = 20;
let snake = [{ top: 200, left: 200 }];
let direction = 'right';
let food = null;
let score = 0;
let scoreElement = document.getElementById('score');
let playAgainButton = document.getElementById('playAgain');
let obstacles = Array.from({ length: 3 }, createObstacle);

function createFood() {
    food = {
        top: Math.floor(Math.random() * canvas.height / blockSize) * blockSize,
        left: Math.floor(Math.random() * canvas.width / blockSize) * blockSize,
    };
}

function createObstacle() {
    return {
        top: Math.floor(Math.random() * canvas.height / blockSize) * blockSize,
        left: Math.floor(Math.random() * canvas.width / blockSize) * blockSize,
    };
}

function gameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    let text = 'Game Over';
    let textWidth = ctx.measureText(text).width;
    let x = canvas.width / 2 - textWidth / 2;
    let y = canvas.height / 2;
    ctx.fillText(text, x, y);
    playAgainButton.style.display = 'block'; // Show button
}

function updateGameArea() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!food) createFood();
    ctx.fillStyle = 'red';
    ctx.fillRect(food.left, food.top, blockSize, blockSize);

    // Draw obstacles
    ctx.fillStyle = 'gray';
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillRect(obstacles[i].left, obstacles[i].top, blockSize, blockSize);
    }

    let newBlock = { ...snake[0] };
    if (direction === 'right') newBlock.left += blockSize;
    if (direction === 'down') newBlock.top += blockSize;
    if (direction === 'left') newBlock.left -= blockSize;
    if (direction === 'up') newBlock.top -= blockSize;

    // Wrap the snake around to the other side of the game grid
    if (newBlock.left < 0) newBlock.left = canvas.width - blockSize;
    if (newBlock.top < 0) newBlock.top = canvas.height - blockSize;
    if (newBlock.left >= canvas.width) newBlock.left = 0;
    if (newBlock.top >= canvas.height) newBlock.top = 0;

    // Check collision with obstacles
    for (let i = 0; i < obstacles.length; i++) {
        if (newBlock.top === obstacles[i].top && newBlock.left === obstacles[i].left) {
            
            gameOver(); // Display "Game Over" message
            clearInterval(gameInterval); // Stop the game
            return;
        }
    }

    // Check collision with self
    for (let i = 1; i < snake.length; i++) {
        if (newBlock.top === snake[i].top && newBlock.left === snake[i].left) {
            
            gameOver(); // Display "Game Over" message
            clearInterval(gameInterval); // Stop the game
            return;
        }
    }

    if (newBlock.top === food.top && newBlock.left === food.left) {
        food = null;
        score++; // Increment score
        scoreElement.innerText = "Score: " + score;
    } else {
        snake.pop();
    }

    snake.unshift(newBlock);

    snake.forEach(block => {
        ctx.fillStyle = 'green';
        ctx.fillRect(block.left, block.top, blockSize, blockSize);
    });
}

setInterval(updateGameArea, 200);

window.addEventListener('keydown', function (event) {
    if (event.code === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (event.code === 'ArrowDown' && direction !== 'up') direction = 'down';
    if (event.code === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (event.code === 'ArrowRight' && direction !== 'left') direction = 'right';
});

playAgainButton.addEventListener('click', function() {
    // Reset game state
    snake = [{ top: 0, left: 0 }];
    direction = 'right';
    score = 0;
    scoreElement.textContent = 'Score: ' + score;
    playAgainButton.style.display = 'none'; // Hide button
    gameInterval = setInterval(updateGameArea, 200); // Start game
});