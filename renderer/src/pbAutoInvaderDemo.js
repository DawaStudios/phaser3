/**
 *
 * The auto-invaders demo for the new Phaser 3 renderer.
 *
 */


/* jshint laxbreak: true */	// tell jshint to just shut-up already about my choice of line format



// created while the data is loading (preloader)
function pbAutoInvaderDemo( docId )
{
	console.log( "pbAutoInvaderDemo c'tor entry" );

	var _this = this;

	this.docId = docId;
	this.layer = null;
	
	// create loader with callback when all items have finished loading
	this.loader = new pbLoader( this.allLoaded, this );
	this.playerImg = this.loader.loadImage( "../img/invader/player.png" );
	this.invaderImg = this.loader.loadImage( "../img/invader/invader32x32x4.png" );
	this.saucerImg = this.loader.loadImage( "../img/invader/invader.png" );
	this.starsImg = this.loader.loadImage( "../img/invader/starfield.png" );
	this.bulletImg = this.loader.loadImage( "../img/invader/bullet.png" );
	this.bombImg = this.loader.loadImage( "../img/invader/enemy-bullet.png" );
	this.rocketImg = this.loader.loadImage( "../img/invader/rockets32x32x8.png" );
	this.smokeImg = this.loader.loadImage( "../img/invader/smoke64x64x8.png" );
	this.explosionImg = this.loader.loadImage( "../img/invader/explode.png" );

	console.log( "pbAutoInvaderDemo c'tor exit" );
}


pbAutoInvaderDemo.prototype.allLoaded = function()
{
	console.log( "pbAutoInvaderDemo.allLoaded" );

	// callback to this.create when ready, callback to this.update once every frame
	this.renderer = new pbRenderer( this.docId, this.create, this.update, this );
};


pbAutoInvaderDemo.prototype.create = function(_rootLayer)
{
	console.log("pbAutoInvaderDemo.create");

	if (_rootLayer === undefined || _rootLayer === null)
	{
		this.layer = rootLayer;
	}
	else
	{
		this.layer = _rootLayer;
	}

	this.addSprites();
};


pbAutoInvaderDemo.prototype.destroy = function()
{
	console.log("pbAutoInvaderDemo.destroy");

	this.bgSurface.destroy();
	this.bgSurface = null;

	this.renderer.destroy();
	this.renderer = null;

	this.layer = null;
};


pbAutoInvaderDemo.prototype.restart = function()
{
	console.log("pbAutoInvaderDemo.restart");
	
	this.destroy();
	this.create();
};


pbAutoInvaderDemo.prototype.addSprites = function()
{
	console.log("pbAutoInvaderDemo.addSprites");

	// TODO: use different pbLayers for each part of this demo

	// background
	var image = this.loader.getImage( this.starsImg );
	this.bgSurface = new pbSurface();
	this.bgSurface.create(0, 0, 1, 1, image);
	this.bgImage = new pbImage();
	this.bgImage.create(this.renderer, this.bgSurface, 0, 0, 0, true, true);
	this.bg = new pbSprite();
	this.bg.create(this.bgImage, 0, 0, 1, 0, 1.0, 1.0);
	this.layer.addChild(this.bg);

	// player
	image = this.loader.getImage( this.playerImg );
	this.playerSurface = new pbSurface();
	this.playerSurface.create(0, 0, 1, 1, image);
	this.playerImage = new pbImage();
	this.playerImage.create(this.renderer, this.playerSurface, 0);
	this.player = new pbSprite();
	this.player.create(this.playerImage, this.renderer.width * 0.5, this.renderer.height * 0.9, 0, 0, 1.0, 1.0);
	this.layer.addChild(this.player);
	this.player.die = false;
	this.playerDirX = 2;

	// player bullets
	image = this.loader.getImage( this.bulletImg );
	this.bulletSurface = new pbSurface();
	this.bulletSurface.create(0, 0, 1, 1, image);
	this.bulletPool = [];		// pool for bullets which aren't firing
	this.bullets = [];			// list of bullets which are firing
	for(var i = 0; i < 100; i++)
	{
		var img = new pbImage();
		// anchor point at front of bullet for easy collisions...
		img.create(this.renderer, this.bulletSurface, 0, 0.5, 0.0);
		var bullet = new pbSprite();
		bullet.create(img, 0, 0, 0, 0, 1.0, 1.0);
		// don't add it to the layer until it's fired
		this.bulletPool.push(bullet);
	}

	// player rockets
	image = this.loader.getImage( this.rocketImg );
	this.rocketSurface = new pbSurface();
	this.rocketSurface.create(32, 32, 8, 1, image);
	this.rocketPool = [];		// pool for rockets which aren't firing
	this.rockets = [];			// list of rockets which are firing
	for(var i = 0; i < 100; i++)
	{
		var img = new pbImage();
		img.create(this.renderer, this.rocketSurface, 0, 0.5, 0.5);
		var rocket = new pbSprite();
		rocket.create(img, 0, 0, 0, 0, 1.0, 1.0);
		// don't add it to the layer until it's fired
		this.rocketPool.push(rocket);
	}

	// aliens
	image = this.loader.getImage( this.invaderImg );
	this.invaderSurface = new pbSurface();
	this.invaderSurface.create(32, 32, 4, 1, image);
	this.addInvaders();

	// alien bombs
	image = this.loader.getImage( this.bombImg );
	this.bombSurface = new pbSurface();
	this.bombSurface.create(0, 0, 1, 1, image);
	this.bombPool = [];			// pool for bombs which aren't firing
	this.bombs = [];			// list of bombs which are firing
	for(var i = 0; i < 100; i++)
	{
		var img = new pbImage();
		img.create(this.renderer, this.bombSurface, 0);
		var bomb = new pbSprite();
		bomb.create(img, 0, 0, 0, 0, 1.0, 1.0);
		// don't add it to the layer until it's fired
		this.bombPool.push(bomb);
	}
	// record the nearest bomb to the player's position (so he can try to dodge)
	this.nearest = null;

	// explosions
	image = this.loader.getImage( this.explosionImg );
	this.explosionSurface = new pbSurface();
	this.explosionPool = [];
	this.explosions = [];
	this.explosionSurface.create(128, 128, 16, 1, image);
	for(var i = 0; i < 100; i++)
	{
		var img = new pbImage();
		img.create(this.renderer, this.explosionSurface, 0);
		var explosion = new pbSprite();
		explosion.create(img, 0, 0, 0, 0, 0.5, 0.5);
		this.explosionPool.push(explosion);
	}

	// smoke puffs
	image = this.loader.getImage( this.smokeImg );
	this.smokeSurface = new pbSurface();
	this.smokePool = [];
	this.smokes = [];
	this.smokeSurface.create(64, 64, 8, 1, image);
	for(var i = 0; i < 200; i++)
	{
		var img = new pbImage();
		img.create(this.renderer, this.smokeSurface, 0);
		var smoke = new pbSprite();
		smoke.create(img, 0, 0, 0, 0, 1.0, 1.0);
		this.smokePool.push(smoke);
	}
};


pbAutoInvaderDemo.prototype.addInvaders = function()
{
	this.invaders = [];
	for(var y = 0; y < 5; y++)
		for(var x = 0; x < 12; x++)
		{
			var img = new pbImage();
			img.create(this.renderer, this.invaderSurface, Math.floor(Math.random() * 3));
			var invader = new pbSprite();
			invader.create(img, 20 + x * 48, 80 + y * 48, 0, 0, 1.0, 1.0);
			this.layer.addChild(invader);
			invader.row = y;
			invader.die = false;
			this.invaders.push(invader);
		}
	this.moveY = 4;
	this.invaderDirX = 8;
	this.flipDir = false;
};


pbAutoInvaderDemo.prototype.update = function()
{
	// scroll the background by adjusting the start point of the texture read y coordinate
	this.bgSurface.cellTextureBounds[0][0].y -= 1 / this.renderer.height;


	//
	// update player
	//
	if (this.player.die)
	{
		// TODO: life lost
		this.player.x = this.renderer.width * 0.5;
		this.playerDirX = 2;
		this.player.die = false;
	}
	if (this.nearest)
	{
		// dodge the nearest bomb
		if (this.player.x > this.nearest.x) this.playerDirX = Math.abs(this.playerDirX);
		else this.playerDirX = -Math.abs(this.playerDirX);
	}
	// bounce off edges
	if (this.player.x < this.player.image.surface.cellWide * 0.5
		|| this.player.x > this.renderer.width - this.player.image.surface.cellWide * 0.5)
		this.playerDirX = -this.playerDirX;
	// move
	this.player.x += this.playerDirX;
	// fire player bullet
	if (Math.random() < 0.1)
		if (this.bulletPool.length > 0)
			this.playerShoot();
	// fire player rocket
	if (Math.random() < 0.02)
		if (this.rocketPool.length > 0)
			this.playerShootRocket();

	// create new field of invaders if they've all been killed
	if (this.invaders.length === 0)
		this.addInvaders();

	// update invaders
	for(var i = this.invaders.length - 1; i >= 0; --i)
	{
		var invader = this.invaders[i];

		if (this.moveY == invader.row)
		{
			// movement
			invader.x += this.invaderDirX;
			if (invader.x < invader.image.surface.cellWide * 0.5
				|| invader.x > this.renderer.width - invader.image.surface.cellWide * 0.5)
				this.flipDir = true;

			// invader dropping bomb
			if (Math.random() < 0.02)
				if (this.bombPool.length > 0)
					this.invaderBomb(invader);
		}

		// animation
		invader.image.cellFrame += 0.2;
		if (invader.image.cellFrame >= 4) invader.image.cellFrame = 0;

		if (invader.die)
		{
			// TODO: death effect for invaders
			this.layer.removeChild(invader);
			this.invaders.splice(i, 1);
		}
	}

	// ('whole row at once' movement https://www.youtube.com/watch?v=437Ld_rKM2s#t=30)
	this.moveY -= 0.25;
	if (this.moveY < 0)
	{
		this.moveY = 4;
		if (this.flipDir)
			this.invaderDirX = -this.invaderDirX;
		this.flipDir = false;
	}

	// update active munitions
	this.playerBulletMove();
	this.playerRocketMove();
	this.invaderBombMove();

	// update effects
	this.updateExplosions();
	this.updateSmokes();
};


pbAutoInvaderDemo.prototype.playerShoot = function()
{
	var b = this.bulletPool.pop();
	b.x = this.player.x;
	b.y = this.player.y;
	this.layer.addChild(b);

	this.bullets.push(b);
};


pbAutoInvaderDemo.prototype.playerBulletMove = function()
{
	for(var i = this.bullets.length - 1; i >= 0; --i)
	{
		var b = this.bullets[i];
		b.y -= 8;

		// hit alien or off the top of the screen?
		if (this.invaderCollide(b.x, b.y, true) || b.y < -b.image.surface.cellHigh)
		{
			// kill the bullet and add it back to the pool
			this.layer.removeChild(b);
			this.bulletPool.push(b);
			this.bullets.splice(i, 1);
		}
	}
};


pbAutoInvaderDemo.prototype.pickTarget = function()
{
	if (this.invaders.length === 0) return null;
	var i = Math.floor(this.invaders.length * Math.random());
	return this.invaders[i];
};


pbAutoInvaderDemo.prototype.playerShootRocket = function()
{
	var target = this.pickTarget();
	if (target)
	{
		var b = this.rocketPool.pop();
		b.target = target;
		if (target.x < this.player.x)
		{
			b.x = this.player.x - 8;
			b.angleInRadians = Math.PI + 0.8;
		}
		else
		{
			b.x = this.player.x + 8;
			b.angleInRadians = Math.PI - 0.8;
		}
		b.image.cellFrame = 0;
		b.y = this.player.y;
		b.velocity = 2;
		this.layer.addChild(b);

		this.rockets.push(b);
	}
};


pbAutoInvaderDemo.prototype.playerRocketMove = function()
{
	for(var i = this.rockets.length - 1; i >= 0; --i)
	{
		var b = this.rockets[i];

		b.x += b.velocity * Math.sin(b.angleInRadians);
		b.y += b.velocity * Math.cos(b.angleInRadians);
		b.velocity += 0.1;

		if (Math.random() < 0.1 + b.velocity * 0.1)
		{
			this.addSmoke(b.x, b.y);
		}

		if (b.target)
		{
			if (b.target.die)
			{
				this.addExplosion(b.x, b.y);
				b.y = -100;
			}
			else
			{
				var dx = b.target.x - b.x;
				var dy = b.target.y - b.y;
				var desired = Math.atan2(dx, dy);
				if (desired < 0) desired += Math.PI * 2.0;
				if (desired >= Math.PI * 2.0) desired -= Math.PI * 2.0;
				b.angleInRadians = turnToFace(b.angleInRadians, desired, Math.PI * 2.0, 0.04);
			}
		}


		// hit alien or off the top of the screen?
		if (this.invaderCollide(b.x, b.y, true) || b.y < -b.image.surface.cellHigh)
		{
			// kill the bullet and add it back to the pool
			this.layer.removeChild(b);
			this.rocketPool.push(b);
			this.rockets.splice(i, 1);
		}
	}
};


pbAutoInvaderDemo.prototype.invaderCollide = function(_x, _y, _explode)
{
	for(var i = 0, l = this.invaders.length; i < l; i++)
	{
		var invader = this.invaders[i];
		var w2 = invader.image.surface.cellWide * 0.5;
		if (_x > invader.x - w2 && _x < invader.x + w2)
		{
			var h2 = invader.image.surface.cellHigh * 0.5;
			if (_y > invader.y - h2 && _y < invader.y + h2)
			{
				if (_explode)
				{
					this.addExplosion(invader.x, invader.y);
					invader.die = true;
				}
				return true;
			}
		}
	}
	return false;
};


pbAutoInvaderDemo.prototype.invaderBomb = function(_invader)
{
	var b = this.bombPool.pop();
	b.x = _invader.x;
	b.y = _invader.y;
	this.layer.addChild(b);

	this.bombs.push(b);
};


pbAutoInvaderDemo.prototype.invaderBombMove = function()
{
	this.nearest = null;
	var nearDist2 = 0xffffffff;

	for(var i = this.bombs.length - 1; i >= 0; --i)
	{
		var b = this.bombs[i];
		b.y += 2;

		var hit = false;
		var w2 = this.player.image.surface.cellWide * 0.5;
		if (b.x > this.player.x - w2 && b.x < this.player.x + w2)
		{
			var h2 = this.player.image.surface.cellHigh * 0.5;
			if (b.y > this.player.y - h2 && b.y < this.player.y + h2)
			{
				this.addExplosion(this.player.x, this.player.y);
				this.player.die = true;
				hit = true;
			}
		}

		var dx = this.player.x - b.x;
		var dy = this.player.y - b.y;
		var d2 = dx * dx + dy * dy;
		if (d2 < nearDist2 && d2 < 40 * 40)
		{
			this.nearest = b;
			nearDist2 = d2;
		}

		// hit player or off the bottom of the screen?
		if (hit || b.y > this.renderer.height + b.image.surface.cellHigh * 0.5)
		{
			// kill the bullet and add it back to the pool
			this.layer.removeChild(b);
			this.bombPool.push(b);
			this.bombs.splice(i, 1);
		}
	}
};


pbAutoInvaderDemo.prototype.addExplosion = function(_x, _y)
{
	if (this.explosionPool.length > 0)
	{
		var explosion = this.explosionPool.pop();
		explosion.x = _x;
		explosion.y = _y;
		explosion.image.cellFrame = 0;
		this.layer.addChild(explosion);
		this.explosions.push(explosion);
	}
};


pbAutoInvaderDemo.prototype.updateExplosions = function()
{
	for(var i = this.explosions.length - 1; i >= 0; --i)
	{
		var explosion = this.explosions[i];
		explosion.image.cellFrame += 0.2;
		if (explosion.image.cellFrame >= 16)
		{
			this.layer.removeChild(explosion);
			this.explosions.splice(i, 1);
			this.explosionPool.push(explosion);
		}
	}
};


pbAutoInvaderDemo.prototype.addSmoke = function(_x, _y)
{
	if (this.smokePool.length > 0)
	{
		var smoke = this.smokePool.pop();
		smoke.x = _x;
		smoke.y = _y;
		smoke.image.cellFrame = 0;
		this.layer.addChild(smoke);
		this.smokes.push(smoke);
	}
};


pbAutoInvaderDemo.prototype.updateSmokes = function()
{
	for(var i = this.smokes.length - 1; i >= 0; --i)
	{
		var smoke = this.smokes[i];
		smoke.image.cellFrame += 0.2;
		if (smoke.image.cellFrame >= 8)
		{
			this.layer.removeChild(smoke);
			this.smokes.splice(i, 1);
			this.smokePool.push(smoke);
		}
	}
};


function turnToFace(_current, _desired, _total, _amount)
{
	var t;
	var d = _desired - _current;
	if (Math.abs(d) <= _total * 0.5)
		t = _current + sgn0(d) * _amount;
	else
		t = _current - sgn0(d) * _amount;
	if (t >= _total) return t - _total;
	if (t < 0) return t + _total;
	return t;
}


function sgn0(_value)
{
	if (_value < 0) return -1;
	if (_value > 0) return 1;
	return 0;
}


