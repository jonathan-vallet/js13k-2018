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
    gameContext.clearRect(0,0,$gameCanvas.width,$gameCanvas.height);
    gameContext.fillStyle = '#000';
    gameContext.fillRect(0,0,$gameCanvas.width,$gameCanvas.height);
    
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

    if(flashingDelay < 100) {
        flashingDelay = Math.min(100, flashingDelay + frameDuration / FLASHING_REGEN_TIME);
        $flashProgress.value = flashingDelay;
        if(flashingDelay === 100) {
            $flashProgress.classList.remove('off');
        }
    }
    
    drawShadows();
    drawMap();
    
    // Masked Foreground
// gameContext.globalCompositeOperation = "source-in";
// gameContext.drawImage(foreground,0,0);
    gameContext.globalCompositeOperation = "source-over";
    
    drawPlayer();

    if(isFlashing) {
        flashingDuration += frameDuration;
        if(flashingDuration > FLASH_DURATION) {
            isFlashing = false;
        }
    } else {
        generateLightFilter();
    }
    drawShadow();
    if(gamePhase === 1) {
        updateSignalPower();
        if(!isStairsNotified && isPlayerOnStairs()) {
            isStairsNotified = true;
            showIntro(2);
        }
    } else if(gamePhase === 3) {
        setCompassAngle();
        if(isPlayerOnStairs()) {
            endLevel();
        }
    }    
}

// DRAW LOOP
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
function drawLoop() {
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

function restartGame(isGameOver) {
    isTorchLit = false;
    if(level % 2 === 1) {
        mapOffsetX = -50;
        mapOffsetY = -50;
    } else {
        mapOffsetX = -50;
        mapOffsetY = -950; 
    }
    isSprinting = false;
    playerOffsetX = 0;
    playerOffsetY = 0;
    playerRotation = 0; // Player oriention to draw in correc direction while moving and keep rotation after
    lightRemaining = 100;
    sprintRemaining = 100;
    isSprintAvailable = true;
    isFlashing = false;
    flashingDuration = 0;
    flashingDelay = 100;
    isStairsNotified = false;
    $flashProgress.value = flashingDelay;
    $flashProgress.classList.remove('off');
    shadowList = [
        {x: 80, y: 280},
        {x: 50, y: 700},
        {x: 640, y: 690},
        {x: 450, y: 30},
        {x: 980, y: 520},
        {x: 700, y: 850},
        {x: 480, y: 980},
        {x: 720, y: 450},
        {x: 620, y: 140}
    ];
    if(isGameOver) {
        showIntro(1);
    } else {
        gamePhase = 1;
        document.body.classList.remove('phase-compass');
        showIntro();
    }
}

function initGame() {
    restartGame();
    checkSize();
    initMap();
    initKeyboard();
    initPlayer();
    showIntro();
}

function showIntro(status) {
    document.body.classList.add('pause');
    isGamePaused = true;
    var text = `Ok...<br>
I'm here, alone, with my phone, offline.<br>
<br>
Nothing broken, I can <b>move</b> <em>(arrows, ZQSD, WASD)</em>,<br>
or <b>sprint</b> <em>(shift, controlled by my health app)</em><br>
I can use  my <b>Flashlight</b> <em>(F, or click on the app)</em><br><br>
I have to find network with 5 bars using my <b>phone signal</b><br><br>
I've seen some shadows moving, they seem to be attracted by light.<br>
I should avoid them, or detect them with my <b>camera flash</b> <em>(spacebar, or click on the app)</em>`;
    if(level > 1) {
        text = `I'm on another stage, I have to find the <b>signal</b> on this one before leaving.`;
    } 
    if(status) {
        if(status === 1) {
            text = `That shadow put me back to my initial point.<br>I have to find my way back!`;
        }
        if(status === 2) {
            text = `I have to find a place where signal has 5 bars before leaving this stage`;
        }
        if(status === 3) {
            text = `I have to find a place where signal has 5 bars before leaving this stage`;
        }
    } else {
        if(gamePhase === 2) {
            text = `I've found network!<br>I have to <b>type</b> my message quickly before signal disappear!<br><em>(use keyboard to rewrite text)</em>`;
        }
        if(gamePhase === 3) {
            text = isMessageSent ? `I've send my message! When I'll have left that floor I'll be free!` : `Damn! Not enough signal to send my message.`;
            text += `<br>I have to use my <b>compass</b> to find the exit, pointing in blue direction`;
        }
        if(gamePhase === 4) {
            text = `Congratulations!<br> You are now free, and can go back online!<br><br>Thank you for playing!`;
        }
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
    if(gamePhase == 4) {
        level = 1;
        currentTextIndex = 0;
        gamePhase = 1;
        restartGame();
    }
}

function endLevel() {
    if(isMessageSent) {
        gamePhase = 4;
        showIntro();
        return;
    }
    ++level;
    restartGame();
}

function gameOver() {
    restartGame(true);
}
initGame();