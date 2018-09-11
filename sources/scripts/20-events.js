$('phone-light').onclick = () => {
    if(!isGamePaused) {
        isTorchLit = !isTorchLit;
    }
};

$('phone-camera').onclick = () => {
    if(!isGamePaused) {
        flash();
    }
};

var notesTimeout;
var settingTimeout;
var musicTimeout;
$('phone-notes').onclick = () => {
    $('music').classList.remove('visible');
    $('settings').classList.remove('visible');
    $('notes').classList.toggle('visible');
    clearTimeout(notesTimeout);
    notesTimeout = setTimeout(() => {
        $('notes').classList.remove('visible');
    }, 5000);
};
$('phone-settings').onclick = () => {
    $('music').classList.remove('visible');
    $('notes').classList.remove('visible');
    $('settings').classList.toggle('visible');
    clearTimeout(settingTimeout);
    settingTimeout = setTimeout(() => {
        $('settings').classList.remove('visible');
    }, 5000);
};
$('phone-sound').onclick = () => {
    $('music').classList.toggle('visible');
    $('settings').classList.remove('visible');
    $('notes').classList.remove('visible');
    clearTimeout(musicTimeout);
    musicTimeout = setTimeout(() => {
        $('music').classList.remove('visible');
    }, 5000);
};

function flash() {
    if(flashingDelay === 100) {
        isFlashing = true;
        flashingDuration = 0;
        $flashProgress.classList.add('off');
        $flashProgress.value = 0;
        flashingDelay = 0;
    }
}

document.onkeydown = function(e){
    var code = e.keyCode;
    var key = e.key.toLowerCase();

    if(isGamePaused) {
        if(code === 13) {
            stopPause();
        }
        return;
    }

    if(gamePhase === 2) {
        checkText(e.key);
        var letter = $('iphone-keyboard').querySelector('button[data-char="' + e.key.toUpperCase() + '"')
        letter && letter.classList.add('active');
    } else {
        if (code === 39 || key === 'd') {
            goRight = 1;
        } else if (code === 37 || key === 'q' || key === 'a') {
            xDirection = -1;
            goLeft = 1;
        }
        if (code === 38 || key === 'z' || key === 'w') {
            goTop = 1;
        } else if (code === 40 || key === 's') {
            goBottom = 1;
        }
        if(xDirection !== 0 || yDirection !== 0) {
            $gameCanvas.classList.add(e.shiftKey ? 'sprinting' : 'moving');
            if(e.shiftKey && (isSprintAvailable || sprintRemaining > SPRINT_PERCENT_REQUIRED)) {
                isSprinting = true;
            }
        }
    }
};


document.onkeypress = function(e){
    if(gamePhase !== 2 && !isGamePaused) {
        if(e.key.toLowerCase() === 'f') {
            isTorchLit = !isTorchLit;
        }
        if(e.keyCode === 32) {
            flash();
        }
    }
}

document.onkeyup = function(e){
    var code = e.keyCode;
    var key = e.key.toLowerCase();
    
    if (code === 39 || key === 'd') {
        goRight = 0;
    } else if (code === 37 || key === 'q' || key === 'a') {
        goLeft = 0;
    }
    if (code === 38 || key === 'z' || key === 'w') {
        goTop = 0;
    } else if (code === 40 || key === 's') {
        goBottom = 0;
    }
    if(!e.shiftKey) {
        isSprinting = false;
    }
    $gameCanvas.classList.remove('moving', 'sprinting');

    if(gamePhase === 2) {
        var letter = $('iphone-keyboard').querySelector('button[data-char="' + e.key.toUpperCase() + '"')
        letter && letter.classList.remove('active');
    }
};

window.addEventListener('resize', function(k) {
    checkSize();
});