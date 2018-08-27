function drawShapes() {
    for(var i=0;i<segments.length;++i){
        var segment = segments[i];
        gameContext.strokeStyle = WALL_COLOR;
        gameContext.lineWidth= 4;
        gameContext.beginPath();
        gameContext.moveTo(mapOffsetX + segment.a.x, mapOffsetY + segment.a.y);
        gameContext.lineTo(mapOffsetX + segment.b.x, mapOffsetY + segment.b.y);
        gameContext.stroke();
    }
    gameContext.fill();
}

///////////////////////////////////////////////////////

// DRAWING

function draw(){
    var xMovement = xDirection * (isSprinting ? SPRINT_SPEED: MOVE_SPEED);
    var yMovement = yDirection * (isSprinting ? SPRINT_SPEED: MOVE_SPEED);
    console.log(xDirection, Player.offsetX);
    if(xDirection > 0) {
        if(Player.offsetX < PLAYER_BOX_OFFSET) {
            Player.offsetX += xMovement;
        } else {
            mapOffsetX -= xMovement
        }
    }
    else if(xDirection < 0) {
        if(Player.offsetX > -PLAYER_BOX_OFFSET) {
            Player.offsetX += xMovement;
        } else {
            mapOffsetX -= xMovement
        }
    }
    if(yDirection > 0) {
        if(Player.offsetY < PLAYER_BOX_OFFSET) {
            Player.offsetY += yMovement;
        } else {
            mapOffsetY -= yMovement
        }
    }
    else if(yDirection < 0) {
        if(Player.offsetY > -PLAYER_BOX_OFFSET) {
            Player.offsetY += yMovement;
        } else {
            mapOffsetY -= yMovement
        }
    }

    // Clear canvas
    gameContext.clearRect(0,0,gameCanvas.width,gameCanvas.height);
    gameContext.fillStyle = '#0ff';
    gameContext.fillRect(0,0,gameCanvas.width,gameCanvas.height);
/*
    // Sight Polygons
    var fuzzyRadius = 10;
    var polygons = [getSightPolygon(Player.x,Player.y)];

    for(var angle=0;angle<Math.PI*2;angle+=(Math.PI*2)/10){
        var dx = Math.cos(angle)*fuzzyRadius;
        var dy = Math.sin(angle)*fuzzyRadius;
        polygons.push(getSightPolygon(Player.x+dx,Player.y+dy));
    };

    // DRAW AS A GIANT POLYGON
    for(var i=1;i<polygons.length;i++){
        drawPolygon(polygons[i],gameContext,"rgba(255,255,255,0.08)");
    }
    drawPolygon(polygons[0],gameContext, FLOOR_COLOR);
*/
    drawShapes();

    // Masked Foreground
//    gameContext.globalCompositeOperation = "source-in";
//    gameContext.drawImage(foreground,0,0);
    gameContext.globalCompositeOperation = "source-over";

    // Draw dots / Player
    gameContext.fillStyle = '#F00';
    gameContext.beginPath();
    gameContext.arc(canvasCenterX + Player.offsetX, canvasCenterY + Player.offsetY, 10, 0, 2*Math.PI, false);
    gameContext.fill();
    generateLightFilter();
}

function drawPolygon(polygon,gameContext,fillStyle){
    gameContext.fillStyle = fillStyle;
    gameContext.beginPath();
    gameContext.moveTo(polygon[0].x,polygon[0].y);
    for(var i=1;i<polygon.length;i++){
        var intersect = polygon[i];
        gameContext.lineTo(intersect.x,intersect.y);
    }
    gameContext.fill();
}

// DRAW LOOP
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
function drawLoop(){
    requestAnimationFrame(drawLoop);
    draw();
}
window.onload = function(){
//    foreground.onload = function(){
//        drawLoop();
//    };
//    foreground.src = "images/floor.jpg";
    drawLoop();
};

// MOUSE    
var Player = {
    offsetX: 0,
    offsetY: 0
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