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

// PULSE: This behavior modifies the brightness of the sprite to make it
//        appear to pulsate.

Pulse = function (time, holdTime, opacityThreshold) {
   this.time = time || 1000;
   this.holdTime = holdTime || 0;
   this.brightTimer = new AnimationTimer(this.time, AnimationTimer.makeEaseIn(1));
   this.dimTimer = new AnimationTimer(this.time, AnimationTimer.makeEaseOut(1));
   this.opacityThreshold = opacityThreshold;
},

Pulse.prototype = { 
   startDimming: function (sprite) {
      this.dimTimer.start();
   },
      
   dim: function (sprite) {
      elapsedTime = this.dimTimer.getElapsedTime();  
      sprite.opacity = 1 - ((1 - this.opacityThreshold) *
                            (parseFloat(elapsedTime) / this.time));
   },

   finishDimming: function (sprite) {
      var self = this;
      this.dimTimer.stop();
      setTimeout( function (e) {
         self.brightTimer.start();
      }, 100);
   },
      
   isBrightening: function () {
      return this.brightTimer.isRunning();
   },
      
   isDimming: function () {
      return this.dimTimer.isRunning();
   },

   brighten: function (sprite) {
      elapsedTime = this.brightTimer.getElapsedTime();  
      sprite.opacity += (1 - this.opacityThreshold) *
                         parseFloat(elapsedTime) / this.time;
   },

   finishBrightening: function (sprite) {
      var self = this;
      this.brightTimer.stop();
      setTimeout( function (e) {
         self.dimTimer.start();
      }, 100);
   },
      
   execute: function(sprite, time, fps) {
      var elapsedTime;

      // If nothing's happening, start dimming and return

      if (!this.isDimming() && !this.isBrightening()) {
         this.startDimming(sprite);
         return;
      }

      if(this.isDimming()) {               // Dimming
         if(!this.dimTimer.isOver()) {     // Not done dimming
            this.dim(sprite);
         }
         else {                            // Done dimming
            this.finishDimming(sprite);
         }
      }
      else if(this.isBrightening()) {      // Brightening
         if(!this.brightTimer.isOver()) {  // Not done brightening
            this.brighten(sprite);
         }
         else {                            // Done brightening
            this.finishBrightening(sprite);
         }
      }
   }
};
