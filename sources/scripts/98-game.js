// Find intersection of RAY & SEGMENT
function getIntersection(ray,segment){

    // RAY in parametric: Point + Delta*T1
    var r_px = ray.a.x;
    var r_py = ray.a.y;
    var r_dx = ray.b.x-ray.a.x;
    var r_dy = ray.b.y-ray.a.y;

    // SEGMENT in parametric: Point + Delta*T2
    var s_px = segment.a.x;
    var s_py = segment.a.y;
    var s_dx = segment.b.x-segment.a.x;
    var s_dy = segment.b.y-segment.a.y;

    // Are they parallel? If so, no intersect
    var r_mag = Math.sqrt(r_dx*r_dx+r_dy*r_dy);
    var s_mag = Math.sqrt(s_dx*s_dx+s_dy*s_dy);
    if(r_dx/r_mag==s_dx/s_mag && r_dy/r_mag==s_dy/s_mag){
        // Unit vectors are the same.
        return null;
    }

    // SOLVE FOR T1 & T2
    // r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
    // ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
    // ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
    // ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
    var T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
    var T1 = (s_px+s_dx*T2-r_px)/r_dx;

    // Must be within parametic whatevers for RAY/SEGMENT
    if(T1<0) return null;
    if(T2<0 || T2>1) return null;

    // Return the POINT OF INTERSECTION
    return {
        x: r_px+r_dx*T1,
        y: r_py+r_dy*T1,
        param: T1
    };

}

function getSightPolygon(sightX,sightY){

    // Get all unique points
    var points = (function(segments){
        var a = [];
        segments.forEach(function(seg){
            a.push(seg.a,seg.b);
        });
        return a;
    })(segments);
    var uniquePoints = (function(points){
        var set = {};
        return points.filter(function(p){
            var key = p.x+","+p.y;
            if(key in set){
                return false;
            }else{
                set[key]=true;
                return true;
            }
        });
    })(points);

    // Get all angles
    var uniqueAngles = [];
    for(var j=0;j<uniquePoints.length;j++){
        var uniquePoint = uniquePoints[j];
        var angle = Math.atan2(uniquePoint.y-sightY,uniquePoint.x-sightX);
        uniquePoint.angle = angle;
        uniqueAngles.push(angle-0.00001,angle,angle+0.00001);
    }

    // RAYS IN ALL DIRECTIONS
    var intersects = [];
    for(var j=0;j<uniqueAngles.length;j++){
        var angle = uniqueAngles[j];

        // Calculate dx & dy from angle
        var dx = Math.cos(angle);
        var dy = Math.sin(angle);

        // Ray from center of screen to mouse
        var ray = {
            a:{x:sightX,y:sightY},
            b:{x:sightX+dx,y:sightY+dy}
        };

        // Find CLOSEST intersection
        var closestIntersect = null;
        for(var i=0;i<segments.length;i++){
            var intersect = getIntersection(ray,segments[i]);
            if(!intersect) continue;
            if(!closestIntersect || intersect.param<closestIntersect.param){
                closestIntersect=intersect;
            }
        }

        // Intersect angle
        if(!closestIntersect) continue;
        closestIntersect.angle = angle;

        // Add to list of intersects
        intersects.push(closestIntersect);

    }

    // Sort intersects by angle
    intersects = intersects.sort(function(a,b){
        return a.angle-b.angle;
    });

    // Polygon is intersects, in order of angle
    return intersects;

}

function drawShapes() {
    for(var i=0;i<segments.length;++i){
        var segment = segments[i];
        gameContext.strokeStyle = WALL_COLOR;
        gameContext.lineWidth=3;
        gameContext.beginPath();
        gameContext.moveTo(segment.a.x, segment.a.y);
        gameContext.lineTo(segment.b.x, segment.b.y);
        gameContext.stroke();
    }
    gameContext.fill();
}

///////////////////////////////////////////////////////

// DRAWING
var gameWrapper = document.getElementById('wrapper');
var gameCanvas = document.getElementById('game');
var gameContext = gameCanvas.getContext('2d');
var foreground = new Image();
var xDirection = 0;
var yDirection = 0;
var isSprinting = false;
const MOVE_SPEED = 1;
const SPRINT_SPEED = 2.5;
const FLOOR_COLOR = '#666';
const WALL_COLOR = '#ccc';
function draw(){
    Player.x += xDirection * (isSprinting ? SPRINT_SPEED: MOVE_SPEED);
    Player.y += yDirection * (isSprinting ? SPRINT_SPEED: MOVE_SPEED);

    // Clear canvas
    gameContext.clearRect(0,0,gameCanvas.width,gameCanvas.height);

    // Sight Polygons
    var fuzzyRadius = 10;
    var polygons = [getSightPolygon(Player.x,Player.y)];

    for(var angle=0;angle<Math.PI*2;angle+=(Math.PI*2)/10){
        var dx = Math.cos(angle)*fuzzyRadius;
        var dy = Math.sin(angle)*fuzzyRadius;
        polygons.push(getSightPolygon(Player.x+dx,Player.y+dy));
    };

    // DRAW AS A GIANT POLYGON
    for(var i=1;i<polygons.length;i++){
        drawPolygon(polygons[i],gameContext,"rgba(255,255,255,0.08)");
    }
    drawPolygon(polygons[0],gameContext, FLOOR_COLOR);

    drawShapes();

    // Masked Foreground
//    gameContext.globalCompositeOperation = "source-in";
//    gameContext.drawImage(foreground,0,0);
    gameContext.globalCompositeOperation = "source-over";

    // Draw dots / Player
    gameContext.fillStyle = '#000';
    gameContext.beginPath();
    gameContext.arc(Player.x, Player.y, 10, 0, 2*Math.PI, false);
    gameContext.fill();
    generateLightFilter();
}

function drawPolygon(polygon,gameContext,fillStyle){
    gameContext.fillStyle = fillStyle;
    gameContext.beginPath();
    gameContext.moveTo(polygon[0].x,polygon[0].y);
    for(var i=1;i<polygon.length;i++){
        var intersect = polygon[i];
        gameContext.lineTo(intersect.x,intersect.y);
    }
    gameContext.fill();
}

// LINE SEGMENTS
var segments = [

    // Border
    {a:{x:0,y:0}, b:{x:840,y:0}},
    {a:{x:840,y:0}, b:{x:840,y:360}},
    {a:{x:840,y:360}, b:{x:0,y:360}},
    {a:{x:0,y:360}, b:{x:0,y:0}},

    // Polygon #1
    {a:{x:100,y:150}, b:{x:100,y:50}},
    {a:{x:100,y:50}, b:{x:200,y:50}},
    {a:{x:200,y:50}, b:{x:200,y:210}},
    {a:{x:200,y:210}, b:{x:100,y:210}},
    {a:{x:100,y:210}, b:{x:100,y:200}},

    // Polygon #2
    {a:{x:300,y:100}, b:{x:300,y:250}},
    {a:{x:300,y:300}, b:{x:300,y:420}},
    {a:{x:300,y:420}, b:{x:450,y:420}},
    {a:{x:450,y:420}, b:{x:450,y:100}},
    {a:{x:450,y:100}, b:{x:300,y:100}}
];

// DRAW LOOP
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
function drawLoop(){
    requestAnimationFrame(drawLoop);
    draw();
}
window.onload = function(){
//    foreground.onload = function(){
//        drawLoop();
//    };
//    foreground.src = "images/floor.jpg";
    drawLoop();
};

// MOUSE    
var Player = {
    x: gameCanvas.width/2,
    y: gameCanvas.height/2
};

document.onkeydown = function(e){
    var code = e.keyCode;
    var isMoving = false;
    if (e.keyCode === 39) {
        xDirection = 1;
        isMoving = true;
    } else if (e.keyCode === 37) {
        xDirection = -1;
    }
    if (e.keyCode === 38) {
        yDirection = -1;
    } else if (e.keyCode === 40) {
        yDirection = 1;
    }
    if(xDirection !== 0 || yDirection !== 0) {
        gameCanvas.classList.add(e.shiftKey ? 'sprinting' : 'moving');
        if(e.shiftKey) {
            isSprinting = true;
        }
    }
};

document.onkeyup = function(e){
    var code = e.keyCode;
    if (e.keyCode === 39) {
        xDirection = 0;
    } else if (e.keyCode === 37) {
        xDirection = 0;
    }
    if (e.keyCode === 38) {
        yDirection = 0;
    } else if (e.keyCode === 40) {
        yDirection = 0;
    }
    if(!e.shiftKey) {
        isSprinting = false;
    }
    gameCanvas.classList.remove('moving', 'sprinting');
};


const CIRCLE_LIGHT_RADIUS = 80; // Radius of light circle, in pixels
const CIRCLE_LIGHT_BRIGHTNESS = 0; // Brightness of the scene (opacity of none lightned part)
/**
 * Adds a filter over 
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
    var x = Player.x;// + Player.width / 2;
    var blurGradient = context.createRadialGradient(x, Player.y, 0, x, Player.y, Math.floor(lightRadius * 1000) / 1000);
    blurGradient.addColorStop(0, 'rgba(0,0,0,1)');
    blurGradient.addColorStop(0.8, 'rgba(0,0,0,.95)');
    blurGradient.addColorStop(1, 'rgba(0,0,0,0)');
    // Draw circle in destination-out to free circle of light
    context.fillStyle = blurGradient;
    context.globalCompositeOperation = 'destination-out';
    context.fillRect(x - lightRadius, Player.y - lightRadius, lightRadius * 2, lightRadius * 2);

    gameContext.drawImage(canvas, 0, 0);
}

window.addEventListener('resize', function(k) {
    checkSize();
});
checkSize();