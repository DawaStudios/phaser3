/**
 *
 * Simple demo using the sprite system to display text.
 *
 */



// created while the data is loading (preloader)
function pbTextSpriteDemo( docId )
{
	console.log( "pbTextSpriteDemo c'tor entry" );

	var _this = this;

	this.docId = docId;

	// create loader with callback when all items have finished loading
	this.loader = new pbLoader( this.allLoaded, this );
	this.spriteImg = this.loader.loadImage( "../img/fonts/arcadeFonts/16x16/Bubble Memories (Taito).png" );

	console.log( "pbTextSpriteDemo c'tor exit" );
}


pbTextSpriteDemo.prototype.allLoaded = function()
{
	console.log( "pbTextSpriteDemo.allLoaded" );

	this.renderer = new pbRenderer( this.docId, this.create, this.update, this );
};


pbTextSpriteDemo.prototype.create = function()
{
	console.log("pbTextSpriteDemo.create");

	this.addSprites();
};


pbTextSpriteDemo.prototype.destroy = function()
{
	console.log("pbTextSpriteDemo.destroy");

	this.surface.destroy();
	this.surface = null;

	this.renderer.destroy();
	this.renderer = null;
};


pbTextSpriteDemo.prototype.restart = function()
{
	console.log("pbTextSpriteDemo.restart");
	
	this.destroy();
	this.create();
};


// order of characters in the source bitmap
var chars = " !\"  &       . 0123456789       ABCDEFGHIJKLMNOPQRSTUVWXYZ      ABCDEFGHIJKLMNOPQRSTUVWXYZ    ";


pbTextSpriteDemo.prototype.addSprites = function()
{
	console.log("pbTextSpriteDemo.addSprites");

	// get the source image, it's NPOT so duplicate it into a larger canvas which is power of two in both dimensions (webgl requirement)
	var image = this.loader.getFile( this.spriteImg );
	image = imageToPowerOfTwo(image);
	this.surface = new pbSurface();
	this.surface.create(16, 16, 95, 7, image);		// there are 7 rows of 95 characters which are 16x16 pixels each

	this.greenLayer = new pbLayer();
	this.greenLayer.create(rootLayer, this.renderer, 0, 0, 0, 0, 1, 1);
	rootLayer.addChild(this.greenLayer);

	this.redLayer = new pbLayer();
	this.redLayer.create(this.greenLayer, this.renderer, 0, 0, 0, 0, 1, 1);
	this.greenLayer.addChild(this.redLayer);

	this.yellowLayer = new pbLayer();
	this.yellowLayer.create(this.redLayer, this.renderer, 0, 0, 0, 0, 1, 1);
	this.redLayer.addChild(this.yellowLayer);

	var fillScreen = Math.floor(this.renderer.width / 16) * Math.floor(this.renderer.height / 16);

	var i, r, img, spr, x, y;

	// create the green layer
	this.greenLetters = [];
	for(i = 0; i < fillScreen; i++)
	{
		r = Math.floor(Math.random() * chars.length);
		img = new pbImage();
		img.create(this.surface, r);

		spr = new pbSprite();
		x = 8 + (i * 16) % this.renderer.width;
		y = 8 + Math.floor(((i * 16) / this.renderer.width)) * 16;
		spr.create(img, x, y, 1.0, 0, 1.0, 1.0);

		this.greenLayer.addChild(spr);
		this.greenLetters.push(spr);
	}

	// create the red layer
	this.redLetters = [];
	for(i = 0; i < fillScreen; i++)
	{
		r = Math.floor(Math.random() * chars.length);
		img = new pbImage();
		img.create(this.surface, r + 95);

		spr = new pbSprite();
		x = 8 + (i * 16) % this.renderer.width;
		y = 8 + Math.floor(((i * 16) / this.renderer.width)) * 16;
		spr.create(img, x, y, 1.0, 0, 1.0, 1.0);

		this.redLayer.addChild(spr);
		this.redLetters.push(spr);
	}

	// create the yellow layer
	this.yellowLetters = [];
	for(i = 0; i < fillScreen; i++)
	{
		r = Math.floor(Math.random() * chars.length);
		img = new pbImage();
		img.create(this.surface, r + 95 * 2);

		spr = new pbSprite();
		x = 8 + (i * 16) % this.renderer.width;
		y = 8 + Math.floor(((i * 16) / this.renderer.width)) * 16;
		spr.create(img, x, y, 1.0, 0, 1.0, 1.0);

		this.yellowLayer.addChild(spr);
		this.yellowLetters.push(spr);
	}

};


pbTextSpriteDemo.prototype.update = function()
{
	var i, l, spr;
	for(i = 0, l = this.greenLetters.length; i < l; i++)
	{
		spr = this.greenLetters[i];
		spr.y += (spr.x + 100) * 0.01;
		if (spr.y > this.renderer.height + 8)
			spr.y = -8;
	}
	for(i = 0, l = this.redLetters.length; i < l; i++)
	{
		spr = this.redLetters[i];
		spr.y -= (spr.x + 100) * 0.01;
		if (spr.y < -8)
			spr.y = this.renderer.height + 8;
	}
	for(i = 0, l = this.yellowLetters.length; i < l; i++)
	{
		spr = this.yellowLetters[i];
		spr.x -= (spr.y + 100) * 0.01;
		if (spr.x < -8)
			spr.x = this.renderer.width + 8;
	}
};


function imageToPowerOfTwo( _image )
{
	var newImage = new Image(powerOfTwo(_image.width), powerOfTwo(_image.height));
	newImage.drawImage(_image, 0, 0);
	return newImage;
}


function imageToPowerOfTwo(image)
{
    if (!isPowerOfTwo(image.width) || !isPowerOfTwo(image.height))
    {
        // Scale up the texture to the next highest power of two dimensions.
        var canvas = document.createElement("canvas");
        canvas.width = nextHighestPowerOfTwo(image.width);
        canvas.height = nextHighestPowerOfTwo(image.height);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);
        image = canvas;
    }
    return image;
}
 
function isPowerOfTwo(x)
{
    return (x & (x - 1)) == 0;
}
 
function nextHighestPowerOfTwo(x)
{
    --x;
    for (var i = 1; i < 32; i <<= 1)
    {
        x = x | x >> i;
    }
    return x + 1;
}
