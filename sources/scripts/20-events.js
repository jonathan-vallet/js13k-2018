
$('phone-light').onclick = () => {
    isTorchLit = !isTorchLit;
};

document.onkeydown = function(e){
    var code = e.keyCode;
    if (code === 39) {
        goRight = 1;
    } else if (code === 37) {
        xDirection = -1;
        goLeft = 1;
    }
    if (code === 38) {
        goTop = 1;
    } else if (code === 40) {
        goBottom = 1;
    }
    if(xDirection !== 0 || yDirection !== 0) {
        gameCanvas.classList.add(e.shiftKey ? 'sprinting' : 'moving');
        if(e.shiftKey) {
            isSprinting = true;
        }
    }

    if(gamePhase === 2) {
        checkText(e.key);
        var letter = $('iphone-keyboard').querySelector('button[data-char="' + e.key.toUpperCase() + '"')
        letter && letter.classList.add('active');
    }
};


document.onkeypress = function(e){
    if(e.keyCode === 102) {
        isTorchLit = !isTorchLit;
    }
}

document.onkeyup = function(e){
    var code = e.keyCode;
    if (code === 39) {
        goRight = 0;
    } else if (code === 37) {
        goLeft = 0;
    }
    if (code === 38) {
        goTop = 0;
    } else if (code === 40) {
        goBottom = 0;
    }
    if(!e.shiftKey) {
        isSprinting = false;
    }
    gameCanvas.classList.remove('moving', 'sprinting');

    if(gamePhase === 2) {
        var letter = $('iphone-keyboard').querySelector('button[data-char="' + e.key.toUpperCase() + '"')
        letter && letter.classList.remove('active');
    }
};

window.addEventListener('resize', function(k) {
    checkSize();
});