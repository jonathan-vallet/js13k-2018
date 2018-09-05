// Find intersection of RAY & SEGMENT
function getIntersection(ray, segment) {
    // RAY in parametric: Point + Delta*T1
    var r_px = ray[0].x;
    var r_py = ray[0].y;
    var r_dx = ray[1].x-ray[0].x;
    var r_dy = ray[1].y-ray[0].y;
    // SEGMENT in parametric: Point + Delta*T2
    var s_px = segment[0].x;
    var s_py = segment[0].y;
    var s_dx = segment[1].x-segment[0].x;
    var s_dy = segment[1].y-segment[0].y;

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

const CHECK_LIGHT_RADIUS = 700;
function getSightPolygon(sightX, sightY){
    var pointList =[];
    var pointKeyList = [];
    // add points in player bounding view. exclude all points out of bounds for improved performance
    
    roomList.forEach(room => {
        room.forEach(point => {
            if(pointKeyList.indexOf(point.x + '-' + point.y) < 0) {
                if((point.x + CHECK_LIGHT_RADIUS) > (playerOffsetX - mapOffsetX) && (point.x - CHECK_LIGHT_RADIUS) < (playerOffsetX - mapOffsetX) && (point.y + CHECK_LIGHT_RADIUS) > (playerOffsetY - mapOffsetY) && (point.y - CHECK_LIGHT_RADIUS) < (playerOffsetY - mapOffsetY)) {
                    pointKeyList.push(point.x + '-' + point.y);
                    pointList.push(point);
                }
            }
        });
    });

    // Get all angles
    var uniqueAngles = [];
    for(var j=0; j < pointList.length ; ++j) {
        var point = pointList[j];
        var angle = Math.atan2(point.y-sightY, point.x - sightX);
        point.angle = angle;
        uniqueAngles.push(angle - 0.00001, angle, angle + 0.00001);
    }

    // RAYS IN ALL DIRECTIONS
    var intersects = [];
    for(var j=0; j < uniqueAngles.length ; ++j){
        var angle = uniqueAngles[j];

        // Calculate dx & dy from angle
        var dx = Math.cos(angle);
        var dy = Math.sin(angle);

        // Ray from center of screen to player
        var ray = [
            {x:sightX,y:sightY},
            {x:sightX+dx,y:sightY+dy}
        ];

        // Find CLOSEST intersection
        var closestIntersect = null;
        var segment;
        var minX = Math.max(0, playerOffsetX - mapOffsetX - CHECK_LIGHT_RADIUS);
        var maxX = Math.min(1000, playerOffsetX - mapOffsetX + CHECK_LIGHT_RADIUS);
        var minY = Math.max(0, playerOffsetY - mapOffsetY - CHECK_LIGHT_RADIUS);
        var maxY = Math.min(1000, playerOffsetY - mapOffsetY + CHECK_LIGHT_RADIUS);

        roomList.forEach(room => {
            for(var index = 0; index < room.length - 1; ++index){
                segment = [room[index], room[index + 1]];
                // Checks if segment is in bounds
                if(
                    ((segment[0].x + CHECK_LIGHT_RADIUS) > (playerOffsetX - mapOffsetX) && (segment[0].x - CHECK_LIGHT_RADIUS) < (playerOffsetX - mapOffsetX) && (segment[0].y + CHECK_LIGHT_RADIUS) > (playerOffsetY - mapOffsetY) && (segment[0].y - CHECK_LIGHT_RADIUS) < (playerOffsetY - mapOffsetY)) ||
                    ((segment[1].x + CHECK_LIGHT_RADIUS) > (playerOffsetX - mapOffsetX) && (segment[1].x - CHECK_LIGHT_RADIUS) < (playerOffsetX - mapOffsetX) && (segment[1].y + CHECK_LIGHT_RADIUS) > (playerOffsetY - mapOffsetY) && (segment[1].y - CHECK_LIGHT_RADIUS) < (playerOffsetY - mapOffsetY))
                ) {
                    var intersect = getIntersection(ray, segment);
                    if(!intersect) {
                        continue;
                    }
                    if(!closestIntersect || intersect.param<closestIntersect.param){
                        closestIntersect=intersect;
                    }
                }
            }
        });

        // Intersect angle
        if(!closestIntersect) {
            continue;
        }
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

function drawShadows() {
    // Sight Polygons
    var polygons = [getSightPolygon(playerOffsetX - mapOffsetX + lightOffsetX / 8, playerOffsetY - mapOffsetY + lightOffsetY / 8)];

    if(isTorchLit) {
        var fuzzyRadius = 10;
    } else {
        var fuzzyRadius = 7;
    }
    for(var angle=0;angle < Math.PI*2; angle += (Math.PI*2) / 10 ){
        var dx = Math.cos(angle)*fuzzyRadius;
        var dy = Math.sin(angle)*fuzzyRadius;
        polygons.push(getSightPolygon(playerOffsetX - mapOffsetX + lightOffsetX / 8 + dx, playerOffsetY - mapOffsetY + lightOffsetY / 8 + dy));
    };

    // DRAW AS A GIANT POLYGON
    for(var i=1;i < polygons.length; ++i){
        drawPolygon(polygons[i],gameContext,"rgba(255,255,255,0.08)");
    }
    drawPolygon(polygons[0],gameContext, FLOOR_COLOR);
}

function drawPolygon(polygon,gameContext,fillStyle){
    gameContext.fillStyle = fillStyle;
    gameContext.beginPath();
    gameContext.moveTo(canvasCenterX + mapOffsetX + polygon[0].x, canvasCenterY + mapOffsetY +polygon[0].y);
    for(var i=1; i < polygon.length; ++i){
        var intersect = polygon[i];
        gameContext.lineTo(canvasCenterX + mapOffsetX + intersect.x, canvasCenterY + mapOffsetY + intersect.y);
    }
    gameContext.fill();
}