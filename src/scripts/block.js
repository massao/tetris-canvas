function Block(ctx) {
	var WIDTH = 10,
	HEIGHT = 20,
	PIXEL_WIDTH = 250,
	PIXEL_HEIGHT = 500;
	this.block_size = Math.ceil(PIXEL_WIDTH / WIDTH);
	this.ctx = ctx;
}
Block.prototype.drawBlock = function(x, y, color, _ctx) {
	_ctx = _ctx || this.ctx;
	x = x * this.block_size;
	y = y * this.block_size;
	_ctx.fillStyle = color;
	_ctx.fillRect(x, y, this.block_size, this.block_size);
}