/*
 * Copyright (C) 2012 David Geary.
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
// BOUNCE: BounceBehavior a sprite up and down, easing out on the way up
//         and easing in on the way down.

BounceBehavior = function (riseTime, fallTime, distance) {
   this.riseTime = riseTime || 1000;
   this.fallTime = fallTime || 1000;
   this.distance = distance || 100;

   this.riseTimer = new AnimationTimer(this.riseTime,
                                       AnimationTimer.makeEaseOutTransducer(1.2));

   this.fallTimer = new AnimationTimer(this.fallTime,
                                       AnimationTimer.makeEaseInTransducer(1.2));
   this.paused = false;
};

BounceBehavior.prototype = {
   
   pause: function(sprite, now) {
      if (!this.riseTimer.isPaused()) {
         this.riseTimer.pause(now);
      }

      if (!this.fallTimer.isPaused()) {
         this.fallTimer.pause(now);
      }

      this.paused = true;
   },

   unpause: function(sprite, now) {
      if (this.riseTimer.isPaused()) {
         this.riseTimer.unpause(now);
      }

      if (this.fallTimer.isPaused()) {
         this.fallTimer.unpause(now);
      }

      this.paused = false;
   },
   
   startRising: function (sprite, now) {
      this.baseline = sprite.top;
      this.bounceStart = sprite.top;

      this.riseTimer.start(now);
   },
      
   rise: function (sprite, now) {
      var elapsedTime = this.riseTimer.getElapsedTime(now);
      sprite.top = this.baseline - parseFloat(
                      (elapsedTime / this.riseTime) * this.distance);
   },

   finishRising: function (sprite, now) {
      this.riseTimer.stop(now);
      this.baseline = sprite.top;
      this.fallTimer.start(now);
   },
      
   isFalling: function (now) {
      return this.fallTimer.isRunning(now);
   },
      
   isRising: function (now) {
      return this.riseTimer.isRunning(now);
   },

   fall: function (sprite, now) {
      var elapsedTime = this.fallTimer.getElapsedTime(now);  
      sprite.top = this.baseline +
      parseFloat((elapsedTime / this.fallTime) * this.distance);
   },

   finishFalling: function (sprite, now) {
      this.fallTimer.stop(now);
      sprite.top = this.bounceStart;
      this.startRising(sprite, now);
   },
      
   execute: function(sprite, now, fps) {
      // If nothing's happening, start rising and return

      if (this.paused || !this.isRising(now) && ! this.isFalling(now)) {
         this.startRising(sprite, now);
         return;
      }

      if(this.isRising(now)) {   // Rising
         if(!this.riseTimer.isExpired(now)) {  // Not done rising
            this.rise(sprite, now);
         }
         else {  // Done rising
            this.finishRising(sprite, now);
         }
      }
      else if(this.isFalling(now)) { // Falling
         if(!this.fallTimer.isExpired(now)) {     // Not done falling
            this.fall(sprite, now);
         }
         else { // Done falling
            this.finishFalling(sprite, now);
         }
      }
   }
};
