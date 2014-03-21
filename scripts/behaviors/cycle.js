
CycleBehavior = function(duration, delay) {
	this.duration = duration || 0; // miliseconds
	this.delay = delay || 0;
	this.lastAdvance = 0;
};

CycleBehavior.prototype = {
	
	execute: function(sprite, now, fps) {
      if (this.lastAdvance === 0) {
         this.lastAdvance = now;
      }

      if (this.delay && sprite.artist.cellIndex === 0) {
         if (now - this.lastAdvance > this.delay) {
            sprite.artist.advance();
            this.lastAdvance = now;
         }
      }
      else if (now - this.lastAdvance > this.duration) {
         sprite.artist.advance();
         this.lastAdvance = now;
      }
   }
};
