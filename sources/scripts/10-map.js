var mapCanvas;
function initMap() {
    initStairs();
    mapCanvas = document.createElement('canvas');
    mapCanvas.width = 1000;
    mapCanvas.height = 1000;
    
    var mapContext = mapCanvas.getContext('2d');
    drawRooms(mapContext);
    drawStairs(mapContext);
}

function initStairs() {
    roomList.push([
        {x: stairs.x - stairs.w / 2, y: stairs.y},
        {x: stairs.x - stairs.w / 2, y: stairs.y + stairs.h},
        {x: stairs.x + stairs.w / 2, y: stairs.y + stairs.h},
        {x: stairs.x + stairs.w / 2, y: stairs.y},
    ])
}

function drawRooms(context) {
    roomList.forEach((room) => {
        context.strokeStyle = WALL_COLOR;
        context.lineWidth= 6;
        room.forEach((point, index) => {
            if(index === 0) {
                context.beginPath();
                context.moveTo(point.x, + point.y);
            } else {
                context.lineTo(point.x, + point.y);
            }
            if(index === room.length -1) {
                context.stroke();
            }
        });
    });
}

function drawStairs(context) {
    var x = stairs.x - stairs.w / 2;
    var y = stairs.y;
    var stairHeight = 15;
    for(var index = 0; index <= 4; ++index) {
        var gradient = context.createLinearGradient(x, y + stairHeight * index, x, y +stairHeight * (index + 1));
        gradient.addColorStop(0, 'black');
        gradient.addColorStop(1, 'white');
        context.fillStyle= gradient;
        context.fillRect(x, y + (stairHeight * index), 50, stairHeight);
    }   
}

function drawMap() {
    gameContext.drawImage(mapCanvas, canvasCenterX + mapOffsetX, canvasCenterY + mapOffsetY);
}

function setCompassAngle() {
    var angle = Math.atan2(mapOffsetY + stairs.y - playerOffsetY, mapOffsetX + stairs.x - playerOffsetX) * 180 / Math.PI - 14;
    compass.style.transform = 'rotate(' + angle + 'deg)';
}

function isPlayerOnStairs() {
    return (playerOffsetX >= (mapOffsetX + stairs.x - stairs.w / 2) && playerOffsetX <= (mapOffsetX + stairs.x + stairs.w / 2) && playerOffsetY >= mapOffsetY + stairs.y + 25);
}