// Snake.js
// A Snake game react component.
// 2019.02.13.1 N - Created this file.

import React from 'react';

const pageName = "Snake";

class Snake extends React.Component {
  constructor(props) {
    super(props); // always call super first
    // The more static properties that might be props later
    this.tileSize = 10;
    this.size = 500;
    this.boardSize = this.size / this.tileSize;
    this.tickRate = 1000/15;
    this.playerColor = 'lime';
    this.appleColor = 'red';
    this.backgroundColor = 'black';
    this.state = { // add some changeable variables
      // where the player is
      playerX: 1,
      playerY: 1,
      // where the player is going
      playerVelocityX: 1,
      playerVelocityY: 0,
      // weather or not the game is active
      gameActive: false,
      // weather or not the game has been played
      gameOver: false,
      // where the player has been
      trail: [],
      // how long the player is
      tail: 5,
      // player score and lives left
      score: 0,
      lives: 3,
      // where the apple is, random apple
      appleX: Math.floor(Math.random() * this.boardSize),
      appleY: Math.floor(Math.random() * this.boardSize)
    }
    // Define keys
    this.UP = 'w';
    this.RIGHT = 'd';
    this.LEFT = 'a';
    this.DOWN = 's';
    this.RESTART = 'g';
    // bind the methods that need to be
    this.game = this.game.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.setVelocity = this.setVelocity.bind(this);
    this.drawTiles = this.drawTiles.bind(this);
    this.drawBackground = this.drawBackground.bind(this);
    this.drawStats = this.drawStats.bind(this);
  }
  componentDidMount() {
    // add the key command handler to the window on mount
    window.addEventListener('keydown', this.handleInput);
    // call restart game on mount to show start screen
    this.restartGame();
  }
  startGame() { // only tick game during play
    this.gameInterval = window.setInterval(this.game, this.tickRate);
  }
  stopGame() { // stop game when not in play
    window.clearInterval(this.gameInterval);
  }
  componentWillUnmount() {
    // when unmounting, remove the event listener
    window.removeEventListener('keydown', this.listener);
    // if the game is active, stop ticking
    if(this.state.gameActive) this.stopGame();
  }
  restartGame() {
    // set the state back to the original state
    this.setState({
      // where the player is
      playerX: 1,
      playerY: 1,
      // where the player is going
      playerVelocityX: 1,
      playerVelocityY: 0,
      // weather or not the game is active
      gameActive: false,
      // weather or not the game has been played
      gameOver: false,
      // where the player has been
      trail: [],
      // how long the player is
      tail: 5,
      // player score and lives left
      score: 0,
      lives: 3,
      // where the apple is, random apple
      appleX: Math.floor(Math.random() * this.boardSize),
      appleY: Math.floor(Math.random() * this.boardSize)
    });
    // get context
    let context = this.canvas.getContext('2d');
    // draw the background and scores
    this.drawBackground(context);
    this.drawStats(context);
    // draw start game text
    context.font = "25px bold Arial";
    context.fillStyle=this.playerColor;
    context.fillText(`Press '${this.UP}', '${this.DOWN}', '${this.LEFT}', or '${this.RIGHT}' to start the game :)`, 50, 50);
  }
  drawBackground(context) {
    // draw the canvas background to be black.
    context.fillStyle = this.backgroundColor;
    context.fillRect(0, 0, this.size, this.size);
  }
  game() { // called every game tick
    // at the start of this function, make sure the game is active
    if(!this.state.gameActive) return;
    // values from state we'll be using
    let {
      trail,
      tail,
      score, lives,
      appleX, appleY,
      playerX, playerY,
      playerVelocityX, playerVelocityY
    } = this.state;
    playerX += playerVelocityX;
    playerY += playerVelocityY;
    // Check for boundaries
    // if the player head is left of the left wall
    if(playerX < 0) {
      playerX = this.boardSize - 1; // set the playerX to the tileSize
    }
    // if the player is right of the right wall
    if(playerX > this.boardSize - 1) {
      playerX = 0; // set the player to the start of the board
    }
    // if the player is above the roof
    if(playerY < 0) {
      playerY = this.boardSize - 1; // set the player head at the bottom
    }
    // if the player is below the floor
    if(playerY > this.boardSize - 1) {
      playerY = 0; // set the player at the roof
    }
    // get the context to draw on the canvas with
    let context = this.canvas.getContext('2d');
    this.drawBackground(context);

    // draw the player using the trail array
    for(let i = 0;i<trail.length;i++) {
      this.drawTiles('lime', trail[i].x, trail[i].y);
      // Check for death
      // if the head is where any of the trail (read this trail) then, death!
      // console.log(trail[i].x==playerX&&trail[i].y==playerY)
      if(trail[i].x === playerX && trail[i].y === playerY) {
        // Lose a life
        lives--;
        // reset the tail length
        tail = 5;
        // check for 0 lives
        if(0 >= lives) {
          // set the game to inactive
          this.setState({gameActive:false,gameOver:true});
          this.stopGame();
          // draw game over to the screen
          context.fillStyle="red";
          context.font = "50px bold Arial";
          context.fillText('Game Over', this.size/3, this.size/3);
          context.fillText('Score: ' + score, this.size/3, this.size/3 + 50);
          context.font = "25px bold Arial";
          context.fillText('Press ['+this.RESTART+'] to play again', this.size/3, this.size/3+100)
        }
      }
    }
    // Add the current head to the trail
    trail.push({x:playerX,y:playerY});
    // make sure the player only stays as long as the tail length
    while(trail.length>tail) // while the trail is longer than tail
      trail.shift(); // remove item from trail

    // Deal with Apples
    // Are we eating an apple?
    if(playerX === appleX && playerY === appleY) {
      // make the snake longer
      tail++;
      // add some score
      score += 10;
      // reset apple position randomly
      appleX = Math.floor(Math.random() * this.boardSize);
      appleY = Math.floor(Math.random() * this.boardSize);
    }
    // Draw the Apple
    this.drawTiles('red', appleX, appleY);
    this.drawStats(context);
    // update the state
    this.setState({playerX,playerY,trail,tail,appleX,appleY,score,lives});
  }
  drawTiles(color, x, y) {
    // get the context
    let context = this.canvas.getContext('2d');
    // set the fill color
    context.fillStyle = color;
    // draw the rectangle
    context.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize - 2, this.tileSize - 2);
  }
  drawStats(context) {
    // prepare to write text
    context.font = "20px bold Arial";
    // write the score
    context.fillStyle=this.playerColor;
    context.fillText(this.state.score, 10, 30);
    // write the lives
    context.fillStyle=this.appleColor;
    context.fillText(this.state.lives, 10, 50);
  }
  setVelocity(x, y) {
    // set the player velocity, and turn on the game when applicable
    // destructure what we need from the state
    let { gameActive, gameOver,
      playerVelocityX, playerVelocityY
    } = this.state;
    // check for the game being active, but don't restart the game
    if(!gameActive && !gameOver) {
      gameActive = true;
      // start ticking
      this.startGame();
    }
    console.log("Input", !gameActive, !gameOver);
    // if the new velocity is in the opposite direction of the one currently going, don't do anything
    if((playerVelocityX === -x && playerVelocityY === 0) || (playerVelocityY === -y && playerVelocityX === 0)) return;
    // set the new velocity
    playerVelocityX = x;
    playerVelocityY = y;
    // update state
    this.setState({playerVelocityX, playerVelocityY, gameActive});
  }
  handleInput(e) {
    // Set the velocity according to the key being pressed
    switch(e.key) {
      case this.UP: // up is 0, -1
        return this.setVelocity(0, -1);
      case this.DOWN: // down is 0, 1
        return this.setVelocity(0, 1);
      case this.LEFT: // left is -1, 0
        return this.setVelocity(-1, 0);
      case this.RIGHT: // right is 1, 0
        return this.setVelocity(1, 0);
      case this.RESTART: // restart the game
        return this.restartGame();
    }
  }
  render() {
    return (
      <canvas
        width={this.size}
        height={this.size}
        style={{width:this.size,height:this.size,backgroundColor:'blue'}}
        ref={(r)=>{this.canvas = r;}} />
    )
  }
}

export default Snake;
