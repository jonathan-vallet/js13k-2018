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
    gamePhase = 1;
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
    showIntro();
}

function showIntro() {
    document.body.classList.add('pause');
    isGamePaused = true;
    var text = `Ok...<br>
        I'm here, alone, with my phone, offline.<br>
        I have to find network using my <b>phone signal</b><br>
        <br>
        Nothing broken, I can <b>move</b> (arrows, ZQSD, WASD)<br>
        I can use  my <b>Flashlight</b> (F, or click on the app)<br><br>
        I've seen some shadows moving, they seems to be attracted by light, I should avoid them, or use my <b>camera flash</b> in case of emergency`;
    if(gamePhase === 2) {
        text = `I've found network!<br>I have to <b>type</b> my message quickly before signal disappear! (use keyboard to rewrite text)`;
    }
    if(gamePhase === 3) {
        text = isMessageSent ? `I've send my message! When I'll have left that floor I'll be free!` : `Damn! Not enough signal to send my message.`;
        text += `<br>I have to use my <b>compass</b> to find the exit, pointing in blue direction`;
    }
    $('text').innerHTML = text;
}

function stopPause() {
    document.body.classList.remove('pause');
    isGamePaused = false;
    if(gamePhase === 2) {
        startTextPhase();
    }
    if(gamePhase === 3) {
        startCompassPhase();
    }
}

function endLevel() {
    restartGame();
}

function gameOver() {
    restartGame();
}
initGame();