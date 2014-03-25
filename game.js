// ---------------------------------------------------------------------
// --------------------------- DECLARATIONS ----------------------------
// ---------------------------------------------------------------------

var SnailBait =  function () {

// ! HTML elements........................................................
	this.canvas = document.getElementById('game-canvas'),
	this.context = this.canvas.getContext('2d'),
   
	this.fpsElement = document.getElementById('fps'),
   
// ! Constants............................................................

	this.PLATFORM_HEIGHT = 8,  
	this.PLATFORM_STROKE_WIDTH = 2,
	this.PLATFORM_STROKE_STYLE = 'rgb(0,0,0)',
	
	this.STARTING_RUNNER_LEFT = 50,
	this.STARTING_RUNNER_TRACK = 1,

// ! Track baselines...................................................

	this.TRACK_1_BASELINE = 323,
	this.TRACK_2_BASELINE = 223,
	this.TRACK_3_BASELINE = 123,
	
	this.RUNNER_CELLS_WIDTH  = 50,
	this.RUNNER_CELLS_HEIGHT = 54,
	
	this.INITIAL_RUNNER_TRACK = 1,
	this.INITIAL_RUNNER_LEFT = 50,

// ! Images............................................................
   
	this.background  = new Image(),
	this.runnerImage = new Image(),
	
	this.paused = false,
	
	this.RUN_ANIMATION_RATE = 10,
	
	this.sprites			= [],
   
// ! Time..............................................................
   
	this.lastAnimationFrameTime = 0,
	this.lastFpsUpdateTime = 0,
	this.fps = 60,
   
// ! Spritesheet cells................................................

   this.runnerCellsRight = [
      { left: 414, top: 85, width: 47, height: this.RUNNER_CELLS_HEIGHT },
      { left: 362, top: 85, width: 44, height: this.RUNNER_CELLS_HEIGHT },
      { left: 314, top: 85, width: 39, height: this.RUNNER_CELLS_HEIGHT },
      { left: 265, top: 85, width: 46, height: this.RUNNER_CELLS_HEIGHT },
      { left: 205, top: 85, width: 49, height: this.RUNNER_CELLS_HEIGHT },
      { left: 150, top: 85, width: 46, height: this.RUNNER_CELLS_HEIGHT },
      { left: 96,  top: 85, width: 42, height: this.RUNNER_CELLS_HEIGHT },
      { left: 45,  top: 85, width: 35, height: this.RUNNER_CELLS_HEIGHT },
      { left: 0,   top: 85, width: 35, height: this.RUNNER_CELLS_HEIGHT }
   ],

   this.runnerCellsLeft = [
      { left: 0,   top: 5, width: 47, height: this.RUNNER_CELLS_HEIGHT },
      { left: 55,  top: 5, width: 44, height: this.RUNNER_CELLS_HEIGHT },
      { left: 107, top: 5, width: 39, height: this.RUNNER_CELLS_HEIGHT },
      { left: 152, top: 5, width: 46, height: this.RUNNER_CELLS_HEIGHT },
      { left: 208, top: 5, width: 49, height: this.RUNNER_CELLS_HEIGHT },
      { left: 265, top: 5, width: 46, height: this.RUNNER_CELLS_HEIGHT },
      { left: 320, top: 5, width: 42, height: this.RUNNER_CELLS_HEIGHT },
      { left: 380, top: 5, width: 35, height: this.RUNNER_CELLS_HEIGHT },
      { left: 425, top: 5, width: 35, height: this.RUNNER_CELLS_HEIGHT },
   ],
   
   this.runnerArtist = new SpriteSheetArtist(this.runnerImage, this.runnerCellsRight),

// ! Platforms.........................................................

   this.platformData = [  // One screen for now
      // Screen 1.......................................................
      {
         left:      10,
         width:     750,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(250,250,0)',
         opacity:   0.5,
         track:     1,
         pulsate:   false,
      },

/*
      {  left:      10,
         width:     750,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(150,190,255)',
         opacity:   1.0,
         track:     2,
         pulsate:   false,
      },

      {  left:      10,
         width:     750,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(250,0,0)',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },
*/
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
   };
   
};

SnailBait.prototype = {


// ! ------------------------- INITIALIZATION ----------------------------
   
   initializeImages: function () {
	   this.background.src = 'images/background_level_one_dark_red.png';
	   this.runnerImage.src = 'images/runner.png';
	
	   this.background.onload = function (e) {
	      snailBait.startGame();
	   };
	},
	
	startGame: function () {
		this.createRunnerSprite();
		requestNextAnimationFrame(snailBait.animate);
	},
	
	createRunnerSprite: function() {
	   this.runner = new Sprite('runner', this.runnerArtist, [this.runBehaviour]);
	   
	   this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
	   this.runner.width 	= this.RUNNER_CELLS_WIDTH;
	   this.runner.height 	= this.RUNNER_CELLS_HEIGHT; 
	   this.runner.left 	= this.INITIAL_RUNNER_LEFT;
	   this.runner.track 	= this.INITIAL_RUNNER_TRACK;
	   this.runner.top 		= this.calculatePlatformTop(this.runner.track) - this.RUNNER_CELLS_HEIGHT;
	   this.runner.lastAdvanceTime = 0;
	   
	   this.sprites = [ this.runner ];
   },
	
// ! ------------------------- UTILITIES ---------------------------------
	
	calculatePlatformTop: function (track) {
	   var top;
	
	   if      (track === 1) { top = this.TRACK_1_BASELINE; }
	   else if (track === 2) { top = this.TRACK_2_BASELINE; }
	   else if (track === 3) { top = this.TRACK_3_BASELINE; }
	
	   return top;
	},
	
	calculatePlatformTop: function (track) {
	   var top;
	
	   if      (track === 1) { top = this.TRACK_1_BASELINE; }
	   else if (track === 2) { top = this.TRACK_2_BASELINE; }
	   else if (track === 3) { top = this.TRACK_3_BASELINE; }
	
	   return top;
	},
	
	isSpriteInView: function(sprite) {
	    return this.isSpriteInGameCanvas(sprite);
    },
    
    isSpriteInGameCanvas: function(sprite) {
	   // returns true or false
	   return sprite.left + sprite.width > sprite.offset && sprite.left < sprite.offset + this.canvas.width;
    },
    
    calculateFps: function (now) {
      var fps = 1000 / (now - this.lastAnimationFrameTime);
      this.lastAnimationFrameTime = now;

      if (now - this.lastFpsUpdateTime > 1000) {
	      this.lastFpsUpdateTime = now;
	      this.fpsElement.innerHTML = fps.toFixed(0) + 'fps';
      }

      return fps; 
   },
	
// ! Drawing............................................................

	drawPlatforms: function () {
	   var pd, top;
	
	   this.context.save(); // Save context attributes
	   
	   for (var i=0; i < this.platformData.length; ++i) {
	      pd = this.platformData[i];
	      top = this.calculatePlatformTop(pd.track);
	
	      this.context.lineWidth 	= this.PLATFORM_STROKE_WIDTH;
	      this.context.strokeStyle 	= this.PLATFORM_STROKE_STYLE;
	      this.context.fillStyle 	= pd.fillStyle;
	      this.context.globalAlpha 	= pd.opacity;
	
	      // If you switch the order of the following two
	      // calls, you get a different effect.
	      this.context.strokeRect(pd.left, top, pd.width, pd.height);
	      this.context.fillRect  (pd.left, top, pd.width, pd.height);
	   }
	
	   this.context.restore(); // Restore context attributes
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
	
	drawBackground: function () {
	   this.context.drawImage(this.background, 0, 0);
	},
	
	draw: function (now) {
	   this.drawBackground();
	   this.drawPlatforms();
	   
	   this.updateSprites(now);
	   this.drawSprites();
	   
	},
	
// ! Animation............................................................

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
	
	updateSprites: function (now) {
		var sprite;
		
		for (var i=0; i < this.sprites.length; ++i) {
		 sprite = this.sprites[i];
		 if (sprite.visible && this.isSpriteInView(sprite)) {
		    sprite.update(now, this.fps);
		 }
		}
	},
	

};


// ! Launch game.........................................................

var snailBait = new SnailBait();
snailBait.initializeImages();
