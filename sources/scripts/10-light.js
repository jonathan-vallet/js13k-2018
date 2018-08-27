/**
 * Adds a light filter over canvas
 */
function generateLightFilter() {
    var canvas = document.createElement('canvas');
    canvas.width = gameCanvas.width;
    canvas.height = gameCanvas.height;
    var context = canvas.getContext('2d');
    
    // Gets light radius. Decrease over time, and has a small variation too to simulate firelight effect
//    var lightRadius = Math.max(60, CIRCLE_LIGHT_RADIUS - (gameDuration / 1000 * lightRadiusDecreaseSpeed * (2 - bonusList.light.currentLevel * 0.1) / 2)) - Math.abs((gameDuration / 200) % 10 - 5);
//    var ligthBritghness = Math.max(bonusList.light.currentLevel * 0.05, CIRCLE_LIGHT_BRIGHTNESS - (gameDuration / 1000 * (lightRadiusDecreaseSpeed * CIRCLE_LIGHT_BRIGHTNESS / CIRCLE_LIGHT_RADIUS * (2 - bonusList.light.currentLevel * 0.1) / 2)));
    var lightRadius = CIRCLE_LIGHT_RADIUS;
    var ligthBritghness = CIRCLE_LIGHT_BRIGHTNESS;

    // Fills a rect with opacity reduced of current brightness
    context.fillStyle = 'rgba(0, 0, 0, ' + (1 - ligthBritghness / 100) + ')';
    context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Creates a gradient circle
    var x = canvasCenterX + Player.offsetX;// + Player.width / 2;
    var y = canvasCenterY + Player.offsetY
    var blurGradient = context.createRadialGradient(x, y, 0, x, y, Math.floor(lightRadius * 1000) / 1000);
    blurGradient.addColorStop(0, 'rgba(0,0,0,1)');
    blurGradient.addColorStop(0.8, 'rgba(0,0,0,.95)');
    blurGradient.addColorStop(1, 'rgba(0,0,0,0)');
    // Draw circle in destination-out to free circle of light
    context.fillStyle = blurGradient;
    context.globalCompositeOperation = 'destination-out';
    context.fillRect(x - lightRadius, y - lightRadius, lightRadius * 2, lightRadius * 2);

    gameContext.drawImage(canvas, 0, 0);
}