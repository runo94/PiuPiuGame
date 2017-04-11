;(function(){
	var Game = function(canvasId){
		var canvas = document.getElementById(canvasId);
		var screen = canvas.getContext('2d');
		var gameSize = {
			x: canvas.width,
			y: canvas.height
		};

		this.bodies = [new Player(this, gameSize)]

		var self = this;
		var tick = function(){
			self.update(gameSize);
			self.draw(screen,gameSize);
			requestAnimationFrame(tick);
		}

		tick(); // вызов функции обновления
	}
	
	Game.prototype = {
		update: function(gameSize) {
			for (var i = 0; i < this.bodies.length; i++) {
				if (this.bodies[i].position.y < 0) {
					this.bodies.splice(i,1);
				}
			}
			for (var i = 0; i < this.bodies.length; i++) {
				this.bodies[i].update();
			}
		}, // обновление объектов

		draw: function(screen, gameSize) {
			// screen.fillRect(150,150, 100, 100); // отрисовка квадрата 100 на 100 пикселей.
			clearCanvas(screen, gameSize);
			for (var i = 0; i < this.bodies.length; i++) {
				drawRect(screen, this.bodies[i])
			}
		}, // отрисовка объектов в игре

		addBody: function(body) {
			this.bodies.push(body);
		}
	}

	var Player = function(game, gameSize) {
		this.game = game;
		this.bullets = 0;
		this.timer = 0;
		this.size = {
			width:16,
			height: 16
		};
		this.position = {
			x:gameSize.x/2 - this.size.width/2, 
			y:gameSize.y/2 - this.size.height/2
		}

		this.keyboarder = new Keyboarder();
	}

	Player.prototype = {
		update: function() {
			if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
				this.position.x -= 2;
			}
			if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
				this.position.x += 2;
			}
			if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
				if (this.bullets < 5) {
					var bullet = new Bullet(
					{
						x: this.position.x + this.size.width/2-3/2,
						y: this.position.y
					},
					{
						x: 0,
						y: -6
					}
					);
					this.game.addBody(bullet);
					this.bullets++;
				}
				this.timer++;
				if (this.timer % 12 == 0) {
					 this.bullets = 0;
				}
			}
		}
	}

	var Bullet = function(position, velocity) {
		this.size = {
			width:3,
			height: 3
		};
		this.position = position;
		this.velocity = velocity;
	}

	Bullet.prototype = {
		update: function() {
			this.position.x += this.velocity.x;
			this.position.y += this.velocity.y
		}
	}

	var Keyboarder = function() {
		var keyState = {};

		window.onkeydown = function(e) {
			keyState[e.keyCode] = true;
		}

		window.onkeyup = function(e) {
			keyState[e.keyCode] = false;
		}

		this.isDown = function(keyCode) {
			return keyState[keyCode] === true;
		}

		this.KEYS = {LEFT:37, RIGHT:39, SPACE:32};
	}

	var clearCanvas = function(screen, gameSize){
		screen.clearRect(0,0, gameSize.x, gameSize.y)
	}


	var drawRect = function(screen, body) {
		screen.fillRect(
			body.position.x,
			body.position.y,
			body.size.width, 
			body.size.height
		)
	}

	window.onload = function(){
		new Game('screen');
	}

})();