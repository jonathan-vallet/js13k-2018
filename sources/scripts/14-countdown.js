function startCountdown() {
    var startTime = +new Date();
    var countdownInterval = setInterval(function() {
        var remainingTime = Math.max(0, countdownTime - now + startTime);
        var seconds = Math.floor(remainingTime / 1000 % 100);
        var milliseconds = Math.floor(remainingTime / 10 % 100);
     // Output the result in an element with id="demo"
        document.querySelector('#countdown').innerHTML = '<span>00</span>:<span>' + ('0' + seconds).substr(-2) + '</span>:<span>' + ('0' + milliseconds).substr(-2) + '</span>';
     
     // If the count down is over, write some text 
        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            startCompassPhase();
         }
    }, 10);
}