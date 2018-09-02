// DRAWING
function draw() {
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
    if(gamePhase === 1) {
        updateSignalPower();
    } else if(gamePhase === 3) {
        setCompassAngle();
        if(isPlayerOnStairs()) {
            endLevel();
        }
    }
    
}

var frameDuration = 0;
// DRAW LOOP
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
function drawLoop(){
    loopNumber = 0;
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

document.querySelector('.phone-light').onclick = () => {
    isTorchLit = !isTorchLit;
};

document.onkeydown = function(e){
    var code = e.keyCode;
    if (code === 39) {
        xDirection = 1;
    } else if (code === 37) {
        xDirection = -1;
    }
    if (code === 38) {
        yDirection = -1;
    } else if (code === 40) {
        yDirection = 1;
    }
    if(xDirection !== 0 || yDirection !== 0) {
        gameCanvas.classList.add(e.shiftKey ? 'sprinting' : 'moving');
        if(e.shiftKey) {
            isSprinting = true;
        }
    }

    if(gamePhase === 2) {
        checkText(e.key);
    }
    var letter = document.querySelector('#iphone-keyboard button[data-char="' + e.key.toUpperCase() + '"')
    letter && letter.classList.add('active');
};

document.onkeyup = function(e){
    var code = e.keyCode;
    if (code === 39) {
        xDirection = 0;
    } else if (code === 37) {
        xDirection = 0;
    }
    if (code === 38) {
        yDirection = 0;
    } else if (code === 40) {
        yDirection = 0;
    }
    if(!e.shiftKey) {
        isSprinting = false;
    }
    gameCanvas.classList.remove('moving', 'sprinting');
    
    var letter = document.querySelector('#iphone-keyboard button[data-char="' + e.key.toUpperCase() + '"')
    letter && letter.classList.remove('active');
};

window.addEventListener('resize', function(k) {
    checkSize();
});

function initGame() {
    checkSize();
    initMap();
    initKeyboard();
    initPlayer();
    startCompassPhase();
}

function endLevel() {
    console.log('yeah!!');
    initGame();
}
initGame();