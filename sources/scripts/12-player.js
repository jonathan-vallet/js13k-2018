function drawPlayer() {
    // Draw dots / Player
    var x = canvasCenterX + playerOffsetX;
    var y = canvasCenterY + playerOffsetY;

    if(xDirection !== 0 || yDirection !== 0) {
        playerMovingTime += frameDuration;
        playerRotation = -90 * xDirection;
        if(yDirection !== 0) {
            if(playerRotation === 0) {
                playerRotation = -90 * yDirection + 90;
            } else {
                playerRotation += 45 * yDirection * xDirection;
            }
        }
    } else {
        playerMovingTime = 0;
    }
    var shoulderRotation = Math.sin(Math.floor(playerMovingTime / (isSprinting ? 50 : 150))) * 5;

    gameContext.save();
    gameContext.translate(x, y);
    gameContext.rotate(playerRotation * Math.PI / 180);
    gameContext.rotate(shoulderRotation * Math.PI / 180);
    gameContext.fillStyle = '#444';
    gameContext.roundRect(-15, -6, 30, 12, 20).fill();
    gameContext.rotate(-shoulderRotation * Math.PI / 180);
    gameContext.drawImage(playerCanvas, -25, -25);
    gameContext.restore();
}   

function initPlayer() {
    playerCanvas = document.createElement('canvas');
    playerCanvas.width = 50;
    playerCanvas.height = 50;
    
    var playerContext = playerCanvas.getContext('2d');

    // Hairs
    playerContext.fillStyle = '#A42';
    playerContext.beginPath();
    playerContext.arc(25, 25, 10, 0.75*Math.PI, 2.25*Math.PI, false);
    playerContext.fill();
    
    // head
    playerContext.fillStyle = '#feab75';
    playerContext.globalCompositeOperation = "source-atop";
    playerContext.beginPath();
    playerContext.arc(18.5, 31, 7, 0, 2*Math.PI, false);
    playerContext.arc(31.5, 31, 7, 0, 2*Math.PI, false);
    playerContext.fill();

    playerContext.globalCompositeOperation = "source-over";
    playerContext.beginPath();
    // nose
    playerContext.arc(25, 33, 3, 0, 2*Math.PI, false);
    playerContext.fill();
    
    // eye
    playerContext.fillStyle = '#fff';
    playerContext.beginPath();
    playerContext.arc(20, 30, 2, 0, 2*Math.PI, false);
    playerContext.arc(30, 30, 2, 0, 2*Math.PI, false);
    playerContext.fill();

    // eye color
    playerContext.fillStyle = '#77F';
    playerContext.beginPath();
    playerContext.arc(20, 32, 1, 0, 2*Math.PI, false);
    playerContext.arc(30, 32, 1, 0, 2*Math.PI, false);
    playerContext.fill();

    // eye color
    playerContext.strokeStyle = '#A42';
    playerContext.lineWidth = 1;
    playerContext.beginPath();
    playerContext.arc(20, 30, 2, 1.2*Math.PI, 1.8*Math.PI, false);
    playerContext.stroke();
    playerContext.beginPath();
    playerContext.arc(30, 30, 2, 1.2*Math.PI, 1.8*Math.PI, false);
    playerContext.stroke();
}
