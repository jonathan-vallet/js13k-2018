function checkSize() {
    var ww = window.innerWidth;
    var wh = window.innerHeight;

    var GAME_WIDTH = 1400;
    var GAME_HEIGHT = 1000;

    var scaleX = GAME_WIDTH / ww;
    var scaleY = (GAME_HEIGHT + 20) / wh;
    var gameScale = Math.min(1.2, 1 / Math.max(scaleX, scaleY));

    gameWrapper.style.webkitTransform = gameWrapper.style.transform = 'scale(' + gameScale + ')';
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
    return this;
}