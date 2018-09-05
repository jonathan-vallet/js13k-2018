function drawShadow() {
    gameContext.save();
    shadowList.forEach(shadow => {
        var distance = Math.sqrt(Math.pow(mapOffsetY + shadow.y - playerOffsetY - lightOffsetY, 2) + Math.pow(mapOffsetX + shadow.x - playerOffsetX - lightOffsetX, 2));
        var activeDistance = isTorchLit ? LIGHT_LIT_RADIUS : LIGHT_RADIUS;

        if(distance < 20) {
            gameOver();
            return;
        }
        if(distance < activeDistance - 5) {
            if(!shadow.v) {
                shadow.v = +new Date() + 1000;
            }
            
            if(now >= shadow.v) {
                var angle = Math.atan2(mapOffsetY + shadow.y - playerOffsetY, mapOffsetX + shadow.x - playerOffsetX);
                shadow.x -= SHADOW_SPEED * Math.cos(angle);
                shadow.y -= SHADOW_SPEED * Math.sin(angle);
            }
            gameContext.beginPath();
            gameContext.fillStyle = "#600";
            gameContext.arc(canvasCenterX + mapOffsetX + shadow.x, canvasCenterY + mapOffsetY + shadow.y, 8, 0, 2 * Math.PI, false);
            gameContext.fill();
        } 
        if(shadow.v){
            gameContext.beginPath();
            gameContext.fillStyle = "#fff";
            gameContext.arc(canvasCenterX + mapOffsetX + shadow.x + 2, canvasCenterY + mapOffsetY + shadow.y, 1, 0, 2 * Math.PI, false);
            gameContext.arc(canvasCenterX + mapOffsetX + shadow.x - 2, canvasCenterY + mapOffsetY + shadow.y, 1, 0, 2 * Math.PI, false);
            gameContext.fill();
        }
    });
    gameContext.restore();
}
