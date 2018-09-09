function startCountdown() {
    var startTime = +new Date();
    countdownInterval = setInterval(function() {
        var remainingTime = Math.max(0, COUNTDOWN_TIME - now + startTime);
        var seconds = Math.floor(remainingTime / 1000 % 100);
        var milliseconds = Math.floor(remainingTime / 10 % 100);
     // Output the result in an element with id="demo"
        $('countdown').innerHTML = '<span>00</span>:<span>' + ('0' + seconds).substr(-2) + '</span>:<span>' + ('0' + milliseconds).substr(-2) + '</span>';
     
     // If the count down is over, write some text 
        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            changePhase();
         }
    }, 10);
}