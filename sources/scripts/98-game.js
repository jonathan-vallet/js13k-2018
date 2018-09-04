// DRAWING
function draw() {
    if(goLeft) {
        xDirection = -1;
    } else if(goRight) {
        xDirection = 1;
    } else {
        xDirection = 0;
    }

    if(goTop) {
        yDirection = -1;
    } else if(goBottom) {
        yDirection = 1;
    } else {
        yDirection = 0;
    }
    
    // Clear canvas
    gameContext.clearRect(0,0,gameCanvas.width,gameCanvas.height);
    gameContext.fillStyle = '#000';
    gameContext.fillRect(0,0,gameCanvas.width,gameCanvas.height);
    
    // Sets new player position
    var [xMovement, yMovement] = checkCollision();
    
    var lightMovement =  frameDuration / 30;

    // First draw walls to detect collisions
    if(xDirection !== 0) {
        if(xDirection > 0 && playerOffsetX < PLAYER_BOX_OFFSET || xDirection < 0 && playerOffsetX > -PLAYER_BOX_OFFSET) {
            playerOffsetX += xMovement;
        } else {
            mapOffsetX -= xMovement;
        }
        lightOffsetX = Math.min(20, Math.max(lightOffsetX + lightMovement * xDirection, -20));
    } else {
        if(lightOffsetX > 0) {
            lightOffsetX = Math.max(0, lightOffsetX - lightMovement);
        } else {
            lightOffsetX = Math.min(0, lightOffsetX + lightMovement);
        }
    }
    
    if(yDirection !== 0) {
        if(yDirection > 0 && playerOffsetY < PLAYER_BOX_OFFSET || yDirection < 0 && playerOffsetY > -PLAYER_BOX_OFFSET) {
            playerOffsetY += yMovement;
        } else {
            mapOffsetY -= yMovement;
        }
        lightOffsetY = Math.min(20, Math.max(lightOffsetY + lightMovement * yDirection, -20));
    } else {
        if(lightOffsetY > 0) {
            lightOffsetY = Math.max(0, lightOffsetY - lightMovement);
        } else {
            lightOffsetY = Math.min(0, lightOffsetY + lightMovement);
        }
    }

    
    drawShadows();
    drawMap();
    

    // Masked Foreground
// gameContext.globalCompositeOperation = "source-in";
// gameContext.drawImage(foreground,0,0);
    gameContext.globalCompositeOperation = "source-over";
    
    drawPlayer();

    generateLightFilter();
    drawShadow();
    if(gamePhase === 1) {
        updateSignalPower();
    } else if(gamePhase === 3) {
        setCompassAngle();
        if(isPlayerOnStairs()) {
            endLevel();
        }
    }
    
}

// DRAW LOOP
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
function drawLoop(){
    var previousFrameTime = now;
    now = new Date();
    frameDuration = now - previousFrameTime;
    
    requestAnimationFrame(drawLoop);
    draw();
}

window.onload = function(){
// foreground.onload = function(){
// drawLoop();
// };
// foreground.src = "images/floor.jpg";
    drawLoop();
};

function restartGame() {
    isTorchLit = false;
    mapOffsetX = -50;
    mapOffsetY = -50;
    isSprinting = false;
    playerOffsetX = 0;
    playerOffsetY = 0;
    playerRotation = 0; // Player oriention to draw in correc direction while moving and keep rotation after
    shadowList = [
        {x: 80, y: 280},
        {x: 450, y: 30}
    ];
}

function initGame() {
    restartGame();
    checkSize();
    initMap();
    initKeyboard();
    initPlayer();
}

function endLevel() {
    restartGame();
}

function gameOver() {
    restartGame();
}
initGame();