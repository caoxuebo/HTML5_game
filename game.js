/*
 * Copyright (C) 2012 David Geary. This code is from the book
 * Core HTML5 Canvas, published by Prentice-Hall in 2012.
 *
 * License:
 *
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * The Software may not be used to create training material of any sort,
 * including courses, books, instructional videos, presentations, etc.
 * without the express written consent of David Geary.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
*/
// ! snailBait constructor --------------------------------------------

var SnailBait =  function () {
   this.canvas = document.getElementById('game-canvas'),
   this.context = this.canvas.getContext('2d'),

   // ! HTML elements........................................................
   
   this.fpsElement = document.getElementById('fps'),
   this.toast = document.getElementById('toast'),

   // ! Constants............................................................

   this.LEFT = 1,
   this.RIGHT = 2,
   this.STATIONARY = 3,

   // Constants are listed in alphabetical order from here on out
   
   this.BACKGROUND_WIDTH = 1102,  // Canvas width
   this.BACKGROUND_HEIGHT = 400,  // Canvas height
   
   this.BACKGROUND_VELOCITY = 42,
   this.DEFAULT_TOAST_TIME = 1000,
   
   this.PAUSED_CHECK_INTERVAL = 200,

   this.PLATFORM_HEIGHT = 8,  
   this.PLATFORM_STROKE_WIDTH = 2,
   this.PLATFORM_STROKE_STYLE = 'rgb(0,0,0)',

   // Platform scrolling offset (and therefore speed) is
   // PLATFORM_VELOCITY_MULTIPLIER * backgroundOffset: The
   // platforms move PLATFORM_VELOCITY_MULTIPLIER times as
   // fast as the background.

   this.PLATFORM_VELOCITY_MULTIPLIER = 4.35,

   this.STARTING_BACKGROUND_VELOCITY = 0,

   this.STARTING_PLATFORM_OFFSET = 0,
   this.STARTING_BACKGROUND_OFFSET = 0,

   this.STARTING_PAGEFLIP_INTERVAL = -1,
   this.STARTING_RUNNER_TRACK = 1,
   this.STARTING_RUNNER_VELOCITY = 0,

   // ! Paused............................................................
   
   this.paused = false,
   this.pauseStartTime = 0,
   this.totalTimePaused = 0,

   this.windowHasFocus = true,

   // ! Track baselines...................................................

   this.TRACK_1_BASELINE = 323,
   this.TRACK_2_BASELINE = 223,
   this.TRACK_3_BASELINE = 123,

   // ! Animation Constants................................................
   
   this.RUN_ANIMATION_RATE = 30,
   
   this.RUBY_SPARKLE_DURATION = 200,
   this.RUBY_SPARKLE_INTERVAL = 500,
   
   this.SAPPHIRE_SPARKLE_DURATION = 200,
   this.SAPPHIRE_SPARKLE_INTERVAL = 300,
   
   this.SNAIL_BOMB_VELOCITY = 80,
   
   this.COIN_BOUNCE_DURATON = 2000,

   // ! Fps indicator.....................................................
   
   this.fpsToast = document.getElementById('fps'),

   // ! Images............................................................
   
   this.spritesheet = new Image(),
   
   // ! Sprite Sheet Constants............................................
   
   this.BACKGROUND_TOP_IN_SPRITESHEET = 590;
   this.BACKGROUND_WITH_IN_SPRITESHEET = 700,
   this.BACKGROUND_HEIGHT_IN_SPRITESHEET = 253,
   
   this.BAT_CELLS_HEIGHT = 34, // Bat cell width is not uniform
   this.BEE_CELLS_WIDTH  = 50,
   this.BEE_CELLS_HEIGHT = 50,
   this.BUTTON_CELLS_HEIGHT = 20,
   this.BUTTON_CELLS_WIDTH  = 31,
   this.COIN_CELLS_HEIGHT = 30,
   this.COIN_CELLS_WIDTH = 30,
   this.EXPLOSION_CELLS_HEIGHT = 62,
   this.RUBY_CELLS_HEIGHT  = 30,
   this.RUBY_CELLS_WIDTH = 35,
   this.SAPPHIRE_CELLS_HEIGHT = 32,
   this.SAPPHIRE_CELLS_WIDTH = 32,
   this.SNAIL_BOMB_CELLS_HEIGHT = 20,
   this.SNAIL_BOMB_CELLS_WIDTH = 20,
   this.SNAIL_CELLS_WIDTH = 64,
   this.SNAIL_CELLS_HEIGHT = 34,
   
   this.RUNNER_CELLS_WIDTH  = 50,
   this.RUNNER_CELLS_HEIGHT = 54,
   
   // ! Runner values ....................................................
   
   this.INITIAL_RUNNER_TRACK = 1,
   this.INITIAL_RUNNER_LEFT = 50,
   this.RUNNER_HEIGHT = 43,
   this.RUNNER_JUMP_DURATION = 1000,
   this.RUNNER_JUMP_HEIGHT = 120,

   // ! Spritesheet cells................................................

   this.runnerCellsRight = [
      { left: 414, top: 385, width: 47, height: this.RUNNER_CELLS_HEIGHT },
      { left: 362, top: 385, width: 44, height: this.RUNNER_CELLS_HEIGHT },
      { left: 314, top: 385, width: 39, height: this.RUNNER_CELLS_HEIGHT },
      { left: 265, top: 385, width: 46, height: this.RUNNER_CELLS_HEIGHT },
      { left: 205, top: 385, width: 49, height: this.RUNNER_CELLS_HEIGHT },
      { left: 150, top: 385, width: 46, height: this.RUNNER_CELLS_HEIGHT },
      { left: 96,  top: 385, width: 42, height: this.RUNNER_CELLS_HEIGHT },
      { left: 45,  top: 385, width: 35, height: this.RUNNER_CELLS_HEIGHT },
      { left: 0,   top: 385, width: 35, height: this.RUNNER_CELLS_HEIGHT }
   ],

   this.runnerCellsLeft = [
      { left: 0,   top: 305, width: 47, height: this.RUNNER_CELLS_HEIGHT },
      { left: 55,  top: 305, width: 44, height: this.RUNNER_CELLS_HEIGHT },
      { left: 107, top: 305, width: 39, height: this.RUNNER_CELLS_HEIGHT },
      { left: 152, top: 305, width: 46, height: this.RUNNER_CELLS_HEIGHT },
      { left: 208, top: 305, width: 49, height: this.RUNNER_CELLS_HEIGHT },
      { left: 265, top: 305, width: 46, height: this.RUNNER_CELLS_HEIGHT },
      { left: 320, top: 305, width: 42, height: this.RUNNER_CELLS_HEIGHT },
      { left: 380, top: 305, width: 35, height: this.RUNNER_CELLS_HEIGHT },
      { left: 425, top: 305, width: 35, height: this.RUNNER_CELLS_HEIGHT },
   ],
   
   this.batCells = [
      { left: 1,   top: 0, width: 32, height: this.BAT_CELLS_HEIGHT },
      { left: 38,  top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
      { left: 90,  top: 0, width: 32, height: this.BAT_CELLS_HEIGHT },
      { left: 129, top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
   ],

   this.batRedEyeCells = [
      { left: 185, top: 0, width: 32, height: this.BAT_CELLS_HEIGHT },
      { left: 222, top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
      { left: 273, top: 0, width: 32, height: this.BAT_CELLS_HEIGHT },
      { left: 313, top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
   ],
   
   this.beeCells = [
      { left: 5, top: 234, width: this.BEE_CELLS_WIDTH, height: this.BEE_CELLS_HEIGHT },
      { left: 75, top: 234, width: this.BEE_CELLS_WIDTH, height: this.BEE_CELLS_HEIGHT },
      { left: 145, top: 234, width: this.BEE_CELLS_WIDTH, height: this.BEE_CELLS_HEIGHT }
   ],
   
   this.buttonCells = [
      { left: 2, top: 190, width: this.BUTTON_CELLS_WIDTH, height: this.BUTTON_CELLS_HEIGHT },
      { left: 45, top: 190, width: this.BUTTON_CELLS_WIDTH, height: this.BUTTON_CELLS_HEIGHT }
   ],

   this.coinCells = [
      { left: 2, top: 540, width: this.COIN_CELLS_WIDTH, height: this.COIN_CELLS_HEIGHT }
   ],

   this.explosionCells = [
      { left: 1,   top: 48, width: 50, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 60,  top: 48, width: 68, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 143, top: 48, width: 68, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 230, top: 48, width: 68, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 305, top: 48, width: 68, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 389, top: 48, width: 68, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 470, top: 48, width: 68, height: this.EXPLOSION_CELLS_HEIGHT }
   ],

   this.goldButtonCells = [
      { left: 88, top: 190, width: this.BUTTON_CELLS_WIDTH, height: this.BUTTON_CELLS_HEIGHT },
      { left: 130, top: 190, width: this.BUTTON_CELLS_WIDTH, height: this.BUTTON_CELLS_HEIGHT }
   ],

   this.rubyCells = [
      { left: 3, top: 135, width: this.RUBY_CELLS_WIDTH, height: this.RUBY_CELLS_HEIGHT },
      { left: 39, top: 135, width: this.RUBY_CELLS_WIDTH, height: this.RUBY_CELLS_HEIGHT },
      { left: 76,  top: 135, width: this.RUBY_CELLS_WIDTH, height: this.RUBY_CELLS_HEIGHT },
      { left: 112, top: 135, width: this.RUBY_CELLS_WIDTH, height: this.RUBY_CELLS_HEIGHT },
      { left: 148, top: 135, width: this.RUBY_CELLS_WIDTH, height: this.RUBY_CELLS_HEIGHT }
   ],

   this.sapphireCells = [
      { left: 185,   top: 135, width: this.SAPPHIRE_CELLS_WIDTH, height: this.SAPPHIRE_CELLS_HEIGHT },
      { left: 220,  top: 135, width: this.SAPPHIRE_CELLS_WIDTH, height: this.SAPPHIRE_CELLS_HEIGHT },
      { left: 258,  top: 135, width: this.SAPPHIRE_CELLS_WIDTH, height: this.SAPPHIRE_CELLS_HEIGHT },
      { left: 294, top: 135, width: this.SAPPHIRE_CELLS_WIDTH, height: this.SAPPHIRE_CELLS_HEIGHT },
      { left: 331, top: 135, width: this.SAPPHIRE_CELLS_WIDTH, height: this.SAPPHIRE_CELLS_HEIGHT }
   ],

   this.snailBombCells = [
      { left: 1, top: 512, width: 30, height: 20 }
   ],

   this.snailCells = [
      { left: 142, top: 466, width: this.SNAIL_CELLS_WIDTH, height: this.SNAIL_CELLS_HEIGHT },
      { left: 75,  top: 466, width: this.SNAIL_CELLS_WIDTH, height: this.SNAIL_CELLS_HEIGHT },
      { left: 2,   top: 466, width: this.SNAIL_CELLS_WIDTH, height: this.SNAIL_CELLS_HEIGHT },
   ],
   
   // ! SpritesData coordinats on canvas................................

   // Bats..............................................................
   
   this.batData = [
      { left: 70, 	top: this.TRACK_2_BASELINE - this.BAT_CELLS_HEIGHT,   width: 34 },
      { left: 610, 	top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT,   width: 46 },
      { left: 115, 	top: this.TRACK_2_BASELINE - 3*this.BAT_CELLS_HEIGHT, width: 35 }, 
      { left: 1720, top: this.TRACK_2_BASELINE - this.BAT_CELLS_HEIGHT,   width: 50 },
      { left: 1960, top: this.TRACK_3_BASELINE - 2*this.BAT_CELLS_HEIGHT, width: 34 },
   ],
   
   // Bees..............................................................

   this.beeData = [
      { left: 500,  top: 64 },
      { left: 944,  top: this.TRACK_2_BASELINE - this.BEE_CELLS_HEIGHT - 30 },
      { left: 1600, top: 125 },
      { left: 2225, top: 125 },
      { left: 2295, top: 275 },
      { left: 2450, top: 275 },
   ],
   
   // Buttons...........................................................

   this.buttonData = [
      { platformIndex: 7 },
      { platformIndex: 12 },
   ],

   // Coins.............................................................

   this.coinData = [
      { left: 303,  top: this.TRACK_3_BASELINE - this.COIN_CELLS_HEIGHT }, 
      { left: 469,  top: this.TRACK_3_BASELINE - 2*this.COIN_CELLS_HEIGHT }, 
      { left: 600,  top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 
      { left: 833,  top: this.TRACK_2_BASELINE - 2*this.COIN_CELLS_HEIGHT }, 
      { left: 1050, top: this.TRACK_2_BASELINE - 2*this.COIN_CELLS_HEIGHT }, 
      { left: 1500, top: this.TRACK_1_BASELINE - 2*this.COIN_CELLS_HEIGHT }, 
      { left: 1670, top: this.TRACK_2_BASELINE - 2*this.COIN_CELLS_HEIGHT }, 
      { left: 1870, top: this.TRACK_1_BASELINE - 2*this.COIN_CELLS_HEIGHT }, 
      { left: 1930, top: this.TRACK_1_BASELINE - 2*this.COIN_CELLS_HEIGHT }, 
      { left: 2200, top: this.TRACK_3_BASELINE - 3*this.COIN_CELLS_HEIGHT }, 
   ],

   // Rubies............................................................

   this.rubyData = [
      { left: 200,  top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },
      { left: 880,  top: this.TRACK_2_BASELINE - this.RUBY_CELLS_HEIGHT },
      { left: 1100, top: this.TRACK_2_BASELINE - 2*this.SAPPHIRE_CELLS_HEIGHT }, 
      { left: 1475, top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },
   ],

   // Sapphires.........................................................

   this.sapphireData = [
      { left: 680,  top: this.TRACK_1_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },
      { left: 1700, top: this.TRACK_2_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },
      { left: 2056, top: this.TRACK_2_BASELINE - 3*this.SAPPHIRE_CELLS_HEIGHT/2 },
      { left: 2333, top: this.TRACK_2_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },
   ],

   // Snails............................................................

   this.snailData = [
      { platformIndex: 1 },
   ],

   // ! Time..............................................................
   
   this.lastAnimationFrameTime = 0,
   this.lastFpsUpdateTime = 0,
   this.fps = 60,
   
   this.timeSystem = new TimeSystem(); // See timeSystem.js
   this.timeFactor = 1.0; // 1.0 is normal; 0.5 is half-speed; etc.

   // ! Runner track......................................................

   this.runnerTrack = this.STARTING_RUNNER_TRACK,

   // ! Pageflip timing for runner........................................

   this.runnerPageflipInterval = this.STARTING_PAGEFLIP_INTERVAL,
   
   // ! Scrolling direction...............................................

   this.scrollingDirection = this.STATIONARY,
   this.noScroll = false,
   
   // ! Translation offsets...............................................

   this.backgroundOffset = this.STARTING_BACKGROUND_OFFSET,
   this.platformOffset = this.STARTING_PLATFORM_OFFSET,

   // ! Velocities........................................................

   this.bgVelocity = this.STARTING_BACKGROUND_VELOCITY,
   this.platformVelocity,
   this.spriteOffset = 0, 
   this.BUTTON_PACE_VELOCITY = 80,
   this.SNAIL_PACE_VELOCITY = 50,

   // ! PlatformData coordinate on canvas.................................

   this.platformData = [
      
      // Screen 1.......................................................
      
      {
         left:      10,
         width:     230,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(150,190,255)',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      {  left:      250,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(150,190,255)',
         opacity:   1.0,
         track:     2,
         pulsate:   false,
      },

      {  left:      400,
         width:     125,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(250,0,0)',
         opacity:   1.0,
         track:     3,
         pulsate:   true,
      },

      {  left:      633,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      // Screen 2.......................................................
               
      {  left:      810,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,0)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1025,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1200,
         width:     125,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      {  left:      1400,
         width:     180,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      // Screen 3.......................................................
               
      {  left:      1625,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,0)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1800,
         width:     250,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     1,
         pulsate:   false
      },

      {  left:      2000,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,80)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      2100,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     3,
      },


      // Screen 4.......................................................

      {  left:      2269,
         width:     200,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'gold',
         opacity:   1.0,
         track:     1,
      },

      {  left:      2500,
         width:     200,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: '#2b950a',
         opacity:   1.0,
         track:     2,
         snail:     true
      },
   ],
   
   
   // ! Sprites behaviors.................................................
   
   this.runBehaviour = {
	   
	  lastAdvanceTime: 0,
      
      execute: function(sprite, time, fps) {
        
         if (sprite.runAnimationRate === 0) {
            return;
         }
         
         if (this.lastAdvanceTime === 0) {  // skip first time
            this.lastAdvanceTime = time;
         }
         else if (time - this.lastAdvanceTime > 1000 / sprite.runAnimationRate) {
            sprite.artist.advance();
            this.lastAdvanceTime = time;
         }
      }
   },
   
   this.jumpBehavior = {
   	  
   	  pause: function (sprite, now) {
         if (sprite.ascendAnimationTimer.isRunning()) {
            sprite.ascendAnimationTimer.pause(now);
         }
         else if (!sprite.descendAnimationTimer.isRunning()) {
            sprite.descendAnimationTimer.pause(now);
         }
      },

      unpause: function (sprite, now) {
         if (sprite.ascendAnimationTimer.isRunning()) {
            sprite.ascendAnimationTimer.unpause(now);
         }
         else if (sprite.descendAnimationTimer.isRunning()) {
            sprite.descendAnimationTimer.unpause(now);
         }
      },

      jumpIsOver: function (sprite, now) {
         return ! sprite.ascendAnimationTimer.isRunning(now) &&
                ! sprite.descendAnimationTimer.isRunning(now);
      },
      
   	  // Ascent...............................................................

      isAscending: function (sprite, now) {
         return sprite.ascendAnimationTimer.isRunning(now);
      },
      
      ascend: function (sprite, now) {
         var elapsed = sprite.ascendAnimationTimer.getElapsedTime(now),
             deltaH  = elapsed / (sprite.JUMP_DURATION/2) * sprite.JUMP_HEIGHT;

         sprite.top = sprite.verticalLaunchPosition - deltaH;
      },

      isDoneAscending: function (sprite, now) {
         return sprite.ascendAnimationTimer.getElapsedTime(now) > sprite.JUMP_DURATION/2;
      },
      
      finishAscent: function (sprite, now) {
         sprite.jumpApex = sprite.top;
         sprite.ascendAnimationTimer.stop(now);
         sprite.descendAnimationTimer.start(now);

		 sprite.track++;
		 sprite.top = snailBait.calculatePlatformTop(sprite.track) - sprite.height;
      },
      
      // Descents.............................................................

      isDescending: function (sprite, now) {
         return sprite.descendAnimationTimer.isRunning(now);
      },

      descend: function (sprite, now) {
         var elapsed = sprite.descendAnimationTimer.getElapsedTime(now),
             deltaH  = elapsed / (sprite.JUMP_DURATION/2) * sprite.JUMP_HEIGHT;

         sprite.top = sprite.jumpApex + deltaH;
      },
      
      isDoneDescending: function (sprite, now) {
         return sprite.descendAnimationTimer.getElapsedTime(now) > sprite.JUMP_DURATION/2;
      },

      finishDescent: function (sprite, now) {
         sprite.top = sprite.verticalLaunchPosition;
         sprite.stopJumping(now);
      },
      
      // Execute..............................................................
      
	   execute: function(sprite, now, fps) {
		   if (!sprite.jumping) {
			   return;
		   }
		  
		  if (this.isAscending(sprite, now)) {
			  if (!this.isDoneAscending(sprite, now)) {
				  this.ascend(sprite, now);
			  }
			  else {
				  this.finishAscent(sprite, now);
			  }
		  } else if (this.isDescending(sprite, now)) {
			  if (!this.isDoneDescending(sprite, now)) {
				  this.descend(sprite, now);
			  }
			  else {
				  this.finishDescent(sprite, now);
			  }
		  }
	   }
   },
   
   this.paceBehavior = {
   
	  execute: function (sprite, now, fps) {
         var sRight = sprite.left + sprite.width,
             pRight = sprite.platform.left + sprite.platform.width,
             pixelsToMove = sprite.velocityX / fps;

         if (sprite.direction === undefined) {
            sprite.direction = snailBait.RIGHT;
         }

         if (sprite.velocityX === 0) {
            if (sprite.type === 'snail') {
               sprite.velocityX = snailBait.SNAIL_PACE_VELOCITY;
            }
            else {
               sprite.velocityX = snailBait.BUTTON_PACE_VELOCITY;
            }
         }

         if (sRight > pRight && sprite.direction === snailBait.RIGHT) {
            sprite.direction = snailBait.LEFT;
         }
         else if (sprite.left < sprite.platform.left && sprite.direction === snailBait.LEFT) {
            sprite.direction = snailBait.RIGHT;
         }

         if (sprite.direction === snailBait.RIGHT) {
            sprite.left += pixelsToMove;
         }
         else {
            sprite.left -= pixelsToMove;
         }
      }
   },
   
   this.snailShootBehavior = {
	   
	   execute: function (sprite, now, fps) {
         var bomb = sprite.bomb;

         if (!snailBait.isSpriteInView(sprite)) {
            return;
         }

         if (! bomb.visible && sprite.artist.cellIndex === 2) {
            bomb.left = sprite.left;
            bomb.visible = true;
         }
      }
   },
   
   this.snailBombMoveBehavior = {
	   
	   execute: function(sprite, now, fps) {  // sprite is the bomb
         if (sprite.visible && snailBait.isSpriteInView(sprite)) {
            sprite.left -= snailBait.SNAIL_BOMB_VELOCITY / fps;
         }

         if (!snailBait.isSpriteInView(sprite)) {
            sprite.visible = false;
         }
      }
   },
   
   this.collideBehavior = {
   		
   		isCandidateForCollision: function(sprite, otherSprite) {
	   		var r = sprite.calculateCollisionRectangle(),
	   			o = otherSprite.calculateCollisionRectangle();
	   			
	   		return sprite !== otherSprite && sprite.visible && otherSprite.visible &&
	   					  !sprite.exploding && !otherSprite.exploding && 
	   					  o.left < r.right;
   		},
   		
   		didRunnerCollideWithOthersprite: function(otherSprite) {
	   		var o = otherSprite.calculateCollisionRectangle(),
	   			r = snailBait.runner.calculateCollisionRectangle();
	   			
	   		// Determine if either of the runner's four corners or its
	   		// center lie within the other sprite's bounding box. 

		 	snailBait.context.beginPath();
		 	snailBait.context.rect(o.left, o.top, o.right - o.left, o.bottom - o.top);
         
         return snailBait.context.isPointInPath(r.left,    r.top)     ||
                snailBait.context.isPointInPath(r.right,   r.top)     ||

                snailBait.context.isPointInPath(r.centerX, r.centerY) ||

                snailBait.context.isPointInPath(r.left,    r.bottom)  ||
                snailBait.context.isPointInPath(r.right,   r.bottom);
   		},
   		
   		didCollide: function(sprite, otherSprite) {
	   		return this.didRunnerCollideWithOthersprite(otherSprite);
   		},
   		
   		processPlatformCollisionDuringJump: function(sprite, platform) {
	   		var isDescending = sprite.descendAnimationTimer.isRunning();
	   		
	   		if (isDescending) {
		   		sprite.track = platform.track;
		   		sprite.top = snailBait.calculatePlatformTop(sprite.track) - sprite.height;
	   		}
	   		else {
/* 		   		sprite.fall(); */
	   		}
	   		sprite.stopJumping();
   		},
   		
   		processCollision: function(sprite, otherSprite) {
	   		if (sprite.jumping && 'platform' === otherSprite.type) {
		   		this.processPlatformCollisionDuringJump(sprite, otherSprite);
	   		}
	   		else if ('coin' 	  === otherSprite.type ||
	   				 'sapphire'   === otherSprite.type ||
	   				 'ruby' 	  === otherSprite.type ||
	   				 'snail bomb' === otherSprite.type) {
		   		otherSprite.visible = false;	 
	   		}
	   		else if ('button' === otherSprite.type && (sprite.falling || sprite.jumping)) {
		   		if (!(sprite.jumping && sprite.ascendAnimationTimer.isRunning())) {
			   		// Descending while jumping or falling
			   		console.log('button detonating');
		   		}
	   		}
	   		
	   		if ('bat'	=== otherSprite.type ||
	   			'bee' 	=== otherSprite.type) {
		   			snailBait.explode(sprite);
		   			snailBait.shake();
		   			snailBait.loseLife();
	   		}
	   		
	   		if ('snail' === otherSprite.type) {
		   		/*
otherSprite.visible = false;
		   		snailBait.showWinAnimation();
*/
	   		}
   		},
   
	    execute: function (sprite, time, fps) {
			var otherSprite;
      	
		    for (var i=0; i < snailBait.sprites.length; ++i) { 
			    otherSprite = snailBait.sprites[i];

			    if (this.isCandidateForCollision(sprite, otherSprite)) {
				    if (this.didCollide(sprite, otherSprite)) { 
					    this.processCollision(sprite, otherSprite);
				    }
			    }
		    }
	    }
   },
   
   // ! Sprites arrays.....................................................
   
   this.bats			= [],
   this.bees			= [],
   this.buttons			= [],
   this.coins			= [],
   this.platforms		= [],
   this.rubies			= [],
   this.sapphires		= [],
   this.smokingHoles	= [],
   this.snails			= [],
   // finally an array to hold all the sprite arrays
   this.sprites			= [],
   
   // ! Sprite artists...................................................

   this.runnerArtist = new SpriteSheetArtist(this.spritesheet, this.runnerCellsRight),

   this.platformArtist = {
      draw: function (sprite, context) {
         var top;
         
         context.save();

         top = snailBait.calculatePlatformTop(sprite.track);

         context.lineWidth = snailBait.PLATFORM_STROKE_WIDTH;
         context.strokeStyle = snailBait.PLATFORM_STROKE_STYLE;
         context.fillStyle = sprite.fillStyle;

         context.strokeRect(sprite.left, top, sprite.width, sprite.height);
         context.fillRect  (sprite.left, top, sprite.width, sprite.height);

         context.restore();
      }
   };
};


// ! ------------------------ SNAILBAIT PROTOTYPE ----------------------------


SnailBait.prototype = {
   
   // ! Drawing..............................................................

   draw: function (now) {
      this.setPlatformVelocity(now);
      this.setOffsets(now);

      this.drawBackground();
      
      this.updateSprites(now);
      this.drawSprites(now); // only platforms for now
   },
   
   drawBackground: function () {
         
      this.context.save();
   
      this.context.globalAlpha = 1.0;
      this.context.translate(-this.backgroundOffset, 0);
   
      // Initially onscreen in canvas windows:
      this.context.drawImage(this.spritesheet,  // image to draw from
      						0, this.BACKGROUND_TOP_IN_SPRITESHEET, // X, Y starting point for clip
	  						this.BACKGROUND_WITH_IN_SPRITESHEET, this.BACKGROUND_HEIGHT_IN_SPRITESHEET, // X, Y end point for clip
	  						0, 0, // X, Y position in canvas to start drawing from
	  						this.BACKGROUND_WIDTH, this.BACKGROUND_HEIGHT); // drawing image to this width and height
                        
   
      // Initially offscreen to the right of the canvas:
      this.context.drawImage(this.spritesheet, 
      						 0, this.BACKGROUND_TOP_IN_SPRITESHEET, 
	  						 this.BACKGROUND_WITH_IN_SPRITESHEET, this.BACKGROUND_HEIGHT_IN_SPRITESHEET,
	  						 this.BACKGROUND_WIDTH, 0, 
	  						 this.BACKGROUND_WIDTH, this.BACKGROUND_HEIGHT);
   
      this.context.restore();
   },
   
   updateSprites: function (now) {
      var sprite;
   
      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];
         if (sprite.visible && this.isSpriteInView(sprite)) {
            sprite.update(now, this.fps);
         }
      }
   },
   
   drawSprites: function() {
      for (var i=0; i < this.sprites.length; ++i) {
	      this.drawSprite(this.sprites[i]);
      }
   },
   
   drawSprite: function(sprite) {
	   if (sprite.visible && this.isSpriteInView(sprite)) {
	   	   this.context.translate(-sprite.offset, 0);
		   sprite.draw(this.context);
		   this.context.translate(sprite.offset, 0);
	   }
   },
   
   setPlatformVelocity: function () {
      this.platformVelocity = this.bgVelocity * this.PLATFORM_VELOCITY_MULTIPLIER * this.timeFactor; 
   },
   
   setOffsets: function () {
   	  if (this.noScroll) return;
      this.setBackgroundOffset();
      this.setSpriteOffset();
   },
   
   setBackgroundOffset: function() {
	   var offset = this.backgroundOffset 
	   				+ this.bgVelocity/this.fps
	   				* this.timeFactor;
	   
	   if (offset > 0 && offset < this.BACKGROUND_WIDTH) {
		   this.backgroundOffset = offset;
	   }
	   else {
		   this.backgroundOffset = 0;
	   }
   },
   
   setSpriteOffset: function() {
	   var i, sprite;
	   
	   this.spriteOffset += this.platformVelocity / this.fps;
	   for (i = 0; i < this.sprites.length; ++i) {
		   sprite = this.sprites[i];
		   
		   if ('runner' !== sprite.type && 'smoking hole' !== sprite.type) {
			   sprite.offset = this.spriteOffset;
		   }
		   else if ('smoking hole' === sprite.type) {
			   sprite.offset = this.backgroundOffset; // in step with background
		   }
	   }
   },
   
   calculateFps: function (now) {
      var fps = 1000 / (now - this.lastAnimationFrameTime) * this.timeFactor;
      this.lastAnimationFrameTime = now;

      if (now - this.lastFpsUpdateTime > 1000) {
	      this.lastFpsUpdateTime = now;
	      this.fpsElement.innerHTML = fps.toFixed(0) + 'fps';
      }

      return fps; 
   },
   
   calculatePlatformTop: function (track) {
      var top;
   
      if      (track === 1) { top = this.TRACK_1_BASELINE; }
      else if (track === 2) { top = this.TRACK_2_BASELINE; }
      else if (track === 3) { top = this.TRACK_3_BASELINE; }

      return top;
   },

   turnLeft: function () {
      this.bgVelocity = -this.BACKGROUND_VELOCITY;
      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
      this.runnerArtist.cells = this.runnerCellsLeft;
      this.runner.direction = this.LEFT;
   },

   turnRight: function () {
      this.bgVelocity = this.BACKGROUND_VELOCITY;
      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
      this.runnerArtist.cells = this.runnerCellsRight;
      this.runner.direction = this.RIGHT;
   },
    
   explode: function (sprite, silent) {
      sprite.exploding = true;
      this.explosionAnimator.start(sprite, true);  // true means sprite reappears
   },

   // ! Toast................................................................

   splashToast: function (text, howLong) {
      howLong = howLong || this.DEFAULT_TOAST_TIME;

      toast.style.display = 'block';
      toast.innerHTML = text;

      setTimeout( function (e) {
         if (snailBait.windowHasFocus) {
            toast.style.opacity = 1.0; // After toast is displayed
         }
      }, 50);

      setTimeout( function (e) {
         if (snailBait.windowHasFocus) {
            toast.style.opacity = 0; // Starts CSS3 transition
         }

         setTimeout( function (e) { 
            if (snailBait.windowHasFocus) {
               toast.style.display = 'none'; 
            }
         }, 480);
      }, howLong);
   },

   // ! Pause................................................................

   togglePausedStateOfAllBehaviors: function (now) {
      
      var behavior;
   
      for (var i=0; i < this.sprites.length; ++i) { 
         sprite = this.sprites[i];

         for (var j=0; j < sprite.behaviors.length; ++j) { 
            behavior = sprite.behaviors[j];

            if (this.paused) {
               if (behavior.pause) {
                  behavior.pause(sprite, now);
               }
            }
            else {
               if (behavior.unpause) {
                  behavior.unpause(sprite, now);
               }
            }
         }
      }
   },
   
   togglePaused: function () {
      var now = snailBait.timeSystem.calculateGameTime();

      this.paused = !this.paused;
      this.togglePausedStateOfAllBehaviors(now);
   
      if (this.paused) {
         this.pauseStartTime = now;
      	 this.splashToast('paused', 1000);
      }
      else {
         this.lastAnimationFrameTime += (now - this.pauseStartTime);
      }
   },

   // ! Animation............................................................

   animate: function (now) { 
   
   	  now = snailBait.timeSystem.calculateGameTime();
   	  
      if (snailBait.paused) {
         setTimeout( function () {
            requestNextAnimationFrame(snailBait.animate);
         }, snailBait.PAUSED_CHECK_INTERVAL);
      }
      else {
         snailBait.fps = snailBait.calculateFps(now); 
         snailBait.draw(now);
         snailBait.lastAnimationFrameTime = now; // used in extended execute behavior !
         requestNextAnimationFrame(snailBait.animate);
      }
   },
   
   explode: function (sprite, silent) {
  	   console.log('boom');
   },
   
   shake: function() {
	   console.log('shake');	   
   },
   
   loseLife: function() {
	   console.log('life lost');
   },
   
   revealCollisionRectangles: function() {
	   for (var i=0; i < this.sprites.length; ++i) {
		   this.sprites[i].drawCollisionRectangle = true;
	   }
   },
   
   hideCollisionRectangles: function() {
	   for (var i=0; i < this.sprites.length; ++i) {
		   this.sprites[i].drawCollisionRectangle = false;
	   }
   },
   
   // ! ------------------------- SPRITE CREATION ---------------------------
   
   createSprites : function(now) {
	   this.createPlatformSprites(now);
	   this.createRunnerSprite();
	   
	   this.createBatSprites();
	   this.createBeeSprites();
	   this.createButtonSprites();
	   this.createCoinSprites();
	   this.createRubySprites();
	   this.createSapphireSprites();
	   this.createSnailSprites();
	   this.initializeSprites();
	   
	   this.addSpritesToSpriteArray(); // platforms only for now
   },
   
   positionSprites: function (sprites, spriteData) {
      var sprite;

      for (var i = 0; i < sprites.length; ++i) {
         sprite = sprites[i];

         if (spriteData[i].platformIndex) { 
            this.putSpriteOnPlatform(sprite, this.platforms[spriteData[i].platformIndex]);
         }
         else {
            sprite.top  = spriteData[i].top;
            sprite.left = spriteData[i].left;
         }
      }
   },
   
   initializeSprites: function() {
      
      for (var i=0; i < this.sprites.length; ++i) {
	      this.sprites[i].offset = 0;
	      this.sprites[i].visible = true;
      }
      
      this.positionSprites(this.bats,       this.batData);
      this.positionSprites(this.bees,       this.beeData);
      this.positionSprites(this.buttons,    this.buttonData);
      this.positionSprites(this.coins,      this.coinData);
      this.positionSprites(this.rubies,     this.rubyData);
      this.positionSprites(this.sapphires,  this.sapphireData);
      this.positionSprites(this.snails,     this.snailData);

      this.armSnails();
   },
   
   putSpriteOnPlatform: function(sprite, platformSprite) {
      sprite.top  = platformSprite.top - sprite.height;
      sprite.left = platformSprite.left;
      sprite.platform = platformSprite;
   },
   
   createPlatformSprites : function() {
	   var sprite, pd;	// Sprite, Platform data
	   
	   for (var i=0; i < this.platformData.length; ++i) {
		   pd = this.platformData[i];
		   
		   sprite = new Sprite('platform', this.platformArtist);
		   
		   sprite.left      = pd.left;
		   sprite.width     = pd.width;
		   sprite.height    = pd.height;
		   sprite.fillStyle = pd.fillStyle;
		   sprite.opacity   = pd.opacity;
		   sprite.track     = pd.track;
		   sprite.button    = pd.button;
		   sprite.pulsate   = pd.pulsate;
		   
		   sprite.top = this.calculatePlatformTop(pd.track);
		   
		   if (sprite.pulsate) {
           	  sprite.behaviors = [ new PulseBehavior(1000, 0.5) ];
	       }
   
           this.platforms.push(sprite);
	   }
   },
   
   createRunnerSprite: function() {
	   this.runner = new Sprite('runner', this.runnerArtist, [this.runBehaviour, 
	   														  this.jumpBehavior,
	   														  this.collideBehavior]);
	   
	   this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
	   this.runner.width 	= this.RUNNER_CELLS_WIDTH;
	   this.runner.height 	= this.RUNNER_CELLS_HEIGHT; 
	   this.runner.left 	= this.INITIAL_RUNNER_LEFT;
	   this.runner.track 	= this.INITIAL_RUNNER_TRACK;
	   this.runner.top 		= this.calculatePlatformTop(this.runner.track) - this.RUNNER_CELLS_HEIGHT;
	   this.runner.lastAdvanceTime = 0;
	   
	   this.runner.collisionMargin = {
		   left: 10,
		   top: 15,
		   right: 20,
		   bottom: 20,
	   };
	   
	   this.sprites = [ this.runner ];
   },
   
   createBatSprites: function () {
      var bat,
          batArtist = new SpriteSheetArtist(this.spritesheet, this.batCells),
		  redEyeBatArtist = new SpriteSheetArtist(this.spritesheet, this.batRedEyeCells);

      for (var i = 0; i < this.batData.length; ++i) {
         if (i % 2 === 0) bat = new Sprite('bat', batArtist, [ new CycleBehavior(200, 400)]);
         else             bat = new Sprite('bat', redEyeBatArtist, [ new CycleBehavior(200, 600)]);

         bat.width = this.batData[i].width;
         bat.height = this.BAT_CELLS_HEIGHT;
         
         bat.collisionMargin = {
	     	left: 6,
			top: 11,
			right: 4,
		    bottom: 12,
         };

         this.bats.push(bat);
      }
   },

   createBeeSprites: function () {
      var bee,
          beeArtist = new SpriteSheetArtist(this.spritesheet, this.beeCells);

      for (var i = 0; i < this.beeData.length; ++i) {
         bee = new Sprite('bee', beeArtist, [ new CycleBehavior(200, 300)]);

         bee.width = this.BEE_CELLS_WIDTH;
         bee.height = this.BEE_CELLS_HEIGHT;
         
         bee.collisionMargin = {
	     	left: 10,
			top: 10,
			right: 5,
		    bottom: 15,
         };

         this.bees.push(bee);
      }
   },

   createButtonSprites: function () {
      var button,
          buttonArtist = new SpriteSheetArtist(this.spritesheet, this.buttonCells),
      goldButtonArtist = new SpriteSheetArtist(this.spritesheet, this.goldButtonCells);

      for (var i = 0; i < this.buttonData.length; ++i) {
         if (i === this.buttonData.length - 1) {
            button = new Sprite('button', goldButtonArtist, [ this.paceBehavior ]);
         }
         else {
            button = new Sprite('button', buttonArtist, [ this.paceBehavior ]);
         }

         button.width = this.BUTTON_CELLS_WIDTH;
         button.height = this.BUTTON_CELLS_HEIGHT;

         button.velocityX = this.BUTTON_PACE_VELOCITY;
         button.direction = this.RIGHT;

         this.buttons.push(button);
      }
   },
   
   createCoinSprites: function () {
      var coin,
          coinArtist = new SpriteSheetArtist(this.spritesheet, this.coinCells);
   
      for (var i = 0; i < this.coinData.length; ++i) {
         coin = new Sprite('coin', coinArtist);

         coin.width = this.COIN_CELLS_WIDTH;
         coin.height = this.COIN_CELLS_HEIGHT;
         
         // coin.behaviors.push(new BounceBehavior(910 + (i * 10),
         // 										610 + (i * 10),
         // 										60 * Math.random() * 4));
         										
		 coin.collisionMargin = {
	     	left: coin.width/8,
			top: coin.width/8,
			right: coin.width/8,
		    bottom: coin.width/4,
         };
		 
         this.coins.push(coin);
      }
   },
   
   createSapphireSprites: function () {
      var sapphire,
          sapphireArtist = new SpriteSheetArtist(this.spritesheet, this.sapphireCells);
   
      for (var i = 0; i < this.sapphireData.length; ++i) {
         sapphire = new Sprite('sapphire', sapphireArtist, [ new CycleBehavior(
         													this.SAPPHIRE_SPARKLE_DURATION, 
         													this.SAPPHIRE_SPARKLE_INTERVAL),
         													new BounceBehavior()]);

         sapphire.width = this.SAPPHIRE_CELLS_WIDTH;
         sapphire.height = this.SAPPHIRE_CELLS_HEIGHT;
         sapphire.value = 100;
         
         sapphire.collisionMargin = {
	     	left: 0,
			top: 5,
			right: 5,
		    bottom: 5,
         };

         this.sapphires.push(sapphire);
      }
   },
   
   createRubySprites: function () {
      var ruby,
          rubyArtist = new SpriteSheetArtist(this.spritesheet, this.rubyCells);
   
      for (var i = 0; i < this.rubyData.length; ++i) {
         ruby = new Sprite('ruby', rubyArtist, [ new CycleBehavior(
         											this.RUBY_SPARKLE_DURATION, 
         											this.RUBY_SPARKLE_INTERVAL),
         										 new BounceBehavior(80 * i * 10,
		 										 					50 * i * 10,
		 										 					60 + Math.random() * 40)]);

         ruby.width = this.RUBY_CELLS_WIDTH;
         ruby.height = this.RUBY_CELLS_HEIGHT;
         ruby.value = 200;
         
         ruby.collisionMargin = {
	     	left: 0,
			top: 5,
			right: 11,
		    bottom: 5,
         };
         
         this.rubies.push(ruby);
      }
   },
   
   createSnailSprites: function () {
      var snail,
          snailArtist = new SpriteSheetArtist(this.spritesheet, this.snailCells);
   
      for (var i = 0; i < this.snailData.length; ++i) {
         snail = new Sprite('snail', snailArtist,[ this.paceBehavior, 
         										   this.snailShootBehavior,
         										   new CycleBehavior(300, 1500)]);

         snail.width  = this.SNAIL_CELLS_WIDTH;
         snail.height = this.SNAIL_CELLS_HEIGHT;

         snail.velocityX = this.SNAIL_PACE_VELOCITY;
         snail.direction = this.RIGHT;
         
         this.snails.push(snail);
      }
   },
   
   armSnails: function () {
      var snail,
          snailBombArtist = new SpriteSheetArtist(this.spritesheet, this.snailBombCells);

      for (var i=0; i < this.snails.length; ++i) {
         snail = this.snails[i];
         snail.bomb = new Sprite('snail bomb', snailBombArtist, [ this.snailBombMoveBehavior ]);

         snail.bomb.width  = snailBait.SNAIL_BOMB_CELLS_WIDTH;
         snail.bomb.height = snailBait.SNAIL_BOMB_CELLS_HEIGHT;

         snail.bomb.top = snail.top + snail.bomb.height/2;
         snail.bomb.left = snail.left + snail.bomb.width/2;
         snail.bomb.visible = false;

         snail.bomb.snail = snail;  // Snail bombs maintain a reference to their snail

         this.sprites.push(snail.bomb);
      }
   },
   
   addSpritesToSpriteArray : function() {
		for (var i=0; i < this.platforms.length; ++i) {
			this.sprites.push(this.platforms[i]);
		}
		
		for (var i=0; i < this.bats.length; ++i) {
			this.sprites.push(this.bats[i]);
		}
		
		for (var i=0; i < this.bees.length; ++i) {
			this.sprites.push(this.bees[i]);
		}
		
		for (var i=0; i < this.buttons.length; ++i) {
			this.sprites.push(this.buttons[i]);
		}
		
		for (var i=0; i < this.coins.length; ++i) {
			this.sprites.push(this.coins[i]);
		}
		
		for (var i=0; i < this.rubies.length; ++i) {
			this.sprites.push(this.rubies[i]);
		}
		
		for (var i=0; i < this.sapphires.length; ++i) {
			this.sprites.push(this.sapphires[i]);
		}
		
		for (var i=0; i < this.snails.length; ++i) {
			this.sprites.push(this.snails[i]);
		}
		
		for (var i=0; i < this.smokingHoles.length; ++i) {
			this.sprites.push(this.snailBombs[i]);
		}
   },

   // ! ------------------------- UTILITIES ---------------------------------
   
   isSpriteInGameCanvas: function(sprite) {
	   // returns true or false
	   return sprite.left + sprite.width > sprite.offset && sprite.left < sprite.offset + this.canvas.width;
   },
   
   isSpriteInView: function(sprite) {
	   return this.isSpriteInGameCanvas(sprite);
   },
   
   putSpriteOnTrack: function(sprite) {
      sprite.top  = this.calculatePlatformTop(sprite.track) - this.RUNNER_CELLS_HEIGHT;
   },
   
   isCandidateForCollision: function (sprite, otherSprite) {
         return sprite !== otherSprite &&
                sprite.visible && otherSprite.visible &&
                !sprite.exploding && !otherSprite.exploding &&
                otherSprite.left - otherSprite.offset <
                sprite.left - sprite.offset + sprite.width;
   },
   
   // ! ------------------------- INITIALIZATION ----------------------------

   start: function () {
      
      this.equipRunner();
      
      this.splashToast('Good Luck!', 2000);

      requestNextAnimationFrame(snailBait.animate);
   },
   
   setTimeRate: function(rate) {
	   this.timeFactor = rate;
	   
	   this.timeSystem.setTransducer(function(percent) {
		   return percent * snailBait.timeFactor;
	   });
   },

   initializeImages: function () {
      this.spritesheet.src = 'images/mySpritesheet.png';
   
      this.spritesheet.onload = function(e) {
         snailBait.start();
      };
   },
   
   equipRunnerForJumping: function () {

	  this.runner.JUMP_DURATION = this.RUNNER_JUMP_DURATION; // miliseconds
	  this.runner.JUMP_HEIGHT = this.RUNNER_JUMP_HEIGHT;
	  
	  this.runner.jumping = false;
	  
	  this.runner.ascendAnimationTimer = new AnimationTimer(
	 										 this.runner.JUMP_DURATION/2,
	 										 AnimationTimer.makeEaseOutTransducer(1.0));
	 										
	  this.runner.descendAnimationTimer = new AnimationTimer(
	 										  this.runner.JUMP_DURATION/2,
	 										  AnimationTimer.makeEaseInTransducer(1.0));
	  
      this.runner.jump = function () {
         this.jumping = true;
         this.runAnimationRate = 0;
         this.verticalLaunchPosition = this.top;
         
         this.ascendAnimationTimer.start(snailBait.timeSystem.calculateGameTime()); // now
      };
      
      this.runner.stopJumping = function() {
	      this.jumping = false;
	      this.ascendAnimationTimer.stop(snailBait.timeSystem.calculateGameTime()); // now
	      this.descendAnimationTimer.stop(snailBait.timeSystem.calculateGameTime()); // now
	      this.runAnimationRate = snailBait.RUN_ANIMATION_RATE;
      };
   },
   
   equipRunner: function () {
         
      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
   
      this.equipRunnerForJumping();
   },
   
}; // end snailBait.prototype
   
// ! ------------------------- EVENT HANDLERS ----------------------------
   
window.onkeydown = function (e) {
   var key = e.keyCode;
   
   if (key === 83) { // 's'
	   snailBait.noScroll = !snailBait.noScroll;
   }

   if (key === 80 || (snailBait.paused && key !== 80)) {  // 'p'
      snailBait.togglePaused();
   }
   
   if (key === 68 || key === 37) { // 'd' or left arrow
      snailBait.turnLeft();
   }
   else if (key === 75 || key === 39) { // 'k'or right arrow
      snailBait.turnRight();
   }
   else if (key === 74) { // 'j'
      if (!snailBait.runner.jumping) {
	      snailBait.runner.jump();
      }
   }
};

window.onblur = function (e) {  // pause if unpaused
   snailBait.windowHasFocus = false;
   
   if (!snailBait.paused) {
      snailBait.togglePaused();
   }
};

window.onfocus = function (e) {  // unpause if paused
   var originalFont = snailBait.toast.style.fontSize;

   snailBait.windowHasFocus = true;

   if (snailBait.paused) {
      snailBait.toast.style.font = '128px fantasy';

      snailBait.splashToast('3', 500); // Display 3 for one half second

      setTimeout(function (e) {
         snailBait.splashToast('2', 500); // Display 2 for one half second

         setTimeout(function (e) {
            snailBait.splashToast('1', 500); // Display 1 for one half second

            setTimeout(function (e) {
               if ( snailBait.windowHasFocus) {
                  snailBait.togglePaused();
               }

               setTimeout(function (e) { // Wait for '1' to disappear
                  snailBait.toast.style.fontSize = originalFont;
               }, 2000);
            }, 1000);
         }, 1000);
      }, 1000);
   }
};

// Launch game.........................................................

var snailBait = new SnailBait();
snailBait.initializeImages();
snailBait.createSprites();
snailBait.setTimeRate(1.0); // 1.0 is normal; 0.5 is half-speed; etc.
snailBait.revealCollisionRectangles();

/*
setTimeout(function() {
	snailBait.turnRight();
}, 1000);
*/

