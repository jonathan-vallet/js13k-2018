function checkSize() {
    var ww = window.innerWidth;
    var wh = window.innerHeight;

    var GAME_WIDTH = 1400;
    var GAME_HEIGHT = 900;

    var scaleX = GAME_WIDTH / ww;
    var scaleY = (GAME_HEIGHT + 20) / wh;
    var gameScale = Math.min(1.2, 1 / Math.max(scaleX, scaleY));

    gameWrapper.style.webkitTransform = gameWrapper.style.transform = 'scale(' + gameScale + ')';
}