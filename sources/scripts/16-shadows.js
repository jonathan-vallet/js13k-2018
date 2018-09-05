function drawShadow() {
    gameContext.save();
    shadowList.forEach(shadow => {
        var distance = Math.sqrt(Math.pow(mapOffsetY + shadow.y - playerOffsetY, 2) + Math.pow(mapOffsetX + shadow.x - playerOffsetX, 2));
        var activeDistance = isTorchLit ? LIGHT_LIT_RADIUS : LIGHT_RADIUS;
        
        if(distance < 20) {
            gameOver();
            return;
        }
        gameContext.beginPath();
        if(distance < activeDistance - 5) {
            shadow.v = 1;
            var angle = Math.atan2(mapOffsetY + shadow.y - playerOffsetY, mapOffsetX + shadow.x - playerOffsetX);
            shadow.x -= SHADOW_SPEED * Math.cos(angle);
            shadow.y -= SHADOW_SPEED * Math.sin(angle);
            gameContext.fillStyle = "#600";
            gameContext.arc(canvasCenterX + mapOffsetX + shadow.x, canvasCenterY + mapOffsetY + shadow.y, 8, 0, 2 * Math.PI, false);
        } else if(shadow.hasOwnProperty('v')){
            gameContext.fillStyle = "#fff";
            gameContext.arc(canvasCenterX + mapOffsetX + shadow.x + 2, canvasCenterY + mapOffsetY + shadow.y, 1, 0, 2 * Math.PI, false);
            gameContext.arc(canvasCenterX + mapOffsetX + shadow.x - 2, canvasCenterY + mapOffsetY + shadow.y, 1, 0, 2 * Math.PI, false);
        }
        
        gameContext.fill();
    });
    gameContext.restore();
}
