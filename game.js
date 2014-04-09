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

// ! ------ SNAILBAIT CONSTRUCTOR -------------------------

var SnailBait =  function () {

   // ! HTML elements........................................................
  
   this.canvas = document.getElementById('game-canvas'),
   this.context = this.canvas.getContext('2d'),
   this.rulerCanvas = document.getElementById('ruler-canvas'),
   this.rulerContext = this.rulerCanvas.getContext('2d'),
   // Misc..................................................................
   this.toast = document.getElementById('toast'),
   this.livesElement = document.getElementById('lives'),
   this.creditsElement = document.getElementById('credits'),
   this.newGameLink = document.getElementById('new-game-link'),
   this.scoreElement = document.getElementById('score'),
   this.instructionsElement = document.getElementById('instructions'),
   this.loadingTitleElement = document.getElementById('loading-title'),
   this.tweetElement = document.getElementById('tweet-link'),
   // Slow running.............................................................
   this.runningSlowlyElement = document.getElementById('running-slowly'),
   this.slowlyOkayElement = document.getElementById('slowly-okay'),
   this.slowlyWarningElement = document.getElementById('slowly-warning'),
   // Images...............................................
   this.livesIconLeft = document.getElementById('life-icon-left'),
   this.livesIconMiddle = document.getElementById('life-icon-middle'),
   this.livesIconRight = document.getElementById('life-icon-right'),
   this.runnerAnimatedGIFElement = document.getElementById('runner-animated-gif'),
   // Sound and Music elements...............................................
   this.soundAndMusicElement = document.getElementById('sound-and-music'),
   this.soundCheckboxElement = document.getElementById('sound-checkbox'),
   this.musicCheckboxElement = document.getElementById('music-checkbox'),
   this.soundtrackElement = document.getElementById('soundtrack'),
   this.chimesSoundElement = document.getElementById('chimes-sound'),
   this.plopSoundElement = document.getElementById('plop-sound'),
   this.explosionSoundElement = document.getElementById('explosion-sound'),
   this.fallingWhistleSoundElement = document.getElementById('whistle-down-sound'),
   this.coinSoundElement = document.getElementById('coin-sound'),
   this.jumpWhistleSoundElement = document.getElementById('jump-sound'),
   this.thudSoundElement = document.getElementById('thud-sound'),
   // Developer backdoor elements...............................................
   this.developerBackdoorElement = document.getElementById('developer-backdoor'),
   this.collisionRectanglesCheckboxElement = document.getElementById('collision-rectangles-checkbox'),
   this.detectRunningSlowlyCheckboxElement = document.getElementById('detect-running-slowly-checkbox'),
   this.smokingHolesCheckboxElement = document.getElementById('smoking-holes-checkbox'),
   this.timeFactorReadoutElement = document.getElementById('time-rate-readout'),
   this.runningSlowlyReadoutElement = document.getElementById('running-slowly-readout'),
   this.backgroundOffsetReadout = document.getElementById('background-offset-readout'),

   // ! Constants............................................................

   this.LEFT = 1,
   this.RIGHT = 2,
   this.STATIONARY = 3,
   this.MAX_NUMBER_OF_LIVES = 3,
   this.SHORT_DELAY = 50,
   this.FPS_SLOW_CHECK_INTERVAL = 2000,
   this.DEFAULT_RUNNING_SLOWLY_THRESHOLD = 40,
   this.MAX_RUNNING_SLOWLY_THRESHOLD = 60,
   this.MAX_TIME_FACTOR = 2,
   this.TWEET_PREAMBLE = 'https://twitter.com/intent/tweet?text=I scored ';
   this.TWEET_PROLOGUE = ' playing this html5 Canvas platformer: ' +
   					   'http://bit.ly/NDV761/ &hashtags=html5';

   // Sound and Music Constants..............................................
   
   this.COIN_VOLUME = 0.3,
   this.SOUNDTRACK_VOLUME = 0.25,
   this.JUMP_WHISTLE_VOLUME = 0.1,
   this.PLOP_VOLUME = 0.40,
   this.THUD_VOLUME = 0.40,
   this.FALLING_WHISTLE_VOLUME = 0.10,
   this.EXPLOSION_VOLUME = 0.40,
   this.CHIMES_VOLUME = 0.3,

   // Background Constants.................................................
   
   this.BACKGROUND_WIDTH = 1102,  // Canvas width
   this.BACKGROUND_HEIGHT = 400,  // Canvas height
   this.BACKGROUND_VELOCITY = 42,
   this.STARTING_BACKGROUND_VELOCITY = 0,
   this.STARTING_BACKGROUND_OFFSET = 0,

   this.CANVAS_WIDTH_IN_METERS = 10, // Arbitrary Canvas width
   this.PIXELS_PER_METER = this.canvas.width / this.CANVAS_WIDTH_IN_METERS,
   this.GRAVITY_FORCE = 9.81, // meters per second squared

   this.PAUSED_CHECK_INTERVAL = 200,
   this.PLATFORM_HEIGHT = 8,  
   this.PLATFORM_STROKE_WIDTH = 2,
   this.PLATFORM_STROKE_STYLE = 'rgb(0,0,0)',
   this.STARTING_PLATFORM_OFFSET = 0,

   this.STARTING_PAGEFLIP_INTERVAL = -1,
   this.STARTING_RUNNER_VELOCITY = 0,
   this.CANVAS_TRANSITION_DURATION = 2000,

   // Track baselines...................................................

   this.TRACK_1_BASELINE = 323,
   this.TRACK_2_BASELINE = 223,
   this.TRACK_3_BASELINE = 123,

   // Animation Constants................................................
   
   // Platform scrolling offset (and therefore speed) is
   // PLATFORM_VELOCITY_MULTIPLIER * backgroundOffset: The
   // platforms move PLATFORM_VELOCITY_MULTIPLIER times as
   // fast as the background.
   
   this.BUTTON_PACE_VELOCITY = 80,
   this.SNAIL_PACE_VELOCITY = 50,
   this.PLATFORM_VELOCITY_MULTIPLIER = 4.35,
   this.RUN_ANIMATION_RATE = 30,
   this.RUBY_SPARKLE_DURATION = 200,
   this.RUBY_SPARKLE_INTERVAL = 500,
   this.RUNNER_EXPLOSION_DURATION = 1000,
   this.BAD_GUY_EXPLOSION_DURATION = 1500,
   this.SAPPHIRE_SPARKLE_DURATION = 200,
   this.SAPPHIRE_SPARKLE_INTERVAL = 300,
   this.SNAIL_BOMB_VELOCITY = 250,
   this.COIN_BOUNCE_DURATON = 2000,
   this.DEFAULT_TOAST_TIME = 2000,
      
   // Runner Constants ..................................................
   
   this.INITIAL_RUNNER_TRACK = 1,
   this.STARTING_RUNNER_TRACK = 1,
   this.INITIAL_RUNNER_LEFT = 50,
   this.RUNNER_HEIGHT = 43,
   this.RUNNER_JUMP_DURATION = 1000,
   this.RUNNER_JUMP_HEIGHT = 120,
   
   // ! Game variables.......................................................
   
   // Images ............................................................
   this.spritesheet = new Image(),
   // Misc  ............................................................
   this.skipIntro = false,
   this.lives = this.MAX_NUMBER_OF_LIVES,
   this.windowHasFocus = true,
   this.score = 0,
   this.scrollingDirection = this.STATIONARY,
   this.noScroll = false,
   // Developer backdoor................................................
   this.developerBackdoorVisible = false,
   this.runningSlowlySlider = new COREHTML5.Slider('blue', 'cornflowerblue'),
   this.timeFactorSlider = new COREHTML5.Slider('blue', 'red'),
   // Fps  ............................................................
   this.lastFpsUpdateTime = 0,
   this.fps = 60,
   this.runningSlowlyThreshold = this.DEFAULT_RUNNING_SLOWLY_THRESHOLD,
   this.slowFlags = 0,
   this.lastSlowWarningTime = 0,
   this.showSlowWarning = false,
   this.speedSamples = [60,60,60,60,60,60,60,60,60,60],
   this.speedSamplesIndex = 0,
   this.NUM_SPEED_SAMPLES = this.speedSamples.length,
   // Time ............................................................
   this.pauseStartTime = 0,
   this.totalTimePaused = 0,
   this.paused = false,
   this.timeSystem = new TimeSystem(); // See timeSystem.js
   this.timeFactor = 1.0; // 1.0 is normal; 0.5 is half-speed; etc.
   this.lastAnimationFrameTime = 0,
   // Runner ...........................................................
   this.runnerTrack = this.STARTING_RUNNER_TRACK,
   this.runnerPageflipInterval = this.STARTING_PAGEFLIP_INTERVAL,
   // Translation offsets ................................................
   this.backgroundOffset = this.STARTING_BACKGROUND_OFFSET,
   this.platformOffset = this.STARTING_PLATFORM_OFFSET,
   // Velocities......................................................
   this.bgVelocity = this.STARTING_BACKGROUND_VELOCITY,
   this.platformVelocity,
   this.spriteOffset = 0, 
   // Sound and Music....................................................
   this.soundOn = this.soundCheckboxElement.checked,
   this.musicOn = this.musicCheckboxElement.checked,
   this.audioTracks = [ // SnailBait can play up to 8 audiotracks simultaneously
       new Audio(), new Audio(), new Audio(), new Audio(),
       new Audio(), new Audio(), new Audio(), new Audio()
   ];
   
   // ! Sprite Sheet Constants..........................................
   
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

   this.batData = [
      { left: 370, 	top: this.TRACK_2_BASELINE - this.BAT_CELLS_HEIGHT,   width: 34 },
      { left: 660, 	top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT,   width: 46 },
      { left: 115, 	top: this.TRACK_2_BASELINE - 3*this.BAT_CELLS_HEIGHT, width: 35 }, 
      { left: 1720, top: this.TRACK_2_BASELINE - this.BAT_CELLS_HEIGHT,   width: 50 },
      { left: 1960, top: this.TRACK_3_BASELINE - 2*this.BAT_CELLS_HEIGHT, width: 34 },
   ],
   
   this.beeData = [
      { left: 500,  top: 64 },
      { left: 944,  top: this.TRACK_2_BASELINE - this.BEE_CELLS_HEIGHT - 30 },
      { left: 1600, top: 125 },
      { left: 2225, top: 125 },
      { left: 2295, top: 275 },
      { left: 2450, top: 275 },
   ],
   
   this.buttonData = [
      { platformIndex: 7 },
      { platformIndex: 12 },
   ],

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

   this.rubyData = [
      { left: 200,  top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },
      { left: 880,  top: this.TRACK_2_BASELINE - this.RUBY_CELLS_HEIGHT },
      { left: 1100, top: this.TRACK_2_BASELINE - 2*this.SAPPHIRE_CELLS_HEIGHT }, 
      { left: 1475, top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },
   ],

   this.sapphireData = [
      { left: 680,  top: this.TRACK_1_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },
      { left: 1700, top: this.TRACK_2_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },
      { left: 2056, top: this.TRACK_2_BASELINE - 3*this.SAPPHIRE_CELLS_HEIGHT/2 },
      { left: 2333, top: this.TRACK_2_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },
   ],

   this.snailData = [
      { platformIndex: 13 },
   ],

   this.smokingHoleData = [
   	  { left: 248, top: this.TRACK_2_BASELINE - 22 },
   	  { left: 688, top: this.TRACK_3_BASELINE + 5  },
   	  { left: 1352, top: this.TRACK_3_BASELINE - 18 },
   ],
   

   // ! Platforms coordinate on canvas (data)...........................

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
   
   // ! Sprite Arrays.................................................
   
   this.bats			= [],
   this.bees			= [],
   this.buttons			= [],
   this.coins			= [],
   this.platforms		= [],
   this.rubies			= [],
   this.sapphires		= [],
   this.smokingHoles	= [],
   this.snails			= [],
   this.sprites			= [], // holds all the sprites 
   
   // ! Sprites behaviors...............................................
   
   this.runBehaviour = {
	   
	  lastAdvanceTime: 0,
      
      execute : function(sprite, time, fps) {
        
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
   	  
   	  pause : function (sprite, now) {
         if (sprite.ascendAnimationTimer.isRunning()) {
            sprite.ascendAnimationTimer.pause(now);
         }
         else if (!sprite.descendAnimationTimer.isRunning()) {
            sprite.descendAnimationTimer.pause(now);
         }
      },

      unpause : function (sprite, now) {
         if (sprite.ascendAnimationTimer.isRunning()) {
            sprite.ascendAnimationTimer.unpause(now);
         }
         else if (sprite.descendAnimationTimer.isRunning()) {
            sprite.descendAnimationTimer.unpause(now);
         }
      },

      jumpIsOver : function (sprite, now) {
         return ! sprite.ascendAnimationTimer.isRunning(now) &&
                ! sprite.descendAnimationTimer.isRunning(now);
      },
      
   	  // Ascent...............................................................

      isAscending : function (sprite, now) {
         return sprite.ascendAnimationTimer.isRunning(now);
      },
      
      ascend : function (sprite, now) {
         var elapsed = sprite.ascendAnimationTimer.getElapsedTime(now),
             deltaH  = elapsed / (sprite.JUMP_DURATION/2) * sprite.JUMP_HEIGHT;

         sprite.top = sprite.verticalLaunchPosition - deltaH;
      },

      isDoneAscending : function (sprite, now) {
         return sprite.ascendAnimationTimer.getElapsedTime(now) > sprite.JUMP_DURATION/2;
      },
      
      finishAscent : function (sprite, now) {
         sprite.jumpApex = sprite.top;
         sprite.ascendAnimationTimer.stop(now);
         sprite.descendAnimationTimer.start(now);

		 sprite.track++;
		 console.log(sprite.track);
		 sprite.top = snailBait.calculatePlatformTop(sprite.track) - sprite.height;
      },
      
      // Descents.............................................................

      isDescending : function (sprite, now) {
         return sprite.descendAnimationTimer.isRunning(now);
      },

      descend : function (sprite, now) {
         var elapsed = sprite.descendAnimationTimer.getElapsedTime(now),
             deltaH  = elapsed / (sprite.JUMP_DURATION/2) * sprite.JUMP_HEIGHT;

         sprite.top = sprite.jumpApex + deltaH;
      },
      
      isDoneDescending : function (sprite, now) {
         return sprite.descendAnimationTimer.getElapsedTime(now) > sprite.JUMP_DURATION/2;
      },

      finishDescent : function (sprite, now) {
         sprite.top = sprite.verticalLaunchPosition;
         sprite.stopJumping();
      },
      
      // Execute..............................................................
      
	   execute : function(sprite, now, fps) {
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
   
	  execute : function (sprite, now, fps) {
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
	   
	   execute : function (sprite, now, fps) {
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
	   
	   execute : function(sprite, now, fps) {  // sprite is the bomb
         if (sprite.visible && snailBait.isSpriteInView(sprite)) {
            sprite.left -= snailBait.SNAIL_BOMB_VELOCITY / fps;
         }

         if (!snailBait.isSpriteInView(sprite)) {
            sprite.visible = false;
         }
      }
   },
   
   this.collideBehavior = {
   
   		
   		isCandidateForCollision : function(sprite, otherSprite) {
   		
   			if (otherSprite.type === 'smoking hole') {
	   			return false;
   			}
   			
	   		var r = sprite.calculateCollisionRectangle(),
	   			o = otherSprite.calculateCollisionRectangle();
	   			
	   		return sprite !== otherSprite && sprite.visible && otherSprite.visible &&
	   					  !sprite.exploding && !otherSprite.exploding && 
	   					  o.left < r.right;
   		},
   		
   		didRunnerCollideWithOthersprite : function(otherSprite) {
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
   		
   		didCollide : function(sprite, otherSprite) {
	   		return this.didRunnerCollideWithOthersprite(otherSprite);
   		},
   		
   		processPlatformCollisionDuringJump : function(sprite, platform) {
	   		var isDescending = sprite.descendAnimationTimer.isRunning();
	   		
	   		if (isDescending) {
		   		sprite.track = platform.track;
		   		sprite.top = snailBait.calculatePlatformTop(sprite.track) - sprite.height;
	   		}
	   		else {
	   			snailBait.playSound(snailBait.plopSoundElement);
		   		sprite.fall();
	   		}
	   		sprite.stopJumping();
   		},
   		
   		processCollision : function(sprite, otherSprite) {
	   		
	   		if (otherSprite.value) {
		   		snailBait.score += otherSprite.value;
		   		snailBait.score = snailBait.score < 0 ? 0 : snailBait.score;
		   		snailBait.updateScoreElement();
	   		}
	   		if (sprite.jumping && 'platform' === otherSprite.type) {
		   		this.processPlatformCollisionDuringJump(sprite, otherSprite);
	   		}
	   		else if ('coin' 	  === otherSprite.type ||
	   				 'sapphire'   === otherSprite.type ||
	   				 'ruby' 	  === otherSprite.type) {
		   		otherSprite.visible = false;
		   		
		   		if ('coin' === otherSprite.type) {
			   		snailBait.playSound(snailBait.coinSoundElement);
		   		}
		   		if ('sapphire' === otherSprite.type || 'ruby' === otherSprite.type) {
			   		snailBait.playSound(snailBait.chimesSoundElement);
		   		}	 
	   		}
	   		else if ('button' === otherSprite.type && (sprite.falling || sprite.jumping)) {
		   		if (!(sprite.jumping && sprite.ascendAnimationTimer.isRunning())) {
			   		// Descending while jumping or falling
			   		console.log('button detonating');
			   		otherSprite.detonating = true;
		   		}
	   		}
	   		
	   		if ('bat'	=== otherSprite.type ||
	   			'bee' 	=== otherSprite.type ||
	   			'snail bomb' === otherSprite.type) {
		   			snailBait.explode(sprite);
		   			snailBait.shake();
		   			
		   			setTimeout(function() {
		   				snailBait.loseLife();
		   				snailBait.reset();
		   			}, snailBait.RUNNER_EXPLOSION_DURATION);
	   		}
	   		
	   		if ('snail' === otherSprite.type) {
		   		otherSprite.visible = false;
		   		snailBait.showWinAnimation();
	   		}
   		},
   
	    execute : function (sprite, time, fps) {
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
   
   this.fallBehavior = {
   
	   pause : function(sprite, now) {
		   sprite.fallAnimationTimer.pause(now);
	   },
	   
	   unpause : function(sprite, now) {
		   sprite.fallAnimationTimer.unpause(now);
	   },
	   
	   isOutOfPlay : function(sprite) {
		   return sprite.top > snailBait.canvas.height;
	   },
	   
	   setSpriteVelocity : function(sprite, now) {
		   sprite.velocityY = sprite.initialVelocityY + snailBait.GRAVITY_FORCE *
		   					  (sprite.fallAnimationTimer.getElapsedTime(now)/1000) *
		   					  snailBait.PIXELS_PER_METER;
	   },
	   
	   calculateVerticalDrop : function(sprite, now, lastAnimationFrameTime) {
		   return sprite.velocityY * (now - lastAnimationFrameTime) / 1000;
	   },
	   
	   willFallBelowCurrentTrack : function(sprite, dropDistance) {
		    var will = sprite.top + sprite.height + dropDistance > snailBait.calculatePlatformTop(sprite.track);
		    
		    var rp = sprite.top + sprite.height + dropDistance;
		    var pp = snailBait.calculatePlatformTop(sprite.track);
		    
		    var will = rp > pp;
		    

		    return will;
	   },
	   
	   fallOnPlatform : function(sprite) {
		   sprite.top = snailBait.calculatePlatformTop(sprite.track) - sprite.height;
		   sprite.stopFalling();
		   
		   snailBait.playSound(snailBait.thudSoundElement);
	   },
	   
	   execute : function (sprite, now, fps, lastAnimationFrameTime) {
			var dropDistance;
			
			if (sprite.jumping) {
				return;
			}
			
			if (!sprite.falling) {
				if (!snailBait.platformUnderneath(sprite, sprite.track)) {
					sprite.fall();
				}
				return;
			}
			if (this.isOutOfPlay(sprite) || sprite.exploding) {
				if (sprite.falling) {
					sprite.stopFalling();
				}
				
				if (this.isOutOfPlay(sprite)) {
					snailBait.loseLife();
	   				setTimeout(function() {
		   				snailBait.reset();
		   			}, snailBait.RUNNER_EXPLOSION_DURATION);
				}
				
				return;
			}
			
			this.setSpriteVelocity(sprite, now);
			
			dropDistance = this.calculateVerticalDrop(sprite, now, lastAnimationFrameTime);
			
			if (!this.willFallBelowCurrentTrack(sprite, dropDistance)) {
				sprite.top += dropDistance;
			}
			else {
				if (snailBait.platformUnderneath(sprite, sprite.track)) {
					this.fallOnPlatform(sprite);
					sprite.stopFalling();
				}
				else {
					sprite.track--;
					sprite.top += dropDistance;
					console.log(sprite.track);
					
					if (sprite.track === 0) {
						snailBait.playSound(snailBait.fallingWhistleSoundElement);
					}
				}
			}
	    }
   },
   
   this.runnerExplodeBehavior = new AnimatorBehavior(this.explosionCells,
   													 this.RUNNER_EXPLOSION_DURATION,
   													 function(sprite, now, fps) {
	   													 return sprite.exploding;
   													 },
   													 function(sprite, animator) {
	   													 sprite.exploding = false;
   													 }),
   													 
   this.badGuyExplodeBehavior = new AnimatorBehavior(this.explosionCells,
   														  this.BAD_GUY_EXPLOSION_DURATION,
   														  function(sprite, now, fps) {
	   														  return sprite.exploding;
   														  },
   														  function(sprite, animator) {
	   														  sprite.exploding = false;
   														  }),
   														  
   this.buttonDetonateBehavior = {
	   
	   execute : function(sprite, now, fps, lastAnimationFrameTime) {
		   var BUTTON_REBOUND_DELAY = 1000;
		   
		   if (!sprite.detonating) { // trigger
			   return;
		   }
		   
		   sprite.artist.cellIndex = 1; // flatten
		   snailBait.blowupBats();
		   snailBait.blowupBees();
		   
		   setTimeout(function() {
			   sprite.artist.cellIndex = 0; // rebound
			   sprite.detonating = false; // reset trigger
		   }, BUTTON_REBOUND_DELAY);
	   }
   },
   
   // ! Sprite artists.................................................

   this.runnerArtist = new SpriteSheetArtist(this.spritesheet, this.runnerCellsRight),

   this.platformArtist = {
      draw : function (sprite, context) {
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


// ! --------- SNAILBAIT PROTOTYPE ----------------------------


SnailBait.prototype = {
   
   // ! -------------- DRAWING ------------------------------------

   draw: function (now, lastAnimationFrameTime) {
   
   	  if (!this.paused) {
	   	  this.setPlatformVelocity(now);
	      this.setOffsets(now);
	      this.updateSprites(now, lastAnimationFrameTime);
   	  }
      
      this.drawBackground();
      this.drawSprites(); 
      
      if (this.developerBackdoorVisible) {
	      this.drawRuler();
	      
	      this.backgroundOffsetReadout.innerHTML =
	      	   this.spriteOffset.toFixed(0);
      }
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
   
   updateSprites: function (now, lastAnimationFrameTime) {
      var sprite;
   
      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];
         if (sprite.visible && this.isSpriteInView(sprite)) {
            sprite.update(now, this.fps, this.context, lastAnimationFrameTime);
         }
      }
   },
   
   drawSprites: function() {
      
      // we draw smoking holes first so they are underneath
      // all other sprites
      this.drawSmokingHoles();
      
      for (var i=0; i < this.sprites.length; ++i) {
      	  
      	  if (this.sprites[i].type === 'smoking hole') {
	      	  continue; // jump to next index
      	  }
      	  
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
   
   drawSmokingHoles: function() {
	   for (var i = 0; i < this.smokingHoles.length; ++i) {
		   this.drawSprite(this.smokingHoles[i]);
	   }
   },
   
   drawRuler: function() {
	   var majorTickSpacing = 50,
	   	   minorTickSpacing = 10,
	   	   i;
	   
	   this.rulerContext.lineWidth = 0.5;
	   this.rulerContext.fillStyle = 'blue';
	   
	   this.rulerContext.clearRect(0,0, this.rulerCanvas.width,
	   									this.rulerCanvas.height);
	   
	   for (i = 0; i < this.BACKGROUND_WIDTH; i += minorTickSpacing) {
		   if (i === 0) {
			   continue;
		   }
		   
		   if (i % majorTickSpacing === 0) {
			   this.rulerContext.beginPath();
			   this.rulerContext.moveTo(i + 0.5, this.rulerCanvas.height/2 + 2);
			   this.rulerContext.lineTo(i + 0.5, this.rulerCanvas.height);
			   this.rulerContext.stroke();
			   this.rulerContext.fillText( (this.spriteOffset + i).toFixed(0), i-10, 10);
		   }
		   
		   this.rulerContext.beginPath();
		   this.rulerContext.moveTo(i + 0.5, 3*this.rulerCanvas.height/4);
		   this.rulerContext.lineTo(i + 0.5, this.rulerCanvas.height);
		   this.rulerContext.stroke();
	   }
   },
   
   // ! ------------- GAMEPLAY ------------------------------------
   
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
   
   loseLife: function() {
	   this.lives--;
	   this.updateLivesElement();
	   
	   if (this.lives === 1) {
		   snailBait.splashToast('Last chance!');
	   }
	   
	   if (this.lives === 0) {
		   this.gameOver();
	   }
   },
   
   gameOver: function() {
	   snailBait.splashToast('Game Over');
	   snailBait.revealCredits();
	   snailBait.startTransition();
   },
   
   updateScoreElement: function() {
	   this.scoreElement.innerHTML = this.score;
   },
   
   startTransition: function() {
	   var TRANSITION_TIME_RATE = 0.2;
	   
	   this.transitioning = true;
	   this.setTimeRate(TRANSITION_TIME_RATE);
   },
   
   endTransition: function() {
	   this.transitioning = false;
	   this.setTimeRate(1.0);
   },
   
   reset: function() {
	   var REVEAL_RUNNER_DURATION = 1000,
	   	   CONTINUE_RUNNING_DURATION = 500;
	   	   
	   snailBait.runner.exploding = false;
	   snailBait.runner.visible = false;
	   snailBait.runner.artist.cells = snailBait.runnerCellsRight;
	   
	   if (snailBait.runner.jumping) { snailBait.runner.stopJumping(); };
	   if (snailBait.runner.falling) { snailBait.runner.stopFalling(); };
	   
	   snailBait.startTransition(); // Turns off some processing
	   snailBait.canvas.style.opacity = 0; // Triggers CSS transitions
	   
	   setTimeout(function() {
		   snailBait.backgroundOffset = snailBait.STARTING_BACKGROUND_OFFSET;
		   snailBait.spriteOffset = snailBait.STARTING_BACKGROUND_OFFSET;
		   snailBait.bgVelocity = snailBait.STARTING_BACKGROUND_VELOCITY;
		   
		   for (var i=0; i < snailBait.sprites.length; ++i) {
			   snailBait.sprites[i].visible = true;
		   }
		   
		   snailBait.canvas.style.opacity = 1.0; // Triggers CSS transitions
		   
		   setTimeout(function() {
			   snailBait.runner.visible = true;
			   
			   setTimeout(function() {
				   snailBait.runner.runAnimationRate = snailBait.RUN_ANIMATION_RATE;
				   snailBait.endTransition();
			   }, CONTINUE_RUNNING_DURATION);
		   }, REVEAL_RUNNER_DURATION);
		   
	   }, snailBait.CANVAS_TRANSITION_DURATION);
	   
	   
   },
   
   restartGame: function() {
	   this.lives = this.MAX_NUMBER_OF_LIVES;
	   this.updateLivesElement();
	   this.creditsElement.style.opacity = 0;
	   
	   setTimeout(function() {
		   snailBait.creditsElement.style.display = 'none';
		   snailBait.endTransition();
	   }, this.CANVAS_TRANSITION_DURATION);
   },
    
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
   
   updateLivesElement: function() {
	   if (this.lives === 3) {
		   this.livesIconLeft.style.opacity = 1.0;
		   this.livesIconMiddle.style.opacity = 1.0;
		   this.livesIconRight.style.opacity = 1.0;
	   }
	   else if (this.lives === 2) {
		   this.livesIconLeft.style.opacity = 1.0;
		   this.livesIconMiddle.style.opacity = 1.0;
		   this.livesIconRight.style.opacity = 0;
	   }
	   else if (this.lives === 1) {
		   this.livesIconLeft.style.opacity = 1.0;
		   this.livesIconMiddle.style.opacity = 0;
		   this.livesIconRight.style.opacity = 0;
	   }
	   else if (this.lives === 0) {
		   this.livesIconLeft.style.opacity = 0;
		   this.livesIconMiddle.style.opacity = 0;
		   this.livesIconRight.style.opacity = 0;
	   }
   },

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
   
   showRunningSlowlyWarning: function(now, averageSpeed) {
   
	   this.slowlyWarningElement.innerHTML = 
	        "Snail Bait is running at <font color='red'>"   +
	        averageSpeed.toFixed(0) + "</font>"			    +
	        " frames/second (fps), but it needs more than " +
	        this.runningSlowlyThreshold						+
	        " fps for the game to work correctly."
	        
	   this.runningSlowlyElement.style.display = 'block';
	   
	   setTimeout(function() {
		   snailBait.runningSlowlyElement.style.opacity = 1.0;
	   }, snailBait.SHORT_DELAY);
	   
	   this.lastSlowWarningTime = now;
   },

   // ! ------------ ANIMATION --------------------------------

   animate: function (now) { 
   
   	  now = snailBait.timeSystem.calculateGameTime();
   	  
      if (snailBait.paused) {
         setTimeout( function () {
            requestNextAnimationFrame(snailBait.animate);
         }, snailBait.PAUSED_CHECK_INTERVAL);
      }
      else {
         snailBait.fps = snailBait.calculateFps(now); 
         
         if (snailBait.showSlowWarning && !snailBait.paused) {
	         snailBait.checkFps(now);
         }
         snailBait.draw(now, snailBait.lastAnimationFrameTime);
         snailBait.lastAnimationFrameTime = now; // used in extended execute behavior !
         requestNextAnimationFrame(snailBait.animate);
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
   
   explode: function (sprite, silent) {
  	   
  	   if (sprite.exploding) {
	  	   return;
  	   }
  	   
  	   if (sprite.jumping) {
	  	   sprite.stopJumping();
  	   }
  	   
  	   if (sprite.runAnimationRate === 0) {
	  	   sprite.runAnimationRate = this.RUN_ANIMATION_RATE;
  	   }
  	   
  	   sprite.exploding = true;
  	   
  	   if (!silent) {
	  	   this.playSound(this.explosionSoundElement);
  	   }
   },
   
   shake: function() {
   		var originalBackgroundVelocity = snailBait.bgVelocity,
   			SHAKE_INTERVAL = 90;
   			
   		this.bgVelocity = -this.BACKGROUND_VELOCITY;
   		
   		setTimeout(function(e) {
	   		snailBait.bgVelocity = snailBait.BACKGROUND_VELOCITY;
	   		setTimeout(function() {
		   		snailBait.bgVelocity = -snailBait.BACKGROUND_VELOCITY;
		   			setTimeout(function() {
			   			snailBait.bgVelocity = snailBait.BACKGROUND_VELOCITY;
			   				setTimeout(function() {
				   				snailBait.bgVelocity = -snailBait.BACKGROUND_VELOCITY;
				   					setTimeout(function() {
					   					snailBait.bgVelocity = snailBait.BACKGROUND_VELOCITY;
					   						setTimeout(function() {
						   						snailBait.bgVelocity = -snailBait.BACKGROUND_VELOCITY;
						   							setTimeout(function() {
							   							snailBait.bgVelocity = snailBait.BACKGROUND_VELOCITY;
							   								setTimeout(function() {
								   								snailBait.bgVelocity = -snailBait.BACKGROUND_VELOCITY;
							   								}, SHAKE_INTERVAL);
						   							}, SHAKE_INTERVAL);
					   						}, SHAKE_INTERVAL);
				   					}, SHAKE_INTERVAL);
			   				}, SHAKE_INTERVAL);
		   			}, SHAKE_INTERVAL);
	   		}, SHAKE_INTERVAL);
   		}, SHAKE_INTERVAL);
   },
   
   blowupBees: function() {
	   var i, 
	       bee,
	   	   numBees = snailBait.bees.length;
	   	   
	   for (i=0; i < numBees; ++i) {
		   bee = snailBait.bees[i];
		   if (bee.visible) {
			   snailBait.explode(bee, true);
		   }
	   }
   },
   
   blowupBats: function() {
	   var i, 
	       bat,
	   	   numBats = snailBait.bats.length;
	   	   
	   for (i=0; i < numBats; ++i) {
		   bat = snailBait.bats[i];
		   if (bat.visible) {
			   snailBait.explode(bat, true);
		   }
	   }
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
   
   showWinAnimation: function() {
	   this.bgVelocity = 0;
	   this.runnerAnimatedGIFElement.style.display = 'block';
	   this.scoreElement.innerHTML = 'Winner';
	   this.runner.opacity = 0;
	   this.startTransition();
	   this.canvas.style.opacity = 0.1;
	   
	   setTimeout(function() {
		   snailBait.runnerAnimatedGIFElement.style.opacity = 1.0;
	   }, snailBait.SHORT_DELAY);
	   
	   setTimeout(function() {
		   snailBait.runnerAnimatedGIFElement.style.opacity = 0;
		   setTimeout(function() {
			   snailBait.canvas.style.opacity = 1.0;
			   snailBait.runnerAnimatedGIFElement.style.display = 'none';
			   snailBait.scoreElement.innerHTML = snailBait.score;
			   snailBait.runner.opacity = 1.0;
			   snailBait.endTransition();
			   snailBait.putSpriteOnTrack(snailBait.runner, 3);
			   snailBait.reset();
		   }, 2000);
	   }, 4000);
   },
   
   dimControls: function() {
	   var DIM = 0.5,
	   	   INSTRUCTIONS_DIMMING_DELAY = 5000,
	   	   instructionsElement = document.getElementById('instructions');
	   
	   setTimeout(function(e) {
	   	   instructionsElement.style.opacity = DIM;
		   snailBait.soundAndMusicElement.style.opacity = DIM;
	   }, INSTRUCTIONS_DIMMING_DELAY);
   },
   
   // ! ---------- SPRITE CREATION ---------------------------
   
   createSprites: function(now) {
	   
	   this.createPlatformSprites(now);
	   this.createRunnerSprite();
	   
	   this.createBatSprites();
	   this.createBeeSprites();
	   this.createButtonSprites();
	   this.createCoinSprites();
	   this.createRubySprites();
	   this.createSapphireSprites();
	   this.createSnailSprites();
	   this.createSmokingHoles();
	   
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
	   														  this.collideBehavior,
	   														  this.fallBehavior,
	   														  this.runnerExplodeBehavior]);
	   
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
         if (i % 2 === 0) bat = new Sprite('bat', batArtist, [new CycleBehavior(200, 400),
         													  this.badGuyExplodeBehavior]);
         else             bat = new Sprite('bat', redEyeBatArtist, [new CycleBehavior(200, 600),
         															this.badGuyExplodeBehavior]);

         bat.width = this.batData[i].width;
         bat.height = this.BAT_CELLS_HEIGHT;
         
         bat.value = -100;
         
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
         bee = new Sprite('bee', beeArtist, [new CycleBehavior(200, 300),
         									 this.badGuyExplodeBehavior]);

         bee.width = this.BEE_CELLS_WIDTH;
         bee.height = this.BEE_CELLS_HEIGHT;
         
         bee.value = -150;
         
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
            button = new Sprite('button', goldButtonArtist, [this.paceBehavior,
            												 this.buttonDetonateBehavior]);
         }
         else {
            button = new Sprite('button', buttonArtist, [this.paceBehavior,
            											 this.buttonDetonateBehavior]);
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
         
         coin.value = 100;
         										
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
         										   new CycleBehavior(300, 1500),
         										   this.badGuyExplodeBehavior]);

         snail.width  = this.SNAIL_CELLS_WIDTH;
         snail.height = this.SNAIL_CELLS_HEIGHT;

         snail.velocityX = this.SNAIL_PACE_VELOCITY;
         snail.direction = this.RIGHT;
         
         this.snails.push(snail);
      }
   },
   
   createSmokingHoles: function() {
	   var data;
	   
	   for (var i = 0; i < this.smokingHoleData.length; ++i) {
		   data = this.smokingHoleData[i];
		   
		   this.smokingHoles.push(
		   		new SmokingHole(30, // number of smoke bubbles
		   						3,  // number of fire particles
		   						data.left, data.top, 15)); // left, top, width
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
			this.sprites.push(this.smokingHoles[i]);
		}
   },

   // ! --------------- UTILITIES ---------------------------------
   
   isSpriteInGameCanvas: function(sprite) {
	   // returns true or false
	   return sprite.left + sprite.width > sprite.offset && sprite.left < sprite.offset + this.canvas.width;
   },
   
   isSpriteInView: function(sprite) {
	   return this.isSpriteInGameCanvas(sprite);
   },
   
   putSpriteOnTrack: function(sprite, track) {
   	  sprite.track = track;
      sprite.top  = this.calculatePlatformTop(sprite.track) - sprite.height;
   },
   
   putSpriteOnPlatform: function(sprite, platformSprite) {
      sprite.top  = platformSprite.top - sprite.height;
      sprite.left = platformSprite.left;
      sprite.platform = platformSprite;
   },
   
   platformUnderneath: function(sprite, track) {
	   var platform,
	   	   platformUnderneath,
	   	   sr = sprite.calculateCollisionRectangle(), // sprite rectangle
	   	   pr, // platform rectangle
	   	   VERTICAL_THRESHOLD = 15;
	   	   
	   if (track === undefined) {
		   track = sprite.track; // Look on sprite track only
	   }
	   
	   for (var i=0; i < snailBait.platforms.length; ++i) {
		   platform = snailBait.platforms[i];
		   pr = platform.calculateCollisionRectangle();
		   
		   if (track === platform.track) {
			   if (sr.right > pr.left && sr.left < pr.right &&
			   	   pr.top >= sr.bottom &&
			   	   pr.top - sr.bottom < VERTICAL_THRESHOLD) {
				   
				   platformUnderneath = platform;
				   break;
			   }
		   }
	   }
	   return platformUnderneath;
   },
   
   isCandidateForCollision: function (sprite, otherSprite) {
         return sprite !== otherSprite &&
                sprite.visible && otherSprite.visible &&
                !sprite.exploding && !otherSprite.exploding &&
                otherSprite.left - otherSprite.offset <
                sprite.left - sprite.offset + sprite.width;
   },
   
   checkFps: function(now) {
	   var averageSpeed;
	   
	   if (this.windowHasFocus) {
		   if (now - this.lastSlowWarningTime > this.FPS_SLOW_CHECK_INTERVAL) {
			   this.updateSpeedSamples(snailBait.fps);
			   
			   averageSpeed = this.calculateAverageSpeed();
			   
			   if (averageSpeed < this.runningSlowlyThreshold) {
				   this.showRunningSlowlyWarning(now, averageSpeed);
			   }
		   }
	   }
   },
   
   updateSpeedSamples: function(fps) {
	   this.speedSamples[this.speedSamplesIndex] = fps;
	   
	   if (this.speedSamplesIndex !== this.NUM_SPEED_SAMPLES-1) { 
		   this.speedSamplesIndex++;
	   }
	   else {
		   this.speedSamplesIndex = 0;
	   }
   },
   
   calculateAverageSpeed: function() {
	   var i,
	       total = 0;
	   
	   for (i = 0; i < this.NUM_SPEED_SAMPLES; i++) {
		   total += this.speedSamples[i];
	   }
	   
	   return total/this.NUM_SPEED_SAMPLES;
   },
   
   calculateFps: function (now) {
      var fps = 1000 / (now - this.lastAnimationFrameTime) * this.timeFactor;
/*       this.lastAnimationFrameTime = now; */

      if (now - this.lastFpsUpdateTime > 1000) {
	      this.lastFpsUpdateTime = now;
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
   
   soundIsPlaying: function (sound) {
      return !sound.ended && sound.currentTime > 0;
   },
   
   playSound: function (sound) {
      var track, index;

      if (this.soundOn) {
         if (!this.soundIsPlaying(sound)) {
            sound.play();
         }
         else {
            for (i=0; index < this.audioTracks.length; ++index) {
               track = this.audioTracks[index];
            
               if (!this.soundIsPlaying(track)) {
                  track.src = sound.currentSrc;
                  track.load();
                  track.volume = sound.volume;
                  track.play();

                  break;
               }
            }
         }              
      }
   },
   
   revealDeveloperBackdoor: function() {
	   
	   this.developerBackdoorElement.style.display = 'block';
	   this.rulerCanvas.style.display = 'block';
	   
	   this.runningSlowlySlider.appendTo('running-slowly-slider');
	   this.timeFactorSlider.appendTo('time-rate-slider');
	   
	   this.runningSlowlySlider.draw(
	   	   this.runningSlowlyThreshold / 
	   	   this.MAX_RUNNING_SLOWLY_THRESHOLD
	   );
	   
	   this.timeFactorSlider.draw(
	   	   this.timeFactor / this.MAX_TIME_FACTOR
	   );
	   	   
	   this.developerBackdoorElement.style.opacity = 1.0;
	   this.rulerCanvas.style.opacity = 1.0;
	   this.canvas.style.cursor = 'move';
	   
	   this.developerBackdoorVisible = true;
   },
   
   windowToCanvas: function(x, y) {
	   var bbox = this.canvas.getBoundingClientRect();
	   
	   return { x: x - bbox.left * (this.canvas.width / bbox.width),
		   		y: y - bbox.top * (this.canvas.height / bbox.height)
	   };
   },
   
   // ! ------------- INITIALIZATION ----------------------------

   start: function () {
   
      var GOOD_LUCK_PAUSE = 1000,
      	  GOOD_LUCK_DURATION = 2000,
      	  REVEAL_PAUSE = 200,
      	  LOADING_PAUSE = 2000;
      
      if (this.skipIntro === true) {
	      this.revealGame();
	      this.startAnimation();
	      return;
      }
      
      setTimeout(function() {
	      snailBait.hideLoadingScreen();
	      
	      setTimeout(function() {
		      setTimeout(function() {
			      snailBait.splashToast('Good Luck!', GOOD_LUCK_DURATION);
		      }, GOOD_LUCK_PAUSE);
		      
		      snailBait.revealGame();
		      snailBait.startAnimation();
		      
	      }, REVEAL_PAUSE);
      }, LOADING_PAUSE);
      
   },
   
   begin: function() {
   		this.dimControls();
   		this.checkRuntimeFlags();
	    this.initializeImages();
		this.initializeSoundAndMusic();
		this.createSprites();
		this.setTimeRate(1.0); // 1.0 is normal; 0.5 is half-speed; etc.
		this.equipRunner();
   },
   
   startAnimation: function() {
	   if (this.soundOn && this.musicOn) {
		   this.playSound(this.soundtrackElement);
	   }
	   this.animate();
/* 	   this.showSlowWarning = true; */
   },
   
   setTimeRate: function(rate) {
	   this.timeFactor = rate;
	   
	   this.timeSystem.setTransducer(function(percent) {
		   return percent * snailBait.timeFactor;
	   });
   },

   initializeImages: function () {
	  this.runnerAnimatedGIFElement.src = 'images/animated.gif';
      this.spritesheet.src = 'images/mySpritesheet.png';
   
      this.spritesheet.onload = function(e) {
         snailBait.start();
      };
   },
   
   initializeSoundAndMusic: function() {
	   snailBait.soundOn = snailBait.soundCheckboxElement.checked;
	   snailBait.musicOn = snailBait.musicCheckboxElement.checked;
	   
	   this.soundtrackElement.volume 		  = this.SOUNDTRACK_VOLUME;
	   this.plopSoundElement.volume 		  = this.PLOP_VOLUME;
	   this.jumpWhistleSoundElement.volume 	  = this.JUMP_WHISTLE_VOLUME;
	   this.thudSoundElement.volume		 	  = this.THUD_VOLUME;
	   this.fallingWhistleSoundElement.volume = this.FALLING_WHISTLE_VOLUME;
	   this.chimesSoundElement.volume 		  = this.CHIMES_VOLUME;
	   this.explosionSoundElement.volume 	  = this.EXPLOSION_VOLUME;
	   this.coinSoundElement.volume 	  	  = this.COIN_VOLUME;
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
   
   equipRunnerForFalling: function() {
	   
	   this.runner.falling = false;
	   
	   this.runner.fallAnimationTimer = new AnimationTimer(this.runner.JUMP_DURATION,
	   													   AnimationTimer.makeLinearTransducer(1));
	   
	   this.runner.fall = function(initialVelocity) {
		   this.falling = true;
		   this.velocityY = initialVelocity || 0;
		   this.initialVelocityY = initialVelocity || 0;
		   this.fallAnimationTimer.start(snailBait.timeSystem.calculateGameTime());
	   };
	   
	   this.runner.stopFalling = function() {
		   this.falling = false;
		   this.velocityY = 0;
		   this.fallAnimationTimer.stop(snailBait.timeSystem.calculateGameTime());
	   };
   },
   
   equipRunner: function () {
         
      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
      this.equipRunnerForJumping();
      this.equipRunnerForFalling();
   },
   
   revealLivesIcons: function() {
	   var LIVES_ICON_REVEAL_DELAY = 2000;
	   
	   setTimeout(function(e) {
		   snailBait.livesIconLeft.style.opacity = 1.0;
		   snailBait.livesIconRight.style.opacity = 1.0;
		   snailBait.livesIconMiddle.style.opacity = 1.0;
	   }, LIVES_ICON_REVEAL_DELAY);
   },
   
   revealCredits: function() {
	   this.creditsElement.style.display = 'block';
	   
	   setTimeout(function() {
		   snailBait.creditsElement.style.opacity = 1.0;
		   snailBait.revealLivesIcons();
	   }, this.SHORT_DELAY);
	   
	   this.tweetElement.href = this.TWEET_PREAMBLE + this.score + this.TWEET_PROLOGUE;
   },
   
   hideLoadingScreen: function() {
	   document.getElementById('loading').style.opacity = 0;
   },
   
   revealGame: function() {
	   this.canvas.style.display = 'block';
	   
	   this.scoreElement.style.display = 'block';
	   this.instructionsElement.style.display = 'block';
	   this.soundAndMusicElement.style.display = 'block';
	   this.livesElement.style.display = 'block';
	   
	   setTimeout(function() {
		   snailBait.canvas.style.opacity = 1.0;
		   
		   snailBait.scoreElement.style.opacity = 1.0;
		   snailBait.instructionsElement.style.opacity = 1.0;
		   snailBait.soundAndMusicElement.style.opacity = 1.0;
		   snailBait.livesElement.style.opacity = 1.0;
		   
		   snailBait.revealLivesIcons();
	   }, snailBait.SHORT_DELAY);
   },
   
   getParam: function(param) {
	   return window.location.search.match(param) ? true : false;
   },
   
   checkRuntimeFlags: function() {
	   this.skipIntro = this.getParam('skipintro');
   }
   
}; // end snailBait.prototype
   
// ! ---------- EVENT HANDLERS ----------------------------
   
window.onkeydown = function (e) {
   var key = e.keyCode;
   
   if (key === 87) { // w for win
	   snailBait.showWinAnimation();
   }
   
   if (key === 68 && e.ctrlKey) { // Ctrl+d
   	   if (!snailBait.developerBackdoorVisible) {
	   	   snailBait.revealDeveloperBackdoor();
   	   }
   	   else {
	   	   snailBait.developerBackdoorElement.style.opacity = 0;
	   	   snailBait.developerBackdoorVisible = false;
	   	   snailBait.rulerCanvas.style.opacity = 0;
   	   }
   }
   
   if (key === 83) { // 's'
	   snailBait.noScroll = !snailBait.noScroll;
   }

   if (key === 80 || (snailBait.paused && key !== 80)) {  // 'p'
      snailBait.togglePaused();
   }
   
   if (key === 37) { // left arrow
      snailBait.turnLeft();
   }
   else if (key === 39) { // right arrow
      snailBait.turnRight();
   }
   else if (key === 32) { // 'space'
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

window.onmouseup = function(e) {
	
	if (snailBait.developerBackdoorVisible) {
		snailBait.dragging = false;
		snailBait.runner.visible = true;
		snailBait.draggingRunner = false;
		snailBait.backgroundOffsetReadout.innerHTML = '';
		
		e.preventDefault();
	}
};

// In-game elements.........................................................

var snailBait = new SnailBait();

snailBait.smokingHolesCheckboxElement.onchange = function(e) {
	snailBait.showSmokingHoles = snailBait.smokingHolesCheckboxElement.checked;
};

snailBait.detectRunningSlowlyCheckboxElement.onchange = function(e) {
	snailBait.showSlowWarning = snailBait.detectRunningSlowlyCheckboxElement.checked;
};

snailBait.collisionRectanglesCheckboxElement.onchange = function(e) {
	if (snailBait.collisionRectanglesCheckboxElement.checked) {
		snailBait.revealCollisionRectangles();
	}
	else {
		snailBait.hideCollisionRectangles();
	}
};

snailBait.timeFactorSlider.addChangeListener(function(e) {
	if (snailBait.timeFactorSlider.knobPercent < 0.01) {
		snailBait.timeFactorSlider.knobPercent = 0.01;
	}
	
	snailBait.setTimeRate(snailBait.timeFactorSlider.knobPercent * 
						  (snailBait.MAX_TIME_FACTOR));
	
	snailBait.timeFactorReadoutElement.innerText = 
	   		(snailBait.timeFactor * 100).toFixed(0);
});

snailBait.runningSlowlySlider.addChangeListener(function(e) {
	
	snailBait.runningSlowlyThreshold = 
		(snailBait.runningSlowlySlider.knobPercent * 
			snailBait.MAX_RUNNING_SLOWLY_THRESHOLD).toFixed(0);
			
	snailBait.runningSlowlyReadoutElement.innerText =
	   		(snailBait.runningSlowlyThreshold /
	   		 snailBait.MAX_RUNNING_SLOWLY_THRESHOLD *
	   		 snailBait.MAX_RUNNING_SLOWLY_THRESHOLD).toFixed(0);
});

snailBait.canvas.onmousedown = function(e) {
	
	if (snailBait.developerBackdoorVisible) {
		
		snailBait.dragging = true;
		
		snailBait.mousedown = snailBait.windowToCanvas(e.clientX, e.clientY);
		
		snailBait.backgroundOffsetWhenDraggingStarted = snailBait.backgroundOffset;
		snailBait.spriteOffsetWhenDraggingStarted = snailBait.spriteOffset;
		snailBait.runner.visible = false;
		
		if (snailBait.mousedown.x > snailBait.runner.left &&
			snailBait.mousedown.x < snailBait.runner.left + snailBait.runner.width) {
			
			if (snailBait.mousedown.y > snailBait.runner.top &&
				snailBait.mousedown.y < snailBait.runner.top + snailBait.runner.height) {
				
				snailBait.draggingRunner = true;
				snailBait.runner.visible = true;
			}
		}
		
		setTimeout(function() {
			snailBait.rulerCanvas.style.opacity = 1.0;
		}, snailBait.SHORT_DELAY);
		
		e.preventDefault();
	}
};

snailBait.canvas.onmousemove = function(e) {
	
	var mousemove = snailBait.windowToCanvas(e.clientX, e.clientY),
		deltaX;
		
	if (snailBait.developerBackdoorVisible && snailBait.dragging) {
		deltaX = mousemove.x - snailBait.mousedown.x;
		
		if (snailBait.draggingRunner) {
			snailBait.runner.left = mousemove.x;
			snailBait.runner.top = mousemove.y;
		}
		else {
			snailBait.backgroundOffset = 
				snailBait.backgroundOffsetWhenDraggingStarted - deltaX;
			
			snailBait.spriteOffset = 
				snailBait.spriteOffsetWhenDraggingStarted - deltaX;
			
			if (snailBait.backgroundOffset < 0 ||
				snailBait.backgroundOffset > snailBait.BACKGROUND_WIDTH) {
				
				snailBait.backgroundOffset = 0;
			}
			
			snailBait.backgroundOffsetReadout.innerHTML = 
				snailBait.spriteOffset.toFixed(0);
			
			e.preventDefault();
		}
	}
};

snailBait.soundCheckboxElement.onchange = function(e) {
	snailBait.soundOn = snailBait.soundCheckboxElement.checked;
};

snailBait.musicCheckboxElement.onchange = function(e) {
	snailBait.musicOn = snailBait.musicCheckboxElement.checked;
	
	if (snailBait.musicOn) {
		snailBait.soundtrackElement.play();
	} 
	else {
		snailBait.soundtrackElement.pause();
	}
};

snailBait.newGameLink.onclick = function(e) {
	snailBait.restartGame();
};

snailBait.runnerAnimatedGIFElement.onload = function() {
	
	if (snailBait.skipIntro) {
		return;
	}
	
	snailBait.runnerAnimatedGIFElement.style.display = 'block';
	snailBait.loadingTitleElement.style.display = 'block';
	
	setTimeout(function() {
		snailBait.loadingTitleElement.style.opacity = 1.0;
		snailBait.runnerAnimatedGIFElement.style.opacity = 1.0;
	}, snailBait.SHORT_DELAY);
};

snailBait.slowlyOkayElement.onclick = function() {
	snailBait.runningSlowlyElement.style.opacity = 0;
	snailBait.speedSamples = [60,60,60,60,60,60,60,60,60,60];
}

snailBait.begin();


/*
setTimeout(function() {
	snailBait.turnRight();
}, 1000);
*/
