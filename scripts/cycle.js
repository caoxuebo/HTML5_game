
CycleBehavior = function(duration, pause) {
	this.duration = duration || 0; // miliseconds
	this.pause = pause || 0;
	this.lastAdvance = 0;
};

CycleBehavior.prototype = {
	
	execute: function(sprite, time, fps) {
      if (this.lastAdvance === 0) {
         this.lastAdvance = time;
      }

      if (this.pause && sprite.artist.cellIndex === 0) {
         if (time - this.lastAdvance > this.pause) {
            sprite.artist.advance();
            this.lastAdvance = time;
         }
      }
      else if (time - this.lastAdvance > this.duration) {
         sprite.artist.advance();
         this.lastAdvance = time;
      }
   }
	
};
