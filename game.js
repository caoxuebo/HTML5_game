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
// snailBait constructor --------------------------------------------

var SnailBait =  function () {
   this.canvas = document.getElementById('game-canvas'),
   this.context = this.canvas.getContext('2d'),

   // HTML elements........................................................
   
   this.fpsElement = document.getElementById('fps'),
   this.toast = document.getElementById('toast'),

   // Constants............................................................

   this.LEFT = 1,
   this.RIGHT = 2,
   this.STATIONARY = 3,

   // Constants are listed in alphabetical order from here on out
   
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

   this.RUNNER_HEIGHT = 43,
   
   this.STARTING_BACKGROUND_VELOCITY = 0,

   this.STARTING_PLATFORM_OFFSET = 0,
   this.STARTING_BACKGROUND_OFFSET = 0,

   this.STARTING_RUNNER_LEFT = 50,
   this.STARTING_PAGEFLIP_INTERVAL = -1,
   this.STARTING_RUNNER_TRACK = 1,
   this.STARTING_RUNNER_VELOCITY = 0,

   // Paused............................................................
   
   this.paused = false,
   this.pauseStartTime = 0,
   this.totalTimePaused = 0,

   this.windowHasFocus = true,

   // Track baselines...................................................

   this.TRACK_1_BASELINE = 323,
   this.TRACK_2_BASELINE = 223,
   this.TRACK_3_BASELINE = 123,

   // Fps indicator.....................................................
   
   this.fpsToast = document.getElementById('fps'),

   // Images............................................................
   
   this.background  = new Image(),
   this.runnerImage = new Image(),
/*    this.spritesheet = new Image(), */
   
   // Sprite Sheet cells................................................
   
   this.BACKGROUND_WIDTH = 1102,
   this.BACKGROUND_HEIGHT = 400,
   this.RUNNER_CELLS_WIDHT  = 50,
   this.RUNNER_CELLS_HEIGHT = 54,

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

   // Time..............................................................
   
   this.lastAnimationFrameTime = 0,
   this.lastFpsUpdateTime = 0,
   this.fps = 60,

   // Runner track......................................................

   this.runnerTrack = this.STARTING_RUNNER_TRACK,

   // Pageflip timing for runner........................................

   this.runnerPageflipInterval = this.STARTING_PAGEFLIP_INTERVAL,
   
   // Scrolling direction...............................................

   this.scrollingDirection = this.STATIONARY,
   
   // Translation offsets...............................................

   this.backgroundOffset = this.STARTING_BACKGROUND_OFFSET,
   this.platformOffset = this.STARTING_PLATFORM_OFFSET,

   // Velocities........................................................

   this.bgVelocity = this.STARTING_BACKGROUND_VELOCITY,
   this.platformVelocity,
   this.spriteOffset = 0,

   // Platforms.........................................................

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
         pulsate:   false
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
   
   // Sprites...........................................................
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
   
   // Sprite artists...................................................

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


// snailBait.prototype ----------------------------------------------------


SnailBait.prototype = {
   // Drawing..............................................................

   draw: function (now) {
      this.setPlatformVelocity();
      this.setOffsets();

      this.drawBackground();
      this.drawRunner();
      
      this.updateSprites();
      this.drawSprites(); // only platforms for now
   },
   
   drawBackground: function () {
      this.context.save();
   
      this.context.globalAlpha = 1.0;
      this.context.translate(-this.backgroundOffset, 0);
   
      // Initially onscreen:
      this.context.drawImage(this.background, 0, 0,
                        this.background.width, this.background.height);
   
      // Initially offscreen:
      this.context.drawImage(this.background, this.background.width, 0,
                        this.background.width+1, this.background.height);
   
      this.context.restore();
   },
   
   drawRunner: function() {
   		this.context.drawImage(this.runnerImage, this.STARTING_RUNNER_LEFT,
   				this.calculatePlatformTop(this.runnerTrack) - this.runnerImage.height);
   },
   
   updateSprites: function (now) {
      var sprite;
   
      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];
         if (sprite.visible && this.isSpriteInView(sprite)) {
            sprite.update(now, this.fps, this.context, this.lastAnimationFrameTime);
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
      this.platformVelocity = this.bgVelocity * this.PLATFORM_VELOCITY_MULTIPLIER; 
   },
   
   setOffsets: function () {
      this.setBackgroundOffset();
      this.setSpriteOffset();
   },
   
   setBackgroundOffset: function() {
	   var offset = this.backgroundOffset + this.bgVelocity/this.fps;
	   
	   if (offset > 0 && offset < this.background.width) {
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
      var fps;

      if (this.lastAnimationFrameTime === 0) {
         this.lastAnimationFrameTime = now;
         return 60;
      }

      fps = 1000 / (now - this.lastAnimationFrameTime);
      this.lastAnimationFrameTime = now;
   
      if (now - this.lastFpsUpdateTime > 1000) {
         this.lastFpsUpdateTime = now;
         this.fpsElement.innerHTML = fps.toFixed(0) + ' fps';
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
   },

   turnRight: function () {
      this.bgVelocity = this.BACKGROUND_VELOCITY;
   },
   
   // Sprites..............................................................
 
   explode: function (sprite, silent) {
      sprite.exploding = true;
      this.explosionAnimator.start(sprite, true);  // true means sprite reappears
   },

   // Toast................................................................

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

   // Pause................................................................

   togglePaused: function () {
      var now = +new Date();

      this.paused = !this.paused;
   
      if (this.paused) {
         this.pauseStartTime = now;
      }
      else {
         this.lastAnimationFrameTime += (now - this.pauseStartTime);
      }
   },

   // Animation............................................................

   animate: function (now) { 
      if (snailBait.paused) {
         setTimeout( function () {
            requestNextAnimationFrame(snailBait.animate);
         }, snailBait.PAUSED_CHECK_INTERVAL);
      }
      else {
         snailBait.fps = snailBait.calculateFps(now); 
         snailBait.draw(now);
         requestNextAnimationFrame(snailBait.animate);
      }
   },
   
   // ------------------------- SPRITE CREATION ---------------------------
   
   createSprites : function() {
	   this.createPlatformSprites();
/* 	   this.createRunnerSprite(); */
	   this.addSpritesToSpriteArray(); // platforms only for now
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
   
           this.platforms.push(sprite);
	   }
   },
   
/*
   createRunnerSprite: function() {
	   this.runner = new Sprite('runner', this.runnerArtist);
	   
	   this.runner.width = this.RUNNER_CELLS_WIDTH;
	   this.runner.height = this.RUNNER_CELLS_HEIGHT; 
	   
	   this.sprites = [ this.runner ]; 
   },
*/
   
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

   // ------------------------- UTILITIES ---------------------------------
   
   isSpriteInGameCanvas: function(sprite) {
	   // returns true or false
	   return sprite.left + sprite.width > sprite.offset && 
	   		  sprite.left < sprite.offset + this.canvas.width;
   },
   
   isSpriteInView: function(sprite) {
	   return this.isSpriteInGameCanvas(sprite);
   },

   // ------------------------- INITIALIZATION ----------------------------

   start: function () {
      snailBait.splashToast('Good Luck!', 2000);

      requestNextAnimationFrame(snailBait.animate);
   },

   initializeImages: function () {
      this.background.src = 'images/background_level_one_dark_red.png';
      this.runnerImage.src = 'images/runner.png';
/*       this.spritesheet.src = 'images/spritesheet.png'; */
   
      this.background.onload = function (e) {
         snailBait.start();
      };
   },
};
   
// Event handlers.......................................................
   
window.onkeydown = function (e) {
   var key = e.keyCode;

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
      if (snailBait.runnerTrack === 3) {
         return;
      }

      snailBait.runnerTrack++;
   }
   else if (key === 70) { // 'f'
      if (snailBait.runnerTrack === 1) {
         return;
      }

      snailBait.runnerTrack--;
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

setTimeout(function() {
	snailBait.turnRight();
}, 1000);

