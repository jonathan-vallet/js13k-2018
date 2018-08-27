var gameWrapper = document.getElementById('wrapper');
var gameCanvas = document.getElementById('game');
var gameContext = gameCanvas.getContext('2d');
var foreground = new Image();
var xDirection = 0;
var yDirection = 0;
var mapOffsetX = 0;
var mapOffsetY = 0;
var isSprinting = false;
const MOVE_SPEED = 1;
const SPRINT_SPEED = 2.5;
const FLOOR_COLOR = '#666';
const WALL_COLOR = '#ccc';
const PLAYER_BOX_OFFSET = 250;
var canvasCenterX = gameCanvas.width/2;
var canvasCenterY = gameCanvas.height/2;

const CIRCLE_LIGHT_RADIUS = 80; // Radius of light circle, in pixels
const CIRCLE_LIGHT_BRIGHTNESS = 40; // Brightness of the scene (opacity of none lightned part)

//LINE SEGMENTS
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