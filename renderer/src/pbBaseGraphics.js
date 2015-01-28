/**
 *
 * pbBaseGraphics - a drawing API to wrap the canvas, webGL, and anything else we end up with
 *
 * 
 */



function pbBaseGraphics()
{
	this.width = 0;
	this.height = 0;

	this.fillColorString = "#000";			// fill color as a css format color string, # prefixed, rgb(), rgba() or hsl()
	this.fillColorValue = 0;				// fill color as a Number
	this.fillColorRGBA = { r: 0, g: 0, b: 0, a: 0 };
	this.lineColorString = "#000";			// line color as a css format color string, # prefixed, rgb(), rgba() or hsl()
	this.lineColorValue = 0;				// line color as a Number
	this.lineColorRGBA = { r: 0, g: 0, b: 0, a: 0 };
}


pbBaseGraphics.prototype.create = function(_docId, _preferredRenderer)
{
	console.log( "pbBaseGraphics.create" );
};


pbBaseGraphics.prototype.destroy = function()
{
	this.reset();
};


pbBaseGraphics.prototype.fillStyle = function(color)
{
	if (typeof color === "number")
	{
		this.fillColorValue = color;
		this.fillColorString = this.colorNumberToString(color);
		this.fillColorRGBA = this.colorStringToRGBA(this.fillColorString);
	}
	else if (typeof color === "string")
	{
		this.fillColorString = color;
		this.fillColorValue = this.colorStringToNumber(color);
		this.fillColorRGBA = this.colorStringToRGBA(this.fillColorString);
	}
};


pbBaseGraphics.prototype.baseFillRect = function(param0, y, width, height)
{
	var x;

	if (param0.constructor === pbRectangle)
	{
		x = param0.x;
		y = param0.y;
		width = param0.width;
		height = param0.height;
	}
	else if (typeof param0 === "number")
	{
		x = param0;
	}
	else
	{
		// unknown format for param0
		return;
	}

	this.fillRect(x, y, width, height);
};


pbBaseGraphics.prototype.colorNumberToString = function(colorValue)
{
	return '#' + ('00000' + (colorValue | 0).toString(16)).substr(-6);
};


pbBaseGraphics.prototype.colorStringToNumber = function(colorString)
{
	return window.parseInt(colorString.slice(1), 16);
};


pbBaseGraphics.prototype.colorStringToRGBA = function(hex)
{
	if (hex.charAt(0) === '#') hex = hex.slice(1);
	if (hex.length === 3)	// shorthand form (#F26)
		return {
	        r: parseInt(hex.charAt(0)+hex.charAt(0), 16) / 255,
	        g: parseInt(hex.charAt(1)+hex.charAt(1), 16) / 255,
	        b: parseInt(hex.charAt(2)+hex.charAt(2), 16) / 255,
	        a: 1.0
    	};
	else if (hex.length === 6)	// no alpha form (#FE246A)
		return {
	        r: parseInt(hex.slice(0,2), 16) / 255,
	        g: parseInt(hex.slice(2,4), 16) / 255,
	        b: parseInt(hex.slice(4,6), 16) / 255,
	        a: 1.0
    	};		
	else
		return {
	        r: parseInt(hex.slice(0,2), 16) / 255,
	        g: parseInt(hex.slice(2,4), 16) / 255,
	        b: parseInt(hex.slice(4,6), 16) / 255,
	        a: parseInt(hex.slice(6,8), 16) / 255
    	};
};


/**
 * The graphics drawing interface dummy functions, these must all be overridden.
 */


pbBaseGraphics.prototype.preRender = function()
{
	alert("ERROR: the selected graphic mode does not extend preRender from pbBaseGraphics!")
};


pbBaseGraphics.prototype.drawImage = function(_x, _y, _z, _surface, _cellFrame, _angle, _scale)
{
	alert("ERROR: the selected graphic mode does not extend drawImage from pbBaseGraphics!")
};


pbBaseGraphics.prototype.drawImageWithTransform = function(_image, _transform, _z_order)
{
	alert("ERROR: the selected graphic mode does not extend drawImageWithTransform from pbBaseGraphics!")
};


pbBaseGraphics.prototype.blitDrawImages = function(_list, _surface)
{
	alert("ERROR: the selected graphic mode does not extend blitDrawImages from pbBaseGraphics!")
};


pbBaseGraphics.prototype.batchDrawImages = function(_list, _surface)
{
	alert("ERROR: the selected graphic mode does not extend batchDrawImages from pbBaseGraphics!")
};


pbBaseGraphics.prototype.rawBatchDrawImages = function(_list)
{
	alert("ERROR: the selected graphic mode does not extend rawBatchDrawImages from pbBaseGraphics!")
};


pbBaseGraphics.prototype.reset = function()
{
	alert("ERROR: the selected graphic mode does not extend reset from pbBaseGraphics!")
};


pbBaseGraphics.prototype.scissor = function(_x, _y, _width, _height)
{
	alert("ERROR: the selected graphic mode does not extend scissor from pbBaseGraphics!")
};

