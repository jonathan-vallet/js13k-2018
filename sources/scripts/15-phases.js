// Text typing phase
function changePhase() {
    ++gamePhase;
    showIntro();
}


function startTextPhase() {
    document.body.classList.add('phase-text');
    displayText();
    startCountdown();
}

// Stairs finding with compass phase
function startCompassPhase() {
    document.body.classList.remove('phase-text');
    document.body.classList.add('phase-compass');
}