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
// PULSE: This behavior modifies the brightness of the sprite to make it
//        appear to pulsate.

PulseBehavior = function (now, opacityThreshold) {
   this.time = now || 1000;
   this.brightTimer = new AnimationTimer(this.time,
                                         AnimationTimer.makeEaseInTransducer(1));

   this.dimTimer = new AnimationTimer(this.time, 
                                         AnimationTimer.makeEaseOutTransducer(1));
   
   this.opacityThreshold = opacityThreshold;
};

PulseBehavior.prototype = { 

   pause: function(now) {
      if (!this.dimTimer.isPaused()) {
         this.dimTimer.pause(now);
      }

      if (!this.brightTimer.isPaused()) {
         this.brightTimer.pause(now);
      }

      this.paused = true;
   },

   unpause: function(now) {
      if (this.dimTimer.isPaused()) {
         this.dimTimer.unpause(now);
      }

      if (this.brightTimer.isPaused()) {
         this.brightTimer.unpause(now);
      }

      this.paused = false;
   },
   
   startDimming: function (sprite, now) {
      this.dimTimer.start(now);
   },
      
   dim: function (sprite, now) {
      elapsedTime = this.dimTimer.getElapsedTime(now);  
      sprite.opacity = 1 - ((1 - this.opacityThreshold) *
                            (parseFloat(elapsedTime) / this.time));
   },

   finishDimming: function (sprite, now) {
      var self = this;
      this.dimTimer.stop(now);
      setTimeout( function (e) {
         self.brightTimer.start(now);
      }, 100);
   },
      
   isBrightening: function (now) {
      return this.brightTimer.isRunning(now);
   },
      
   isDimming: function (now) {
      return this.dimTimer.isRunning(now);
   },

   brighten: function (sprite, now) {
      elapsedTime = this.brightTimer.getElapsedTime(now);  
      sprite.opacity += (1 - this.opacityThreshold) *
                         parseFloat(elapsedTime) / this.time;
   },

   finishBrightening: function (sprite, now) {
      var self = this;
      this.brightTimer.stop(now);
      setTimeout( function (e) {
         self.dimTimer.start(now);
      }, 100);
   },
      
   execute: function(sprite, now, fps) {
      var elapsedTime;

      // If nothing's happening, start dimming and return

      if (!this.isDimming(now) && !this.isBrightening(now)) {
         this.startDimming(sprite, now);
         return;
      }

      if(this.isDimming(now)) {               // Dimming
         if(!this.dimTimer.isExpired(now)) {     // Not done dimming
            this.dim(sprite, now);
         }
         else {                            // Done dimming
            this.finishDimming(sprite, now);
         }
      }
      else if(this.isBrightening(now)) {      // Brightening
         if(!this.brightTimer.isExpired(now)) {  // Not done brightening
            this.brighten(sprite, now);
         }
         else {                            // Done brightening
            this.finishBrightening(sprite, now);
         }
      }
   }
};
