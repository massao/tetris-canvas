function Block(a) {
    var b = 10, c = 250;
    this.block_size = Math.ceil(c / b), this.ctx = a;
}

function Game() {
    this.canvas = document.getElementById("game"), this.ctx = this.canvas.getContext("2d"), 
    this.started = !1, this.pieces = [], this.newPiece = !1, this.score = 0, this.t, 
    this.paused = !0;
    var a = this, c = this.pieces, d = this.ctx, e = function() {
        a.loop(this.ctx);
    }, f = document.querySelector("audio");
    f.volume = .5, a.start = function() {
        a = this, c = a.pieces, d = a.ctx, a.started = !0, a.newPiece = !0, a.loop(a.ctx), 
        a.paused = !1, a.bindKeys(), a.t = setInterval(e, 500);
    }, a.audio = function(a) {
        var b = document.querySelector("audio");
        switch (a.keyCode) {
          case 77:
            b.paused ? b.play() : b.pause();
            break;

          case 109:
          case 189:
            b.volume > .2 && (b.volume -= .1);
            break;

          case 107:
          case 187:
            b.volume < 1 && (b.volume += .1);
        }
    }, a.binds = function(e) {
        var f = c[c.length - 1], g = !1, h = 0, i = 19, j = 3, k = 0, l = 9;
        switch (e.keyCode) {
          case 38:
            f.rotate(c);
            for (b in f.blocks) blocks = f.blocks, h = blocks[b].y > h ? blocks[b].y : h;
            f.y + h >= i && (f.rotationEnabled = !1), g = !0;
            break;

          case 40:
            a.loop(), g = !0;
            break;

          case 37:
            for (b in f.blocks) blocks = f.blocks, j = blocks[b].x < j ? blocks[b].x : j;
            0 < f.x + j && a.checkMove("left") && f.move(0, -1), g = !0;
            break;

          case 39:
            for (b in f.blocks) blocks = f.blocks, k = blocks[b].x > k ? blocks[b].x : k;
            l > f.x + k && a.checkMove("right") && f.move(0, 1), g = !0;
        }
        d.save(), d.clearRect(0, 0, canvas.width, canvas.height);
        for (x in c) c[x].draw();
        d.restore(), 1 == g && (e.preventDefault && e.preventDefault(), e.returnValue = !1);
    }, a.pause = function(b) {
        80 == b.keyCode && (a.togglePause(), b.preventDefault && b.preventDefault());
    }, a.bindKeys = function() {
        document.addEventListener("keydown", a.binds, !1), document.addEventListener("keyup", a.pause, !1);
    }, document.addEventListener("keyup", a.audio, !1);
}

function Piece() {
    this.blocks = [], this.x = 3, this.y = 0, this.type = "", this.rotation = "up", 
    this.rotationEnabled = !0, this.pieces = {
        L: {
            name: "L",
            pos: {
                up: "4460",
                left: "2E00",
                down: "6220",
                right: "E800"
            },
            color: "#f0a001"
        },
        I: {
            name: "I",
            pos: {
                up: "4444",
                left: "0F00",
                down: "4444",
                right: "0F00"
            },
            color: "#00f0ef"
        },
        S: {
            name: "S",
            pos: {
                up: "3600",
                left: "4620",
                down: "3600",
                right: "4620"
            },
            color: "#01f000"
        },
        T: {
            name: "T",
            pos: {
                up: "E400",
                left: "4C40",
                down: "4E00",
                right: "4640"
            },
            color: "#9f00f0"
        },
        J: {
            name: "J",
            pos: {
                up: "2260",
                left: "E200",
                down: "6440",
                right: "8E00"
            },
            color: "#0000f0"
        },
        Z: {
            name: "Z",
            pos: {
                up: "C600",
                left: "4C80",
                down: "C600",
                right: "4C80"
            },
            color: "#f00001"
        },
        O: {
            name: "O",
            pos: {
                up: "6600",
                left: "6600",
                down: "6600",
                right: "6600"
            },
            color: "#f1f000"
        }
    };
}

Block.prototype.drawBlock = function(a, b, c, d) {
    d = d || this.ctx, a *= this.block_size, b *= this.block_size, d.fillStyle = c, 
    d.fillRect(a, b, this.block_size, this.block_size);
}, Game.prototype = {
    draw: function(a) {
        var b = this;
        if (_ctx = a || b.ctx, canvas = b.canvas, _ctx.save(), _ctx.clearRect(0, 0, canvas.width, canvas.height), 
        b.newPiece) {
            var c = new Piece();
            c.prepare(_ctx, "down"), b.pieces.push(c), b.newPiece = !1;
        } else {
            var c = b.pieces[b.pieces.length - 1];
            b.checkStep() ? c.move(1, 0) : (c.rotationEnabled = !1, b.newPiece = !0, b.checkLines());
        }
        for (c in b.pieces) pieces = b.pieces, pieces[c].draw();
        _ctx.restore();
    },
    loop: function(a) {
        var b = this;
        b.started && !b.paused ? b.draw(a) : console.log("nope");
    },
    checkStep: function() {
        var a = this, c = !0, d = a.pieces[a.pieces.length - 1], e = 0, f = 18, c = !0, g = 0, h = 0;
        for (b in d.blocks) {
            blocks = d.blocks, e = blocks[b].y > e ? blocks[b].y : e, g = blocks[b].y + d.y, 
            h = blocks[b].x + d.x;
            for (var j = 0; j < a.pieces.length - 1; j++) {
                var k = a.pieces, l = 0, m = 0;
                for (i in k[j].blocks) {
                    var n = k[j].blocks;
                    l = n[i].y, m = n[i].x, g + 1 == k[j].y + l && h == k[j].x + m && (c = !1);
                }
            }
            d.y + e > f && (c = !1);
        }
        return c;
    },
    checkLines: function() {
        var a = this;
        for (x = 0; 20 > x; x++) {
            for (var c = [], d = 0; 10 > d; ) c.push(0), d++;
            var e = a.pieces;
            for (p in e) {
                var f = e[p], g = f.blocks;
                for (b in g) {
                    var h = g[b];
                    h.y + f.y == x && (c[h.x + f.x] = 1);
                }
            }
            var i = !0;
            for (space in c) 0 == c[space] && (i = !1), 0 == x && 1 == c[4] && a.gameOver();
            if (i) {
                a.updateScore(10);
                for (p in e) {
                    var f = e[p], g = f.blocks, j = [];
                    for (b in g) {
                        var h = g[b];
                        h.y + f.y == x ? j.push(b) : h.y + f.y < x && (h.y = h.y + 1);
                    }
                    j.sort(function(a, b) {
                        return b - a;
                    });
                    for (r in j) g.splice(j[r], 1);
                }
            }
        }
    },
    checkMove: function(a) {
        var c = this, d = c.pieces[c.pieces.length - 1], e = c.pieces, f = !0, g = d.blocks;
        for (b in g) for (var h = g[b], i = h.x + d.x, j = h.y + d.y, k = 0; k < e.length - 1; k++) {
            var l = e[k], m = e[k].blocks;
            for (ob in m) {
                var n = m[ob], o = n.x + l.x, p = n.y + l.y;
                "left" == a && i - 1 == o && j == p && (f = !1), "right" == a && i + 1 == o && j == p && (f = !1);
            }
        }
        return f;
    },
    togglePause: function() {
        var a = this;
        a.paused ? document.addEventListener("keydown", a.binds, !1) : (a.ctx.fillStyle = "rgba(0,0,0,0.5)", 
        a.ctx.fillRect(0, 0, a.canvas.width, a.canvas.height), document.removeEventListener("keydown", a.binds, !1)), 
        a.paused = a.paused ? !1 : !0;
    },
    gameOver: function() {
        alert("Game over.\nPress 'space' to play again");
        var a = this;
        a.canvas = document.getElementById("game"), a.ctx = a.canvas.getContext("2d"), a.draw(), 
        a.started = !1, a.pieces = [], a.newPiece = !1, document.removeEventListener("keydown", a.binds, !1), 
        clearInterval(a.t);
        var b = function(c) {
            32 == c.keyCode && (a.start(), document.removeEventListener("keydown", b, !1), c.preventDefault && c.preventDefault(), 
            c.returnValue = !1);
        };
        document.addEventListener("keydown", b, !1);
    },
    updateScore: function(a) {
        var b = document.querySelector(".score"), c = b.querySelector("span");
        c.innerHTML = parseInt(c.innerHTML, 10) + a;
    }
};

var g = new Game();

g.start(), Piece.prototype = {
    getType: function() {
        var a = [ this.pieces.L, this.pieces.I, this.pieces.S, this.pieces.T, this.pieces.J, this.pieces.Z, this.pieces.O ];
        return a[Math.floor(Math.random() * a.length)];
    },
    move: function(a, b) {
        this.rotationEnabled && (_y = a || 0, _x = b || 0, this.y += _y, this.x += _x);
    },
    prepare: function(a) {
        var b = this.getType(), c = b.pos[this.rotation], d = c.split("");
        for (g in d) {
            for (var e = parseInt(d[g], 16).toString(2); e.length < 4; ) e = "0" + e;
            d[g] = e, c = d[g].split("");
            for (p in c) if (1 == c[p]) {
                x = parseInt(p, 10), y = parseInt(g, 10);
                var f = new Block(a);
                this.blocks.push({
                    x: x,
                    y: y,
                    b: f
                });
            }
        }
        this.type = b;
    },
    draw: function(a) {
        blocks = this.blocks, type = this.type;
        for (b in blocks) block = blocks[b], x = block.x + parseInt(this.x, 10), y = block.y + parseInt(this.y, 10), 
        block.b.drawBlock(x, y, type.color, a);
    },
    rotate: function(a) {
        if (this.rotationEnabled) {
            switch (this.rotation) {
              case "up":
                this.rotation = "left";
                break;

              case "left":
                this.rotation = "down";
                break;

              case "down":
                this.rotation = "right";
                break;

              case "right":
                this.rotation = "up";
            }
            var c = !1, d = type.pos[this.rotation], e = d.split(""), f = 0;
            for (g in e) {
                for (var h = parseInt(e[g], 16).toString(2); h.length < 4; ) h = "0" + h;
                e[g] = h, d = e[g].split("");
                for (p in d) 1 == d[p] && (n = parseInt(p, 10), y = parseInt(g, 10), n + this.x > 9 && this.move(0, -1), 
                n + this.x < 0 && this.move(0, 1), y + this.y > 19 && (c = !0), k = this.blocks[f], 
                k.x = n, k.y = y, f++);
                var i = this, j = this.blocks;
                for (b in j) for (var k = j[b], l = k.x + i.x, m = k.y + i.y, n = 0; n < a.length - 1; n++) {
                    var o = a[n], q = a[n].blocks;
                    for (ob in q) {
                        var r = q[ob], s = r.x + o.x, t = r.y + o.y;
                        l == s && m == t && (c = !0);
                    }
                }
            }
            if (c) {
                switch (this.rotation) {
                  case "up":
                    this.rotation = "right";
                    break;

                  case "left":
                    this.rotation = "up";
                    break;

                  case "down":
                    this.rotation = "left";
                    break;

                  case "right":
                    this.rotation = "down";
                }
                var d = type.pos[this.rotation], e = d.split(""), f = 0;
                for (g in e) {
                    for (var h = parseInt(e[g], 16).toString(2); h.length < 4; ) h = "0" + h;
                    e[g] = h, d = e[g].split("");
                    for (p in d) 1 == d[p] && (n = parseInt(p, 10), y = parseInt(g, 10), n + this.x > 9 && this.move(0, -1), 
                    n + this.x < 0 && this.move(0, 1), k = this.blocks[f], k.x = n, k.y = y, f++);
                }
            }
        }
    }
};