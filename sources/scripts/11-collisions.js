function checkCollision() {
    var xMovement = xDirection * (isSprinting ? SPRINT_SPEED: MOVE_SPEED);
    var yMovement = yDirection * (isSprinting ? SPRINT_SPEED: MOVE_SPEED);
    
    drawMap();
    
    var x = canvasCenterX + playerOffsetX - 11;
    var y = canvasCenterY + playerOffsetY - 11;

    // Gets color data of the zone where the image will be drawn
    var colorData = gameContext.getImageData(x + xMovement, y + yMovement, 22, 22).data;
    if(isColliding(colorData)) {
        if(xDirection !== 0) {
            do {
                xMovement -= xDirection;
                colorData = gameContext.getImageData(x + xMovement, y, 22, 22).data;
            } while(isColliding(colorData) && xMovement * xDirection > 0)
        }
        if(yDirection !== 0) {
            do {
                yMovement -= yDirection;
                colorData = gameContext.getImageData(x, y + yMovement, 22, 22).data;
            } while(isColliding(colorData) && yMovement * yDirection > 0)
        }
    }

    return [xMovement, yMovement];
}


function isColliding(colorData) {
    for (var i = 0; i < colorData.length; i += 4) {
        if(colorData[i] === 102 && colorData[i + 1] === 102 && colorData[i + 2] === 102) {
            return true;
        }
    }
    return false;
}