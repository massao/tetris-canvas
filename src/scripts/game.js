function Game() {
	this.canvas = document.getElementById('game');
	this.ctx = this.canvas.getContext('2d');
	this.started = false;
	this.pieces = [];
	this.newPiece = false;
	this.score = 0;
	this.t;
	this.paused = true;
	var game = this;
	var pieces = this.pieces;
	var _ctx = this.ctx;
	var loop = function() {
		game.loop(this.ctx);
	}
	var audio = document.querySelector('audio');
	audio.volume = .5;

	game.start = function() {
		game = this;
		pieces = game.pieces;
		_ctx = game.ctx;
		game.started = true;
		game.newPiece = true;
		game.loop(game.ctx);
		game.paused = false;
		game.bindKeys();
		game.t = setInterval(loop, 500);
	}
	game.audio = function(e) {
		var audio = document.querySelector('audio');
		switch(e.keyCode) {
			case 77:
			if(!audio.paused){
				audio.pause();
			} else {
				audio.play();
			}
			break;
			case 109:
			case 189:
			if(audio.volume > .2) {
				audio.volume -= .1;
			}
			break;
			case 107:
			case 187:
			if(audio.volume < 1) {
				audio.volume += .1
			}
			break;
		}
	}
	game.binds = function(e) {
		var p = pieces[pieces.length-1];
		var prevent = false;
		var lastY = 0;
		var maxY = 19;
		var firstX = 3;
		var lastX = 0;
		var maxX = 9;
		switch(e.keyCode) {
			case 38:
			p.rotate(pieces);
			for(b in p.blocks) {
				blocks = p.blocks;
				lastY = (blocks[b].y > lastY)? blocks[b].y : lastY;
			}
			if(p.y+lastY >= maxY) {
				p.rotationEnabled = false;
			}
			prevent = true;
			break;
			case 40:
			game.loop();
			prevent = true;
			break;
			case 37:
			for(b in p.blocks) {
				blocks = p.blocks;
				firstX = (blocks[b].x < firstX)? blocks[b].x : firstX;
			}
			if(0 < p.x+firstX && game.checkMove('left')) {
				p.move(0,-1);
			}
			prevent = true;
			break;
			case 39:
			for(b in p.blocks) {
				blocks = p.blocks;
				lastX = (blocks[b].x > lastX)? blocks[b].x : lastX;
			}
			if(maxX > p.x+lastX && game.checkMove('right')) {
				p.move(0,1);
			}
			prevent = true;
			break;
		}
		_ctx.save();
		_ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(x in pieces) {
			pieces[x].draw();
		}
		_ctx.restore();
		if(prevent == true) {
			if(e.preventDefault) {
				e.preventDefault();
			}
			e.returnValue = false;
		}
	};
	game.pause = function(e) {
		if(e.keyCode == 80) {
			game.togglePause();
			if(e.preventDefault) {
				e.preventDefault();
			}
		}
	}

	game.bindKeys = function() {
		document.addEventListener('keydown',game.binds, false);
		document.addEventListener('keyup',game.pause, false)
	}
	document.addEventListener('keyup', game.audio, false);
}
Game.prototype = {
	draw: function(ctx) {
		var game = this;
		_ctx = ctx || game.ctx;
		canvas = game.canvas;
		_ctx.save();
		_ctx.clearRect(0, 0, canvas.width, canvas.height);
		if(game.newPiece) {
			var p = new Piece();
			p.prepare(_ctx, "down");
			game.pieces.push(p);
			game.newPiece = false;
		} else {
			var p = game.pieces[game.pieces.length-1];
			if(game.checkStep()) {
				p.move(1,0);
			} else {
				p.rotationEnabled = false;
				game.newPiece = true;
				game.checkLines();
			}
		}
		for(p in game.pieces) {
			pieces = game.pieces;
			pieces[p].draw();
		}
		_ctx.restore();
	},
	loop: function(ctx) {
		var game = this;
		if(game.started && !game.paused) {
			game.draw(ctx);
		} else {
			console.log("nope");
		}
	},
	checkStep: function() {
		var game = this;
		var move = true;
		var p = game.pieces[game.pieces.length-1];
		var lastY = 0;
		var lastX = 0;
		var firstX = 0;
		var maxY = 18;
		var move = true;
		var currentY = 0;
		var currentX = 0;
		for(b in p.blocks) {
			blocks = p.blocks;
			lastY = (blocks[b].y > lastY)? blocks[b].y : lastY;
			currentY = blocks[b].y + p.y;
			currentX = blocks[b].x + p.x;
			for(var x = 0; x < game.pieces.length-1; x++) {
				var pieces = game.pieces;
				var blockY = 0;
				var blockX = 0;
				for(i in pieces[x].blocks) {
					var block = pieces[x].blocks;
					blockY = block[i].y;
					blockX = block[i].x;
					if(currentY+1 == pieces[x].y+blockY && currentX == pieces[x].x+blockX) {
						move = false;
					}
				}
			}
			if(p.y+lastY > maxY) {
				move = false;
			}
		}
		return move;
	},
	checkLines: function() {
		var game = this;
		for(x=0;x<20;x++) {
			var line = [];
			var l=0;
			while(l<10) {
				line.push(0);
				l++;
			}
			var pieces = game.pieces;
			for(p in pieces) {
				var piece = pieces[p];
				var blocks = piece.blocks;
				for(b in blocks) {
					var block = blocks[b];
					if(block.y+piece.y == x) {
						line[block.x+piece.x] = 1;
					}
				}
			}
			var clear = true;
			for(space in line) {
				if(line[space] == 0) {
					clear = false;
				}
				if(x == 0 && line[4] == 1) {
					game.gameOver();
				}
			}
			if(clear) {
				game.updateScore(10);
				for(p in pieces) {
					var piece = pieces[p];
					var blocks = piece.blocks;
					var remove = [];
					for(b in blocks) {
						var block = blocks[b];
						if(block.y+piece.y == x) {
							remove.push(b);
						} else if(block.y+piece.y < x) {
							block.y = block.y + 1;
						}
					}
					remove.sort(function(a,b){ return b - a; });
					for(r in remove) {
						blocks.splice(remove[r], 1);
					}
				}
			}
		}
	},
	checkMove: function(direction) {
		var game = this;
		var piece = game.pieces[game.pieces.length-1];
		var pieces = game.pieces;
		var move = true;
		var blocks = piece.blocks;
		for(b in blocks) {
			var block = blocks[b];
			var currentX = block.x + piece.x;
			var currentY = block.y + piece.y;
			for(var x = 0; x < pieces.length-1; x++) {
				var oldPiece = pieces[x];
				var oldBlocks = pieces[x].blocks;
				for(ob in oldBlocks) {
					var oldBlock = oldBlocks[ob];
					var oldX = oldBlock.x + oldPiece.x;
					var oldY = oldBlock.y + oldPiece.y;
					if(direction == 'left') {
						if(currentX-1 == oldX && currentY == oldY) {
							move = false;
						}
					} if(direction == 'right') {
						if(currentX+1 == oldX && currentY == oldY) {
							move = false;
						}
					}
				}
			}
		}
		return move;
	},
	togglePause: function() {
		var game = this;
		if(game.paused) {
			document.addEventListener('keydown',game.binds, false);
		} else {
			game.ctx.fillStyle = 'rgba(0,0,0,0.5)';
			game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
			document.removeEventListener('keydown',game.binds, false);
		}
		game.paused = (game.paused)? false : true;
	},
	gameOver: function() {
		alert("Game over.\nPress 'space' to play again");
		var game = this;
		game.canvas = document.getElementById('game');
		game.ctx = game.canvas.getContext('2d');
		game.draw();
		game.started = false;
		game.pieces = [];
		game.newPiece = false;
		document.removeEventListener('keydown',game.binds, false);
		clearInterval(game.t);
		var restart = function(e) {
			if(e.keyCode == 32) {
				game.start();
				document.removeEventListener('keydown', restart, false);
				if(e.preventDefault) {
					e.preventDefault();
				}
				e.returnValue = false;
			}
		};
		document.addEventListener('keydown', restart, false)
	},
	updateScore: function(score) {
		var scoreText = document.querySelector('.score');
		var pointsEl = scoreText.querySelector('span'); 
		pointsEl.innerHTML = parseInt(pointsEl.innerHTML, 10) + score;
	}
}