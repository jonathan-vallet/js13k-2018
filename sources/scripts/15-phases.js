// Text typing phase
function startTextPhase() {
    gamePhase = 2;
    document.body.classList.add('phase-text');
    startCountdown();
}

// Stairs finding with compass phase
function startCompassPhase() {
    gamePhase = 3;
    document.body.classList.remove('phase-text');
    document.body.classList.add('phase-compass');
}