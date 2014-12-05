function Piece() {
	this.blocks = [];
	this.x=3;
	this.y=0;
	this.type = '';
	this.rotation = 'up';
	this.rotationEnabled = true;
	this.pieces = {
		L: {
			name: "L",
			pos: {
				"up": '4460',
				"left": "2E00",
				"down": "6220",
				"right": "E800"
			},
			color: '#f0a001'
		},
		I: {
			name: 'I',
			pos: {
				"up": '4444',
				"left": "0F00",
				"down": "4444",
				"right": "0F00"
			},
			color: '#00f0ef'
		},
		S: {
			name: 'S',
			pos: {
				"up": '3600',
				"left": "4620",
				"down": "3600",
				"right": "4620"
			},
			color: '#01f000'
		},
		T: {
			name: 'T',
			pos: {
				"up": 'E400',
				"left": "4C40",
				"down": "4E00",
				"right": "4640"
			},
			color: '#9f00f0'
		},
		J: {
			name: 'J',
			pos: {
				"up": '2260',
				"left": "E200",
				"down": "6440",
				"right": "8E00"
			},
			color: '#0000f0'
		},
		Z: {
			name: 'Z',
			pos: {
				"up": 'C600',
				"left": "4C80",
				"down": "C600",
				"right": "4C80"
			},
			color: '#f00001'
		},
		O: {
			name: 'O',
			pos: {
				"up": '6600',
				"left": '6600',
				"down": '6600',
				"right": '6600'
			},
			color: '#f1f000'
		}
	};
}
Piece.prototype = {
	getType: function() {
		var arr = [
		this.pieces.L,
		this.pieces.I,
		this.pieces.S,
		this.pieces.T,
		this.pieces.J,
		this.pieces.Z,
		this.pieces.O
		];
		return arr[Math.floor(Math.random()*arr.length)];
	},
	move: function(y,x) {
		if(this.rotationEnabled) {
			_y = y || 0;
			_x = x || 0;
			this.y += _y;
			this.x += _x;
		}
	},
	prepare: function(ctx) {
		var type = this.getType();
		var pos = type.pos[this.rotation];
		var grid = pos.split('');
		for(g in grid) {
			var bin = parseInt(grid[g], 16).toString(2);
			while(bin.length < 4) {
				bin = "0" + bin;
			}
			grid[g] = bin;
			pos = grid[g].split('');
			for(p in pos) {
				if(pos[p] == 1) {
					x = parseInt(p,10);
					y = parseInt(g,10);
					var b = new Block(ctx);
					this.blocks.push({x:x, y:y, b:b});
				}
			}
		}
		this.type = type;
	},
	draw: function(ctx) {
		blocks = this.blocks;
		type = this.type;
		for(b in blocks) {
			block = blocks[b];
			x = block.x + parseInt(this.x, 10);
			y = block.y + parseInt(this.y, 10);
			block.b.drawBlock(x, y, type.color, ctx);
		}
	},
	rotate: function(pieces) {
		if(this.rotationEnabled) {
			switch(this.rotation) {
				case "up": this.rotation = "left"; break;
				case "left": this.rotation = "down"; break;
				case "down": this.rotation = "right"; break;
				case "right": this.rotation = "up"; break;
			}
			var revert = false;
			var pos = type.pos[this.rotation];
			var grid = pos.split('');
			var count = 0;
			for(g in grid) {
				var bin = parseInt(grid[g], 16).toString(2);
				while(bin.length < 4) {
					bin = "0" + bin;
				}
				grid[g] = bin;
				pos = grid[g].split('');
				for(p in pos) {
					if(pos[p] == 1) {
						x = parseInt(p,10);
						y = parseInt(g,10);
						if(x+this.x>9) {
							this.move(0,-1);
						}
						if(x+this.x<0) {
							this.move(0,1);
						}
						if(y+this.y>19) {
							revert = true;
						}
						block = this.blocks[count]
						block.x = x;
						block.y = y;
						count++;
					}
				}
				var piece = this;
				var blocks = this.blocks;
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
							if(currentX == oldX && currentY == oldY) {
								revert = true;
							}
						}
					}
				}
			}
			if(revert) {
				switch(this.rotation) {
					case "up": this.rotation = "right"; break;
					case "left": this.rotation = "up"; break;
					case "down": this.rotation = "left"; break;
					case "right": this.rotation = "down"; break;
				}
				var pos = type.pos[this.rotation];
				var grid = pos.split('');
				var count = 0;
				for(g in grid) {
					var bin = parseInt(grid[g], 16).toString(2);
					while(bin.length < 4) {
						bin = "0" + bin;
					}
					grid[g] = bin;
					pos = grid[g].split('');
					for(p in pos) {
						if(pos[p] == 1) {
							x = parseInt(p,10);
							y = parseInt(g,10);
							if(x+this.x>9) {
								this.move(0,-1);
							}
							if(x+this.x<0) {
								this.move(0,1);
							}
							block = this.blocks[count]
							block.x = x;
							block.y = y;
							count++;
						}
					}
				}
			}
		}
	}
}