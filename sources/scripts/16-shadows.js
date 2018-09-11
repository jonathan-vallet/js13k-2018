function drawShadow() {
    gameContext.save();
    shadowList.forEach((shadow, index) => {
        var lihgtDistance = Math.sqrt(Math.pow(mapOffsetY + shadow.y - playerOffsetY - lightOffsetY, 2) + Math.pow(mapOffsetX + shadow.x - playerOffsetX - lightOffsetX, 2));
        var playerDistance = Math.sqrt(Math.pow(mapOffsetY + shadow.y - playerOffsetY, 2) + Math.pow(mapOffsetX + shadow.x - playerOffsetX, 2));
        var activeDistance = isFlashing ? FLASH_LIT_RADIUS : isTorchLit ? LIGHT_LIT_RADIUS : LIGHT_RADIUS;

        if(playerDistance < 20) {
            gameOver();
            return;
        }
        if(lihgtDistance < activeDistance - 5) {
            if(!isFlashing) {
                if(!shadow.v) {
                    shadow.v = +new Date() + 1000;
                }

                if(now >= shadow.v) {
                    var angle = Math.atan2(mapOffsetY + shadow.y - playerOffsetY, mapOffsetX + shadow.x - playerOffsetX);
                    shadow.x -= SHADOW_SPEED * Math.cos(angle);
                    shadow.y -= SHADOW_SPEED * Math.sin(angle);
                }
            }
            if(!shadow.s) { // s = shown (revealed by any light)
                shadow.s = true
            }

            gameContext.beginPath();
            gameContext.fillStyle = "#000";
            var x = canvasCenterX + mapOffsetX + shadow.x;
            var y = canvasCenterY + mapOffsetY + shadow.y
            var r = 15;
            var d = Math.abs(Math.floor(now / 200 + index * 2) % 16 - 8) - 4;
            gameContext.moveTo(x - r, y);
            gameContext.bezierCurveTo(x - r, y - r + d, x + r + d, y - r - d, x + r, y);
            gameContext.bezierCurveTo(x + r, y + r -d, x - r, y + r, x - r, y);
//            gameContext.arc(canvasCenterX + mapOffsetX + shadow.x, canvasCenterY + mapOffsetY + shadow.y, 8, 0, 2 * Math.PI, false);
            gameContext.fill();
        }
        if(shadow.s) {
            gameContext.beginPath();
            gameContext.fillStyle = "#fff";
            gameContext.arc(canvasCenterX + mapOffsetX + shadow.x + 2, canvasCenterY + mapOffsetY + shadow.y, 1, 0, 2 * Math.PI, false);
            gameContext.arc(canvasCenterX + mapOffsetX + shadow.x - 2, canvasCenterY + mapOffsetY + shadow.y, 1, 0, 2 * Math.PI, false);
            gameContext.fill();
        }
    });
    gameContext.restore();
}
