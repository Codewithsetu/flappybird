document.addEventListener("DOMContentLoaded", () => {
  const bird = document.getElementById("bird");
  const gameContainer = document.getElementById("game-container");
  const scoreDisplay = document.getElementById("score");
  const message = document.getElementById("message");
  const restartBtn = document.getElementById("restart-btn");

  let birdTop = 250;
  let gravity = 2;
  let isJumping = false;
  let pipes = [];
  let pipeSpeed = 2;
  let spawnInterval;
  let score = 0;
  let gameOverFlag = false;

  // Jump function
  function jump() {
    if (!gameOverFlag) {
      isJumping = true;
      let jumpCount = 0;
      const jumpInterval = setInterval(() => {
        if (jumpCount > 15) {
          clearInterval(jumpInterval);
          isJumping = false;
        }
        birdTop -= 5;
        bird.style.top = birdTop + "px";
        jumpCount++;
      }, 20);
    }
  }

  // Create pipe
  function createPipe() {
    const pipeGap = 150;
    const pipeHeight = Math.floor(Math.random() * 300) + 50;

    const topPipe = document.createElement("div");
    topPipe.classList.add("pipe");
    topPipe.style.height = pipeHeight + "px";
    topPipe.style.top = "0px";
    topPipe.style.left = "400px";
    gameContainer.appendChild(topPipe);

    const bottomPipe = document.createElement("div");
    bottomPipe.classList.add("pipe");
    bottomPipe.style.height = 600 - pipeHeight - pipeGap + "px";
    bottomPipe.style.top = pipeHeight + pipeGap + "px";
    bottomPipe.style.left = "400px";
    gameContainer.appendChild(bottomPipe);

    pipes.push({ top: topPipe, bottom: bottomPipe });
  }

  // Collision detection
  function checkCollision(pipe) {
    const birdRect = bird.getBoundingClientRect();
    const topRect = pipe.top.getBoundingClientRect();
    const bottomRect = pipe.bottom.getBoundingClientRect();

    if (
      birdRect.right > topRect.left &&
      birdRect.left < topRect.right &&
      (birdRect.top < topRect.bottom || birdRect.bottom > bottomRect.top)
    ) {
      return true;
    }

    if (birdTop >= 570 || birdTop <= 0) return true; // hit floor or ceiling
    return false;
  }

  // Restart game
  function restartGame() {
    pipes.forEach(p => {
      p.top.remove();
      p.bottom.remove();
    });
    pipes = [];
    birdTop = 250;
    bird.style.top = birdTop + "px";
    score = 0;
    scoreDisplay.textContent = score;
    message.style.display = "none";
    restartBtn.style.display = "none";
    gameOverFlag = false;
  }

  // Game loop
  function gameLoop() {
    if (!isJumping) {
      birdTop += gravity;
      bird.style.top = birdTop + "px";
    }

    pipes.forEach((pipe, index) => {
      const currentLeft = parseInt(pipe.top.style.left);
      pipe.top.style.left = currentLeft - pipeSpeed + "px";
      pipe.bottom.style.left = currentLeft - pipeSpeed + "px";

      if (checkCollision(pipe)) {
        gameOverFlag = true;
        message.style.display = "block";
        message.textContent = "Game Over!";
        restartBtn.style.display = "block";
        clearInterval(spawnInterval);
      }

      // Remove pipes when off screen and increase score
      if (currentLeft < -60) {
        pipe.top.remove();
        pipe.bottom.remove();
        pipes.splice(index, 1);
        if (!gameOverFlag) score++;
        scoreDisplay.textContent = score;
      }
    });

    if (!gameOverFlag) requestAnimationFrame(gameLoop);
  }

  // Start spawning pipes
  spawnInterval = setInterval(() => {
    if (!gameOverFlag) createPipe();
  }, 2000);

  // Event listeners
  document.addEventListener("keydown", jump);
  document.addEventListener("click", jump);
  restartBtn.addEventListener("click", () => {
    restartGame();
    gameLoop();
    spawnInterval = setInterval(() => {
      if (!gameOverFlag) createPipe();
    }, 2000);
  });

  // Start the game
  gameLoop();
});
