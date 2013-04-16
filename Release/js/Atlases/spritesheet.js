/*
	Created By :Jan-Jacques Theron
	Contact: theronjanjacques@gmail.com
*/
var gSpriteSheets = {};


SpriteSheetClass = Class.extend({
	img: null,
	url: "",
	sprites: new Array(),
	
	init: function () {},
	//----------------------------
	//Load image into this program
	//----------------------------
	load: function (imgName) {
		this.url = imgName;
		var img = new Image();
		img.src = imgName;
		this.img = img;
		gSpriteSheets[imgName] = this;
	},
	//----------------------------
	//Define a Sprite
	defSprite: function (name, x, y, w, h, cx, cy) {
		
		var spt = {
			"id": name,
			"x" : x,
			"y" : y,
			"w" : w,
			"h" : h,
			"cx" : cx == null ? 0 : cx,
			"cy" : cy == null ? 0 : cy
			};
		this.sprites.push(spt);

	},

	parseAtlasDefinition: function (atlasJSON){
		var parsed = atlasJSON;
		for(var key = 0; key < parsed.frames.length; key++) {
			var sprite = parsed.frames[key];
			var cx = -sprite.frame.w * 0.5;
			var cy = -sprite.frame.h * 0.5;
			this.defSprite(sprite.filename, sprite.frame.x, sprite.frame.y, sprite.frame.w, sprite.frame.h, cx, cy);
		}
	},
	//Walk through all the sprite definitions for this
	//atlas, and find which one matches the name.
	getStats: function (name) {
		for(var i = 0; i < this.sprites.length; i++) {
			//alert("bla");this.sprites[i].id);	
			if(this.sprites[i].id === name) {
				return this.sprites[i];
			}
		}
		return null;
	}

});

function drawSprite(spritename, posX, posY){
	for(var key in gSpriteSheets)
	{
		var sheet = gSpriteSheets[key];
		var spt = sheet.getStats(spritename);
		if(spt != null)
		{
			__drawSpriteInternal(spt,sheet,posX,posY);
			return;
		}
	}
}
function __drawSpriteInternal(spt, sheet, posX, posY) {

	if(spt == null) return;
	if(sheet == null) return;

	var hlf = {
	x: spt.cx,
	y: spt.cy
	};
	
		
	ctx.drawImage(sheet.img, spt.x, spt.y, spt.w, spt.h, posX + hlf.x, posY + hlf.y, spt.w, spt.h);
	
}
