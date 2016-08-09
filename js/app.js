
//still would like to do:
//fix subclass and constructors!
//add things to catch
//and reaction upon collision.
/* Welcome! This is the third project for Udacity's Front-End Developer Nanodegree progrom.
Create a frogger-style game using Object Oriented JavaScript and
HTML5 Canvas.
Students are provided with images and a game loop engine, and must build the game from there.*/
// Constant variables
// player location variables

'use strict';

var playerX = 200;
var playerY = 400;

//speed variables
var minSpeed = 150;
var maxSpeed = 500;

// -Player Image
var player_sprite = 'images/char-boy.png';

// Global arrays for enemy
var bug = 'images/enemy-bug.png';
var height = [68, 151, 234];

//global variable for lives and score
var livesRemaining = 10;
var pointsScored = 0;

//random number method
var randInt = function (min, max) {

    return Math.floor(Math.random() * (max-min)) + min;
};


//Human super class
var Human = function(x, y, img) {

    this.x = x;
    this.y = y;
    this.sprite = img;
};


// Draw the objects on the screen, required method for game
Human.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite),this.x,this.y);
};


//Enemy class
var Enemy = function(x, y, speed) {
    Human.call(this, x, y, 'images/enemy-bug.png');
    this.speed = randInt(minSpeed,maxSpeed);
    this.x = -100;
    this.y = height[Math.floor(Math.random() * 3)];


};

// Creates an Enemy object as a subclass of human
Enemy.prototype = Object.create(Human.prototype);
Enemy.prototype.constructor = Enemy;


// Resets player position after getting hit by bug
Enemy.prototype.collision = function() {
    player.x = 2;
    player.y = 4;

    //------add flash message function in here()
    // lives decrease when they get hit by bug
    livesRemaining = livesRemaining - 1;
    lives.update(livesRemaining);
    //ends game and shows game over screen w/ score if lives reach 0
    if (livesRemaining === 0) {
        document.write(
            "<h1 style= 'text-align: center'>GAME OVER!</h1>" +
            "<h2 style= 'text-align: center'>Your score was " + pointsScored + "</h2>" +
            "<h3 style= 'text-align: center'>Keep track of your high score and refresh page to play again.</h3>");
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += this.speed * dt;

    // accident with the enemy
    if (this.x - playerX < 40 && this.x - playerX > 0 && this.y === playerY) {
        this.collision();
    }

    // resets enemy when they cross the screen
    if (this.x > 500) {
        this.x = -100;
        // Randomize which line bug appears on.
        this.y = height[Math.floor(Math.random() * 3)];
    }
};





// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    Human.call(this, x, y, 'images/char-boy.png');


     this.x = playerX;
     this.y = playerY;

};
Player.prototype = Object.create(Human.prototype);
Player.prototype.constructor = Player;


//Resets player position when they reach
// the water and increases their score.
Player.prototype.update = function(dt) {

    playerX = this.x;
    playerY = this.y;
    if (playerY < 60) {
        this.success();
    }
};

//increases their score
Player.prototype.success = function() {
    this.x = 200;
    this.y = 400;
    pointsScored = pointsScored + 1;
    score.update(pointsScored);

};


//Moves player and keeps them from going of off the canvas
Player.prototype.handleInput = function(keys) {

    if (keys === "left" && this.x > 0) {
        this.x = this.x - 100;
    }
    if (keys === "right" && this.x < 400) {
        this.x = this.x + 100;
    }
    if (keys === "up" && this.y > 0) {
        this.y = this.y - 83;
    }
    if (keys === "down" && this.y < 400) {
        this.y = this.y + 83;
    }

    if (keys != "down" && keys != "up" && keys != "right" && keys != "left") {
        alert("Please use the arrow keys to move around the board");
    }
};


// Score function
var Score = function() {
    this.doc = document;
    this.scoreHeading = this.doc.createElement('h2');
    this.doc.body.appendChild(this.scoreHeading);
    this.node = this.doc.createTextNode("Score: " + pointsScored);
    this.scoreHeading.appendChild(this.node);
    document.getElementsByTagName("h2")[0].setAttribute("class", "demoClass");

    // $('h2').offset().left;

};

Score.prototype.update = function(pointsScored) {
    this.h2 = this.doc.getElementsByTagName('h2');
    this.h2[1].firstChild.nodeValue = "Score: " + pointsScored;
    document.getElementsByTagName("h2")[0].setAttribute("class", "demoClass");

};

// Lives function
var Lives = function() {
    this.doc = document;
    this.livesHeading = this.doc.createElement('h2');
    this.doc.body.appendChild(this.livesHeading);
    this.node = this.doc.createTextNode("Lives: " + livesRemaining);
    //h2.setAttribute("style", "vertical-align:center; font-size:2em;");
    this.livesHeading.appendChild(this.node);
    document.getElementsByTagName("h2")[0].setAttribute("class", "demoClass");


};

Lives.prototype.update = function(livesRemaining) {
    this.h2 = this.doc.getElementsByTagName('h2');
    this.h2[0].firstChild.nodeValue = "Lives: " + livesRemaining;
    document.getElementsByTagName("h2")[0].setAttribute("class", "demoClass");


};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var enemy = new Enemy();
for (var i = 0; i <= 4; i++) {
    enemy = new Enemy();
    allEnemies[i] = new Enemy();
    allEnemies.push(enemy);
}
var player = new Player();
var lives = new Lives();
var score = new Score();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});