function drawShapes() {
    for(var i=0;i<segments.length;++i){
        var segment = segments[i];
        gameContext.strokeStyle = WALL_COLOR;
        gameContext.lineWidth= 8;
        gameContext.beginPath();
        gameContext.moveTo(canvasCenterX + mapOffsetX + segment.a.x, canvasCenterY + mapOffsetY + segment.a.y);
        gameContext.lineTo(canvasCenterX + mapOffsetX + segment.b.x, canvasCenterY + mapOffsetY + segment.b.y);
        gameContext.stroke();
    }
    gameContext.fill();
}

// DRAWING
function draw(){
    var xMovement = xDirection * (isSprinting ? SPRINT_SPEED: MOVE_SPEED);
    var yMovement = yDirection * (isSprinting ? SPRINT_SPEED: MOVE_SPEED);
    var lightMovement =  frameDuration / 30;
    
    if(xDirection > 0) {
        if(playerOffsetX < PLAYER_BOX_OFFSET) {
            playerOffsetX += xMovement;
        } else {
            mapOffsetX -= xMovement;
        }
        xLightOffset = Math.min(xLightOffset + lightMovement, 20);
    }
    else if(xDirection < 0) {
        if(playerOffsetX > -PLAYER_BOX_OFFSET) {
            playerOffsetX += xMovement;
        } else {
            mapOffsetX -= xMovement;
        }
        xLightOffset = Math.max(xLightOffset - lightMovement, -20);
    } else {
        if(xLightOffset > 0) {
            xLightOffset = Math.max(0, xLightOffset - lightMovement);
        } else {
            xLightOffset = Math.min(0, xLightOffset + lightMovement);
        }
    }
    
    if(yDirection > 0) {
        if(playerOffsetY < PLAYER_BOX_OFFSET) {
            playerOffsetY += yMovement;
        } else {
            mapOffsetY -= yMovement
        }
        yLightOffset = Math.min(yLightOffset + lightMovement, 20);
    }
    else if(yDirection < 0) {
        if(playerOffsetY > -PLAYER_BOX_OFFSET) {
            playerOffsetY += yMovement;
        } else {
            mapOffsetY -= yMovement
        }
        yLightOffset = Math.max(yLightOffset - lightMovement, -20);
    } else {
        if(yLightOffset > 0) {
            yLightOffset = Math.max(0, yLightOffset - lightMovement);
        } else {
            yLightOffset = Math.min(0, yLightOffset + lightMovement);
        }
    }

    // Clear canvas
    gameContext.clearRect(0,0,gameCanvas.width,gameCanvas.height);
    gameContext.fillStyle = '#000';
    gameContext.fillRect(0,0,gameCanvas.width,gameCanvas.height);

    // Sight Polygons
    var polygons = [getSightPolygon(playerOffsetX + xLightOffset / 4, playerOffsetY + yLightOffset / 4)];

    for(var angle=0;angle<Math.PI*2;angle+=(Math.PI*2)/10){
        var dx = Math.cos(angle)*fuzzyRadius;
        var dy = Math.sin(angle)*fuzzyRadius;
        polygons.push(getSightPolygon(playerOffsetX + xLightOffset / 4 + dx, playerOffsetY + yLightOffset / 4 + dy));
    };

    // DRAW AS A GIANT POLYGON
    for(var i=1;i<polygons.length;i++){
        drawPolygon(polygons[i],gameContext,"rgba(255,255,255,0.08)");
    }
    drawPolygon(polygons[0],gameContext, FLOOR_COLOR);

    drawShapes();

    // Masked Foreground
//    gameContext.globalCompositeOperation = "source-in";
//    gameContext.drawImage(foreground,0,0);
    gameContext.globalCompositeOperation = "source-over";

    
    // Draw dots / Player
    gameContext.fillStyle = '#F00';
    gameContext.beginPath();
    gameContext.arc(canvasCenterX + playerOffsetX, canvasCenterY + playerOffsetY, 10, 0, 2*Math.PI, false);
    gameContext.fill();
    generateLightFilter();
}

function drawPolygon(polygon,gameContext,fillStyle){
    gameContext.fillStyle = fillStyle;
    gameContext.beginPath();
    gameContext.moveTo(canvasCenterX + mapOffsetX + polygon[0].x, canvasCenterY + mapOffsetY +polygon[0].y);
    for(var i=1;i<polygon.length;i++){
        var intersect = polygon[i];
        gameContext.lineTo(canvasCenterX + mapOffsetX + intersect.x, canvasCenterY + mapOffsetY + intersect.y);
    }
    gameContext.fill();
}

var frameDuration = 0;
// DRAW LOOP
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
function drawLoop(){
    var previousFrameTime = now;
    now = new Date();
    frameDuration = now - previousFrameTime;
    gameDuration = now - startTime;
    requestAnimationFrame(drawLoop);
    draw();
}
window.onload = function(){
//    foreground.onload = function(){
//        drawLoop();
//    };
//    foreground.src = "images/floor.jpg";
    startTime = +new Date();
    gameDuration = 0;
    drawLoop();
};

document.querySelector('.phone-light').onclick = () => {
    if(circleLightRadius === 150) {
        circleLightRadius = 80;
        fuzzyRadius = 4;
    } else {
        circleLightRadius = 150;
        fuzzyRadius = 10;
    }
};

document.onkeydown = function(e){
    var code = e.keyCode;
    var isMoving = false;
    if (e.keyCode === 39) {
        xDirection = 1;
        isMoving = true;
    } else if (e.keyCode === 37) {
        xDirection = -1;
    }
    if (e.keyCode === 38) {
        yDirection = -1;
    } else if (e.keyCode === 40) {
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
    if (e.keyCode === 39) {
        xDirection = 0;
    } else if (e.keyCode === 37) {
        xDirection = 0;
    }
    if (e.keyCode === 38) {
        yDirection = 0;
    } else if (e.keyCode === 40) {
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