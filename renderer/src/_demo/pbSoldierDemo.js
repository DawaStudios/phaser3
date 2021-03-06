/**
 *
 * The soldier marching (pseudo-3d) demo for the new Phaser 3 renderer.
 *
 */



// created while the data is loading (preloader)
function pbSoldierDemo( docId )
{
	console.log( "pbSoldierDemo c'tor entry" );

	var _this = this;

	this.docId = docId;

	this.surface_run = null;
	this.surface_smash = null;
	this.targetx = 0;
	this.targety = 0;
	this.numSprites = 0;
	this.spriteList = null;

	// dat.GUI controlled variables and callbacks
	// this.gui = new dat.GUI();
	this.numCtrl = gui.add(this, "numSprites").min(0).max(MAX_SPRITES).step(250).listen();
	this.numCtrl.onFinishChange(function(value) { if (!value) _this.numSprites = 0; _this.restart(); });

	// this.useBatch = false;
	// var btcCtrl = this.gui.add(this, "useBatch");
	// btcCtrl.onFinishChange(function(value) { if (!value) _this.numSprites = 0; _this.restart(); });

	// create loader with callback when all items have finished loading
	this.loader = new pbLoader( this.allLoaded, this );
	this.sprite_run = this.loader.loadImage( "../img/soldier_a_run.png" );
	this.sprite_smash = this.loader.loadImage( "../img/soldier_a_smash.png" );

	console.log( "pbSoldierDemo c'tor exit" );
}


pbSoldierDemo.prototype.allLoaded = function()
{
	console.log( "pbSoldierDemo.allLoaded" );

	this.renderer = new pbRenderer( useRenderer, this.docId, this.create, this.update, this );
};


pbSoldierDemo.prototype.create = function()
{
	console.log("pbSoldierDemo.create");

	this.targetx = 0;
	this.targety = 600 - 20;

	this.spriteList = [];
};


pbSoldierDemo.prototype.destroy = function()
{
	console.log("pbSoldierDemo.destroy");

	gui.remove(this.numCtrl);

	this.spriteList = null;
	if (this.surface_run)
		this.surface_run.destroy();
	this.surface_run = null;
	if (this.surface_smash)
		this.surface_smash.destroy();
	this.surface_smash = null;

	if (this.renderer)
		this.renderer.destroy();
	this.renderer = null;
};


pbSoldierDemo.prototype.restart = function()
{
	console.log("pbSoldierDemo.restart");
	
	this.destroy();
	this.create();
};


pbSoldierDemo.prototype.addSprites = function(num)
{
	// calculate cell position bounds in source texture and attach it to the image
	if (!this.surface_run)
	{
		this.surface_run = new pbSurface();
		this.surface_run.create(32, 64, 8, 5, this.loader.getFile( this.sprite_run ));
	}
	if (!this.surface_smash)
	{
		this.surface_smash = new pbSurface();
		this.surface_smash.create(32, 64, 8, 5, this.loader.getFile( this.sprite_smash ));
	}

	// create animation data and set destination for movement
	for( var i = 0; i < num; i++ )
	{
		// start from the top of the screen
		var x = Math.random() * pbRenderer.width;
		var y = 0;

		// unique image holder per soldier (permits individual animation)
		var frames = 0;
		var img = new imageClass();
		if (i % 2 == 1)
		{
			img.create(this.surface_run, Math.floor(Math.random() * 3));
			frames = 8;
		}
		else
		{
			img.create(this.surface_smash, Math.floor(Math.random() * 3));
			frames = 6;
		}

		// unique sprite holder per soldier (holds transform)
		var spr = new pbSprite();
		spr.create(img, x, y, 1.0, 0, 96 / 600, 96 / 600);
		rootLayer.addChild(spr);

		// TODO: add pbWebGlLayer system to manage layers of pbSprites
		// TODO: *maybe* add callback for pbSprite.update to implement AI functionality directly without needing unique objects for everything(?)
		// OR: create a demoSoldier object
		this.spriteList.push(
		{
			sprite: spr,
			tx: this.targetx,
			ty: this.targety,
			lastFrame: frames
		} );

		// line up in ranks getting smaller and smaller
		var finalScale = (this.targety + 96) / 600;
		this.targetx += img.surface.cellWide * 0.65 * finalScale;
		if (this.targetx >= 800 + img.surface.image.width * 0.5 * finalScale)
		{
			this.targetx = -img.surface.image.width * 0.5 * finalScale;
			this.targety -= img.surface.cellHigh * 0.15 * finalScale;
		}
	}
	this.numSprites = this.spriteList.length;
};


pbSoldierDemo.prototype.removeSprites = function(num)
{
	for( var i = 0; i < num; i++ )
	{
		if (this.spriteList.length > 0)
		{
			var spr = this.spriteList[this.spriteList.length - 1];
			this.targetx = spr.tx;
			this.targety = spr.ty;
			spr.sprite.destroy();
		}

		this.spriteList.pop();
	}
	this.numSprites = this.spriteList.length;
};


pbSoldierDemo.prototype.update = function()
{
	// marching sprites
	var list = this.spriteList;
	if (list)
	{
		for ( var i = -1, l = list.length; ++i < l; )
		{
			var spr = list[i].sprite;
			var img = spr.image;

			// animation
			img.cellFrame += 0.2;
			if (img.cellFrame >= list[i].lastFrame) img.cellFrame = 0;

			// movement towards target location
			var dx = list[i].tx - spr.x;
			var dy = list[i].ty - spr.y;
			var dist = Math.sqrt(dx * dx + dy * dy);
			if (dist > 0.1)
			{
				spr.x += dx / dist;
				spr.y += dy / dist;
				spr.z = 1 - spr.y / 600;
				spr.scaleX = spr.scaleY = (spr.y + 96) / 600;
			}
		}
	}

	if (fps > 59 && this.targety > 0)
	{
	 	this.addSprites(5);
	}
	// if (fps > 0 && fps < 55)
	// {
	//  	this.removeSprites(1);
	// }
};

