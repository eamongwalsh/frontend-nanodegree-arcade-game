//Initialise scores

var gameScore = 0;
var gameLives = 10;

var SCORE_SOUND = new Audio('sounds/woohoo.wav');
var FISH_SOUND = new Audio('sounds/success.wav');
var ENEMY_SOUND = new Audio('sounds/yikes.wav');
var GAMEOVER_SOUND = new Audio('sounds/gameover.wav');

// Create a superclass character object
// If I had more time I could refactor my code to use this superclass for all methods, however just to demonstrate this and subclasses I am just going to use it to create a subclass for the render method
var Character = function(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};

//Pseudoclass render method
Character.prototype.render = function() {
    'use strict';
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemy class and methods below
var Enemy = function(x,y) {
    'use strict';
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;

    // Set the speed of the enemies - played around with this until just right!
    this.rate = 100 + Math.floor(Math.random() * 150);
};

//Create a subclass to grab the render method from SuperClass "Character"
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    'use strict';
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (dt * this.rate);

    // When bug goes off on the right, make it re-appear on the left
    if (this.x > 500){
      this.x = -101;
    }

};

// Fish class and methods below
var Fish = function(x,y) {
    'use strict';
    this.sprite = 'images/char-fish.png';
    this.x = x;
    this.y = y;

    // Set the speed of the fish - played around with this until just right!
    this.rate = 100 + Math.floor(Math.random() * 50);
};

//Create a subclass to grab the render method from SuperClass "Character"
Fish.prototype = Object.create(Character.prototype);
Fish.prototype.constructor = Fish;

// Update the fish's position
Fish.prototype.update = function(dt) {
    'use strict';
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers. And fish goes the opposite direction!
    this.x = this.x - (dt * this.rate);
};

// Player class and methods below

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    'use strict';
    this.sprite = 'images/char-boy.png';

    // Place player at starting position
    this.x = 201;
    this.y = 383;
    this.isgameOver = false;
};

//Create a subclass to grab the render method from SuperClass "Character"
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(dt) {
     'use strict';

    // Reset the Player to initial position when he/she reaches the water
    // and increase game score by one point!
    if (this.y <= 0) {
        this.reset();
        gameScore = gameScore + 1;
        document.getElementById("gamescore").innerHTML = "Score: " + gameScore;

        SCORE_SOUND.play();
    }

};

//Check for collisions with the enemy!
Player.prototype.checkCollisions = function() {
    'use strict';

    if (gameLives <= 0) {
        GAMEOVER_SOUND.play();
        gameOver();
    }

    for (var enemy = 0; enemy < allEnemies.length; enemy++) {
        if (player.x < (Math.floor(allEnemies[enemy].x) + 30) && (player.x > Math.floor(allEnemies[enemy].x) - 30) &&
                player.y == allEnemies[enemy].y) {

            ENEMY_SOUND.play();

            //Player loses a life
            gameLives = gameLives - 1;
            document.getElementById("lives").innerHTML = "Lives: " + gameLives;
            this.reset();

        }//end if
    }//end for loop
};

//Check if the player catches any fish!
Player.prototype.catchFish = function() {

    'use strict';
    if (player.x < (Math.floor(fish.x) + 50) && (player.x > Math.floor(fish.x) - 50) &&
        (player.y + 83) == fish.y ) {

            gameScore = gameScore + 10;
            document.getElementById("gamescore").innerHTML = "Score: " + gameScore;

            //Move fish offscreen after fish is caught
            fish.x = -100;
            FISH_SOUND.play();

        }//end if
};

Player.prototype.reset = function() {
    'use strict';
    // Place player at starting position
    this.x = 201;
    this.y = 383;

    //Add another bonus opportunity!
    fish.x = 551;

};

Player.prototype.handleInput = function(key) {
    'use strict';
    //Handle player movement here
    switch(key) {
    case 'up':
      if (this.y > 0){
        this.y -= 83;
      }
      break;
    case 'down':
      if (this.y < 383) {
        this.y += 83;
      }
      break;
    case 'left':
      if (this.x > 0) {
        this.x -= 101;
      }
      break;
    case 'right':
      if (this.x < 403){
        this.x += 101;
      }
      break;
    }
    // Useful to find out where player is when debugging
    // console.log("Position: x " + this.x + " and y " + this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();

//Place a fish in the water - if player catches a fish they get a bonus!
var fish = new Fish(551,134);

var bug1 = new Enemy(-101,134);
var bug2 = new Enemy(-101,217);
var bug3 = new Enemy(-101,300);
var bug4 = new Enemy(-301,217);
var bug5 = new Enemy(-501,300);
var bug6 = new Enemy(-401,134);

allEnemies = [bug1, bug2, bug3, bug4, bug5, bug6];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    'use strict';
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

function gameOver() {
    'use strict';
    allEnemies.forEach(function(enemy) {
            enemy.rate = 0;
        });
    fish.rate = 0;

    document.getElementById("gamestop").innerHTML = "REFRESH SCREEN TO PLAY AGAIN!";

    //Set the isgameOver player property to true
    player.isgameOver = true;
};