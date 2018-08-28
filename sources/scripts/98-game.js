function drawRooms() {
    roomList.forEach((room) => {
        gameContext.strokeStyle = WALL_COLOR;
        gameContext.lineWidth= 6;
        room.forEach((point, index) => {
            if(index === 0) {
                gameContext.beginPath();
                gameContext.moveTo(canvasCenterX + mapOffsetX + point.x, canvasCenterY + mapOffsetY + point.y);
            } else {
                gameContext.lineTo(canvasCenterX + mapOffsetX + point.x, canvasCenterY + mapOffsetY + point.y);
            }
            if(index === room.length -1) {
                gameContext.stroke();
            }
        });
    });
}

function isColliding() {
    // Gets color data of the zone where the image will be drawn
    var colorData = gameContext.getImageData(canvasCenterX + playerOffsetX - 10, canvasCenterY + playerOffsetY - 10, 20, 20).data;
    // Counts the number of pixels filled with our unique color
    var wallPixelNumber = 0;
    // TODO: set walls color in hexadecimal, or get dynamic value here if walls
    // are changing color!
    for (var i = 0; i < colorData.length; i += 4) {
        if(colorData[i] === 102 && colorData[i + 1] === 102 && colorData[i + 2] === 102) {
            return true;
        }
    }

    return false;
}

// DRAWING
function draw(){
    // Clear canvas
    gameContext.clearRect(0,0,gameCanvas.width,gameCanvas.height);
    gameContext.fillStyle = '#000';
    gameContext.fillRect(0,0,gameCanvas.width,gameCanvas.height);
    
    // Sets new player position
    var xMovement = xDirection * (isSprinting ? SPRINT_SPEED: MOVE_SPEED);
    var yMovement = yDirection * (isSprinting ? SPRINT_SPEED: MOVE_SPEED);
    var lightMovement =  frameDuration / 30;

    // First draw walls to detect collisions
    drawRooms();
    if(xDirection > 0) {
        if(playerOffsetX < PLAYER_BOX_OFFSET) {
            playerOffsetX += xMovement;
            if(isColliding()) {
                playerOffsetX -= xMovement;
            }
        } else {
            mapOffsetX -= xMovement;
            if(isColliding()) {
                mapOffsetX += xMovement;
            }
        }
        lightOffsetX = Math.min(lightOffsetX + lightMovement, 20);
    }
    else if(xDirection < 0) {
        if(playerOffsetX > -PLAYER_BOX_OFFSET) {
            playerOffsetX += xMovement;
            if(isColliding()) {
                playerOffsetX -= xMovement;
            }
        } else {
            mapOffsetX -= xMovement;
            if(isColliding()) {
                mapOffsetX += xMovement;
            }
        }
        lightOffsetX = Math.max(lightOffsetX - lightMovement, -20);
    } else {
        if(lightOffsetX > 0) {
            lightOffsetX = Math.max(0, lightOffsetX - lightMovement);
        } else {
            lightOffsetX = Math.min(0, lightOffsetX + lightMovement);
        }
    }
    
    if(yDirection > 0) {
        if(playerOffsetY < PLAYER_BOX_OFFSET) {
            playerOffsetY += yMovement;
            if(isColliding()) {
                playerOffsetY -= yMovement;
            }
        } else {
            mapOffsetY -= yMovement;
            if(isColliding()) {
                mapOffsetY += yMovement;
            }
        }
        lightOffsetY = Math.min(lightOffsetY + lightMovement, 20);
    }
    else if(yDirection < 0) {
        if(playerOffsetY > -PLAYER_BOX_OFFSET) {
            playerOffsetY += yMovement;
            if(isColliding()) {
                playerOffsetY -= yMovement;
            }
        } else {
            mapOffsetY -= yMovement;
            if(isColliding()) {
                mapOffsetY += yMovement;
            }
        }
        lightOffsetY = Math.max(lightOffsetY - lightMovement, -20);
    } else {
        if(lightOffsetY > 0) {
            lightOffsetY = Math.max(0, lightOffsetY - lightMovement);
        } else {
            lightOffsetY = Math.min(0, lightOffsetY + lightMovement);
        }
    }
    
    drawShadows();
    drawRooms();

    // Masked Foreground
// gameContext.globalCompositeOperation = "source-in";
// gameContext.drawImage(foreground,0,0);
    gameContext.globalCompositeOperation = "source-over";
    
    // Draw dots / Player
    gameContext.fillStyle = '#F00';
    gameContext.beginPath();
    gameContext.arc(canvasCenterX + playerOffsetX, canvasCenterY + playerOffsetY, 10, 0, 2*Math.PI, false);
    gameContext.fill();

    // Draws signal on floor
    /*gameContext.fillStyle = '#4c4';
    gameContext.beginPath();
    gameContext.arc(canvasCenterX + mapOffsetX + signalPosition.x, canvasCenterY + mapOffsetY + signalPosition.y, 20, 0, 2*Math.PI, false);
    gameContext.fill();*/
    
    updateSignalPower();
    generateLightFilter();
}

function drawShadows() {
    // Sight Polygons
    var polygons = [getSightPolygon(playerOffsetX - mapOffsetX + lightOffsetX / 4, playerOffsetY - mapOffsetY + lightOffsetY / 4)];
    
    if(isTorchLit) {
        var fuzzyRadius = 10;
    } else {
        var fuzzyRadius = 4;
    }
    for(var angle=0;angle < Math.PI*2; angle += (Math.PI*2) / 10 ){
        var dx = Math.cos(angle)*fuzzyRadius;
        var dy = Math.sin(angle)*fuzzyRadius;
        polygons.push(getSightPolygon(playerOffsetX - mapOffsetX + lightOffsetX / 4 + dx, playerOffsetY - mapOffsetY + lightOffsetY / 4 + dy));
    };

    // DRAW AS A GIANT POLYGON
    for(var i=1;i < polygons.length; ++i){
        drawPolygon(polygons[i],gameContext,"rgba(255,255,255,0.08)");
    }
    drawPolygon(polygons[0],gameContext, FLOOR_COLOR);
}

function drawPolygon(polygon,gameContext,fillStyle){
    gameContext.fillStyle = fillStyle;
    gameContext.beginPath();
    gameContext.moveTo(canvasCenterX + mapOffsetX + polygon[0].x, canvasCenterY + mapOffsetY +polygon[0].y);
    for(var i=1; i < polygon.length; ++i){
        var intersect = polygon[i];
        gameContext.lineTo(canvasCenterX + mapOffsetX + intersect.x, canvasCenterY + mapOffsetY + intersect.y);
    }
    gameContext.fill();
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
};

window.addEventListener('resize', function(k) {
    checkSize();
});
checkSize();