//initialise scores

var gameScore = 0;
var gameLives = 10;


// Enemy class and methods below
var Enemy = function(x,y) {
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

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (dt * this.rate);

    // When bug goes off on the right, make it re-appear on the left
    if (this.x > 500){
      this.x = -101;
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Fish class and methods below
var Fish = function(x,y) {

    this.sprite = 'images/char-fish.png';
    this.x = x;
    this.y = y;
    
    // Set the speed of the fish - played around with this until just right!
    this.rate = 100 + Math.floor(Math.random() * 50);
};

// Update the fish's position, 
Fish.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers. And fish goes the opposite direction!
    this.x = this.x - (dt * this.rate);
};

// Draw the fish on the screen, required method for game
Fish.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class and methods below

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    
    // Place player at starting position
    this.x = 201;
    this.y = 383;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x * dt;
    this.y * dt;
    
    // Reset the Player to initial position when he/she reaches the water
    // and increase game score by one point!
    if (this.y <= 0) {
        player.reset();
        gameScore = gameScore + 1;
        document.getElementById("gamescore").innerHTML = "Score: " + gameScore;
    }
    
    if (gameScore == 3) {
        gameOver();
    }

};

Player.prototype.checkCollisions = function() {
    
        var enemyx = [];
            for (var enemy = 0; enemy < allEnemies.length; enemy++) {
                
                /*
                Used while debugging collisions to see where the heck the enemy was!!
                enemyx.push(allEnemies[enemy].x);
                     console.log("Pos len"+enemyx.length)
                        for (var pos=0; pos < enemyx.length; pos++){
                            console.log("Posx " + enemyx[pos]);
                        }
                */
                
                if (player.x < (Math.floor(allEnemies[enemy].x) + 30) && (player.x > Math.floor(allEnemies[enemy].x) - 30) &&
                player.y == allEnemies[enemy].y) {
                        
                        console.log("Reset game as Player x " + player.x + " and enemy x " + Math.floor(allEnemies[enemy].x));
                        //console.log("Player and 1st Enemy y" + player.y + allEnemies[enemy].y);
                        //We have a collision if the X is within +- 10 and y 
                        //console.log("Reset the player!");
                            
                        //Player loses a life
                        gameLives = gameLives - 1;
                        document.getElementById("lives").innerHTML = "Lives: " + gameLives;
                        this.reset();
 
                }//end id
            }//end for loop
}

Player.prototype.catchFish = function() {
    
        //console.log("Fish" + fish.x + " and fishy " + fish.y + player.y)
        if (player.x < (Math.floor(fish.x) + 50) && (player.x > Math.floor(fish.x) - 50) &&
        (player.y + 83) == fish.y ) {
                        
            gameScore = gameScore + 10;
            document.getElementById("gamescore").innerHTML = "Score: " + gameScore;
            
            //Move fish offscreen after fish is caught
            fish.x = -100;
 
            }//end if
}

Player.prototype.reset = function() {
    // Place player at starting position
    this.x = 201;
    this.y = 383;
    
    //Add another bonus opportunity!
    fish.x = 551;
    
};

Player.prototype.handleInput = function(key) {
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
    console.log("Position: x " + this.x + " and y " + this.y);
}


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
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

function gameOver() {
    gameLives = 10;
    gameScore = 0;
 
    document.getElementById("gamescore").innerHTML = "Score: " + gameScore;
    document.getElementById("lives").innerHTML = "Lives: " + gameLives;
    
    ctx.drawImage(Resources.get('images/game-over.jpg'), 200, 200);
}