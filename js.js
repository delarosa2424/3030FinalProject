window.addEventListener("DOMContentLoaded", function (event) {
    window.focus(); 
  
    
    let snakePositions; 
    let applePosition; 
  
    let startTimestamp; 
    let lastTimestamp; 
    let stepsTaken;
    let score;
    let contrast;
  
    let inputs; 
  
    let gameStarted = false;
    let hardMode = false;
  
   
    const width = 15; 
    const height = 15; 
    const speed = 200; 
    let fadeSpeed = 5000; 
    let fadeExponential = 1.024; 
    const contrastIncrease = 0.5; 
    const color = "#194569"; 
  
    const grid = document.querySelector(".grid");
    for (let i = 0; i < width * height; i++) {
      const content = document.createElement("div");
      content.setAttribute("class", "content");
      content.setAttribute("id", i); 
  
      const tile = document.createElement("div");
      tile.setAttribute("class", "tile");
      tile.appendChild(content);
  
      grid.appendChild(tile);
    }
  
    const tiles = document.querySelectorAll(".grid .tile .content");
  
    const containerElement = document.querySelector(".container");
    const noteElement = document.querySelector("footer");
    const contrastElement = document.querySelector(".contrast");
    const scoreElement = document.querySelector(".score");
  
    
    resetGame();
  
    
    function resetGame() {
      snakePositions = [168, 169, 170, 171];
      applePosition = 100; 
  
      startTimestamp = undefined;
      lastTimestamp = undefined;
      stepsTaken = -1;
      score = 0;
      contrast = 1;
  
      inputs = [];
  
      contrastElement.innerText = ${Math.floor(contrast * 100)}%;
      scoreElement.innerText = hardMode ? H ${score} : score;
  
      for (const tile of tiles) setTile(tile);
  
      setTile(tiles[applePosition], {
        "background-color": color,
        "border-radius": "50%"
      });
  
      for (const i of snakePositions.slice(1)) {
        const snakePart = tiles[i];
        snakePart.style.backgroundColor = color;
  
        if (i == snakePositions[snakePositions.length - 1])
          snakePart.style.left = 0;
        if (i == snakePositions[0]) snakePart.style.right = 0;
      }
    }
  
    window.addEventListener("keydown", function (event) {
      if (
        ![
          "ArrowLeft",
          "ArrowUp",
          "ArrowRight",
          "ArrowDown",
          " ",
          "H",
          "h",
          "E",
          "e"
        ].includes(event.key)
      )
        return;
  
      event.preventDefault();
  
      if (event.key == " ") {
        resetGame();
        startGame();
        return;
      }
  
      if (event.key == "H" || event.key == "h") {
        hardMode = true;
        fadeSpeed = 4000;
        fadeExponential = 1.025;
        noteElement.innerHTML = Hard mode. Press space to start!;
        noteElement.style.opacity = 1;
        resetGame();
        return;
      }
  
      if (event.key == "E" || event.key == "e") {
        hardMode = false;
        fadeSpeed = 5000;
        fadeExponential = 1.024;
        noteElement.innerHTML = Easy mode. Press space to start!;
        noteElement.style.opacity = 1;
        resetGame();
        return;
      }
  
      if (
        event.key == "ArrowLeft" &&
        inputs[inputs.length - 1] != "left" &&
        headDirection() != "right"
      ) {
        inputs.push("left");
        if (!gameStarted) startGame();
        return;
      }
      if (
        event.key == "ArrowUp" &&
        inputs[inputs.length - 1] != "up" &&
        headDirection() != "down"
      ) {
        inputs.push("up");
        if (!gameStarted) startGame();
        return;
      }
      if (
        event.key == "ArrowRight" &&
        inputs[inputs.length - 1] != "right" &&
        headDirection() != "left"
      ) {
        inputs.push("right");
        if (!gameStarted) startGame();
        return;
      }
      if (
        event.key == "ArrowDown" &&
        inputs[inputs.length - 1] != "down" &&
        headDirection() != "up"
      ) {
        inputs.push("down");
        if (!gameStarted) startGame();
        return;
      }
    });
  
    function startGame() {
      gameStarted = true;
      noteElement.style.opacity = 0;
      window.requestAnimationFrame(main);
    }
  
    function main(timestamp) {
      try {
        if (startTimestamp === undefined) startTimestamp = timestamp;
        const totalElapsedTime = timestamp - startTimestamp;
        const timeElapsedSinceLastCall = timestamp - lastTimestamp;
  
        const stepsShouldHaveTaken = Math.floor(totalElapsedTime / speed);
        const percentageOfStep = (totalElapsedTime % speed) / speed;
  
        if (stepsTaken != stepsShouldHaveTaken) {
          stepAndTransition(percentageOfStep);
  
          const headPosition = snakePositions[snakePositions.length - 1];
          if (headPosition == applePosition) {
            score++;
            scoreElement.innerText = hardMode ? H ${score} : score;
  
            addNewApple();
  
            contrast = Math.min(1, contrast + contrastIncrease);