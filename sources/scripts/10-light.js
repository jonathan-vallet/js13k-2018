/**
 * Adds a light filter over canvas
 */
function generateLightFilter() {
    var canvas = document.createElement('canvas');
    canvas.width = $gameCanvas.width;
    canvas.height = $gameCanvas.height;
    var context = canvas.getContext('2d');
    
    // Gets light radius. Decrease over time, and has a small variation too to simulate firelight effect
    
    if(isTorchLit) {
        var lightRadius = LIGHT_LIT_RADIUS;
        var lightSplash = 0.8;
        lightRemaining = Math.max(0, lightRemaining - frameDuration / LIGHT_DURATION);
        if(lightRemaining <= 0) {
            isTorchLit = false;
        }
    } else {
        var lightRadius = LIGHT_RADIUS;
        var lightSplash = 0.6;
        lightRemaining = Math.min(100, lightRemaining + frameDuration / LIGHT_REGEN_DURATION);
    }
    $lightProgress.value = lightRemaining;
    
    var ligthBritghness = CIRCLE_LIGHT_BRIGHTNESS;

    // Fills a rect with opacity reduced of current brightness
    context.fillStyle = 'rgba(0, 0, 0, ' + (1 - ligthBritghness / 100) + ')';
    context.fillRect(0, 0, $gameCanvas.width, $gameCanvas.height);

    // Creates a gradient circle
    var x = canvasCenterX + playerOffsetX;// + Player.width / 2;
    var y = canvasCenterY + playerOffsetY
    var blurGradient = context.createRadialGradient(x + lightOffsetX, y + lightOffsetY, 0, x + lightOffsetX, y + lightOffsetY, Math.floor(lightRadius * 1000) / 1000);
    blurGradient.addColorStop(0, 'rgba(0,0,0,1)');
    blurGradient.addColorStop(lightSplash, 'rgba(0,0,0,.95)');
    blurGradient.addColorStop(1, 'rgba(0,0,0,0)');
    // Draw circle in destination-out to free circle of light
    context.fillStyle = blurGradient;
    context.globalCompositeOperation = 'destination-out';
    context.fillRect(x - lightRadius + lightOffsetX, y - lightRadius + lightOffsetY, lightRadius * 2, lightRadius * 2);

    gameContext.drawImage(canvas, 0, 0);
}