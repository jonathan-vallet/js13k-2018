function updateSignalPower() {
    // Get signal distance from player
    var distance = Math.sqrt(Math.pow(playerOffsetX - (mapOffsetX + signalPosition.x), 2) + Math.pow(playerOffsetY - (mapOffsetY + signalPosition.y), 2));
    var power;
    if(distance < 50) {
        power = 5;
        changePhase();
    } else if(distance < 250) {
        power = 4;
    } else if(distance < 400) {
        power = 3;
    } else if(distance < 700) {
        power = 2;
    } else {
        power = 1;
    }
    
    if(currentSignalPower === power) {
        return;
    }
    $signal.setAttribute('data-level', power);
    currentSignalPower = power;
}
