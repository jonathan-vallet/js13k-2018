var $ = function(id) { return document.getElementById( id ); };
// Elements
var gameWrapper = $('wrapper');
var gameCanvas = $('game');
var signal = $('signal-bar');
var compass = $('compass-pointer-wrapper');

var gameContext = gameCanvas.getContext('2d');

// Global level vars
var shadowList;
var mapOffsetX;
var mapOffsetY;
var isSprinting;
var playerOffsetX;
var playerOffsetY;
var playerRotation; // Player oriention to draw in correc direction while moving and keep rotation after

var playerCanvas; // canvas to draw player image
var playerMovingTime = 0;
var startTime = +new Date();
const FLOOR_COLOR = '#eee';
const WALL_COLOR = '#666';
const PLAYER_BOX_OFFSET = 250;
var canvasCenterX = gameCanvas.width/2;
var canvasCenterY = gameCanvas.height/2;
const CIRCLE_LIGHT_BRIGHTNESS = 0; // Brightness of the scene (opacity of none lightned part)

// Game / Level data
var currentTextIndex = 0;
var gamePhase = 1;
var currentSignalPower = 1;
var signalPosition = {x: 500, y: 250}

// Game state
var isTorchLit = false;
var goLeft = false;
var goRight = false;
var goTop = false;
var goBottom = false;
var lightOffsetX = 0;
var lightOffsetY = 0;
var now = +new Date();
var frameDuration = 0;
var xDirection = 0;
var yDirection = 0;


// Gameplay (level design var to ajust)
var countdownTime = '15000';
const MOVE_SPEED = 1.5;
const SPRINT_SPEED = 4;
const SHADOW_SPEED = 2.2;
const LIGHT_RADIUS = 100;
const LIGHT_LIT_RADIUS = 180;



var textList = [
    "Hello from the other side",
    "I must have called a thousand times",

    "I'll send an SOS to the world",
    "I hope that someone gets my...",

    "I'm still standing yeah yeah yeah",

    "Hello darkness, my old friend",
    "I've come to talk with you again",

    "Lorem ipsum dolor sit amet,",

    "Mind, use your power",
    "Spirit, use your wings",
    "Freedom",
];

// Map
var roomList = [
    // Border
    [
        {x:0,y:0},
        {x:1000,y:0},
        {x:1000,y:1000},
        {x:0,y:1000},
        {x:0,y:0}
    ],
    [
        {x:0,y: 100},
        {x:75,y:100}
    ],
    [
        {x:125,y: 100},
        {x:225,y:100}
    ],
    [
        {x:200,y: 0},
        {x:200,y:100}
    ],
    [
        {x:275,y: 100},
        {x:350,y:100}
    ],
    [
        {x:350,y: 0},
        {x:350,y:450},
        {x:600,y:450},
        {x:600,y:500},
        {x:800,y:500},
        {x:800,y:525}
    ],
    [
        {x:350,y: 350},
        {x:100,y:350},
        {x:100,y:600},
        {x:225,y:600}
    ],
    [
        {x:225,y: 700},
        {x:100,y:700},
        {x:100,y:900},
        {x:525,y:900}
    ],
    [
        {x:575,y: 900},
        {x:650,y:900},
    ],
    [
        {x:650,y: 1000},
        {x:650,y:775},
    ],
    [
        {x:650,y: 725},
        {x:650,y:700},
    ],
    [
        {x:275,y: 700},
        {x:775,y:700},
    ],
    [
        {x:825,y: 700},
        {x:900,y:700},
    ],
    [
        {x:0,y: 400},
        {x:25,y:400},
    ],
    [
        {x:75,y: 400},
        {x:100,y:400},
    ],
    [
        {x:0,y: 800},
        {x:25,y:800},
    ],
    [
        {x:75,y: 800},
        {x:100,y:800},
    ],
    [
        {x:275,y: 600},
        {x:525,y:600},
    ],
    [
        {x:575,y: 600},
        {x:800,y:600},
        {x:800,y:575},
    ],
    [
        {x:350,y: 600},
        {x:350,y:550},
    ],
    [
        {x:350,y: 500},
        {x:350,y: 450},
    ],
    [
        {x:500,y: 450},
        {x:500,y: 600},
    ],
    [
        {x:450,y: 325},
        {x:450,y: 100},
        {x:800,y:100},
        {x:800,y:175},
    ],
    [
        {x:450,y: 375},
        {x:450,y: 400},
        {x:625,y: 400},
    ],
    [
        {x:675,y: 400},
        {x:700,y: 400},
        {x:700,y: 300},
        {x:800,y: 300},
    ],
    [
        {x:800,y: 225},
        {x:800,y: 500},
    ],
    [
        {x:900,y: 0},
        {x:900,y: 50}
    ],
    [
        {x:600,y: 100},
        {x:600,y: 225},
    ],
    [
        {x:600,y: 275},
        {x:600,y: 400},
    ],
    [
        {x:900,y:100},
        {x:900,y:225},
    ],
    [
        {x:900,y:175},
        {x:1000,y:175},
    ],
    [
        {x:900,y:500},
        {x:1000,y:500},
    ],
    [
        {x:900,y:275},
        {x:900,y:575},
    ],
    [
        {x:900,y:625},
        {x:900,y:900},
        {x:700,y:900},
    ],
    // Adds columns in rooms
    [
        {x:200,y:400},
        {x:250,y:400},
        {x:250,y:500},
        {x:200,y:500},
        {x:200,y:400},
    ],
    [
        {x:100,y:200},
        {x:250,y:200},
        {x:250,y:225},
        {x:100,y:225},
        {x:100,y:200},
    ],
    [
        {x:400,y:900},
        {x:400,y:775},
        {x:450,y:775},
        {x:450,y:900},
    ],
];

var stairs = {x: 970, y: 920, w: 50, h: 75};
