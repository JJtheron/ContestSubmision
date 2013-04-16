/*
	Created By :Jan-Jacques Theron
	Contact: theronjanjacques@gmail.com
*/
var bucketsOfWalls = [];

var CanvasTile = Class.extend({
    x: 0,
    y: 0,
    w: 100,
    h: 100,
    cvsHdl: null,
    ctx: null,

    //-----------------------------------------
    // Initializes this CanvasTile with initial
    // values and creates a new Canvas element
    // and context for it.
    create: function (width, height) {
        this.x = -1;
        this.y = -1;
        this.w = width;
        this.h = height;
        var can2 = document.createElement('canvas');
        can2.width = width;
        can2.height = height;
        this.cvsHdl = can2;
        this.ctx = can2.getContext('2d');
    },

    //-----------------------------------------
    // Tests if this CanvasTile intersects the
    // 'viewRect' of the 'TILEDMapClass' using
    // the 'intersectRect' method below.
    isVisible: function () {
        var r2 = gMap.viewRect;
        var r1 = this;
        return gMap.intersectRect({
            top: r1.y,
            left: r1.x,
            bottom: r1.y + r1.h,
            right: r1.x + r1.w
        }, {
            top: r2.y,
            left: r2.x,
            bottom: r2.y + r2.h,
            right: r2.x + r2.w
        });
    }

});


var TILEDMapClass = Class.extend({

    currMapData: null,
    tilesets: [],
    viewRect: {
        "x": 0,
        "y": 0,
        "w": 500,
        "h": 500
    },
    numXTiles: 100,
    numYTiles: 100,
    tileSize: {
        "x": 64,
        "y": 64
    },
    pixelSize: {
        "x": 64,
        "y": 64
    },

    // Counter to keep track of how many tile
    // images we have successfully loaded.
    imgLoadCount: 0,

    // Boolean flag we set once our tile images
    // has finished loading.
    fullyLoaded: false,

	fullyLoadedCanv: false,
    // Gives a default size for all of our
    // 'CanvasTiles' in pixels.
    canvasTileSize: {
        "x": 50,
        "y": 50
    },

    // An array to store all of our 'CanvasTile'
    // objects, so that we can cache them using
    // the preDrawCache method below.
    canvasTileArray: [],

	//-----------------------------------------
    // Load the json file at the url 'map' into
    // memory. This is similar to the requests
    // we've done in the past using
    // XMLHttpRequests.
    load: function () {

            gMap.parseMapJSON(JSONtiledata);
    },

    //-----------------------------------------
    // Parses the map data from 'mapJSON', then
    // stores that data in a number of members
    // of our 'TILEDMapClass' that are defined
    // above.
    parseMapJSON: function (mapJSON) {

        gMap.currMapData = mapJSON;

        var map = gMap.currMapData;
      

        gMap.numXTiles = map.width;
        gMap.numYTiles = map.height;
      
        gMap.tileSize.x = map.tilewidth;
        gMap.tileSize.y = map.tileheight;
      
        gMap.pixelSize.x = gMap.numXTiles * gMap.tileSize.x;
        gMap.pixelSize.y = gMap.numYTiles * gMap.tileSize.y;
        gMap.tileSets = map.tilesets;

        // Loop through 'map.tilesets', an Array...
        for(var i = 0; i < map.tilesets.length; i++) {

            var img = new Image();
            img.onload = function () {
                gMap.imgLoadCount++;
                if (gMap.imgLoadCount === gMap.tileSets.length) {
                    gMap.fullyLoaded = true;
                }
            };

            // The 'src' value to load each new Image from is in
            // the 'image' property of the 'tilesets'.
            img.src = map.tilesets[i].image;

            // This is the javascript object we'll create for
            // the 'tilesets' Array above. First, fill in the
            // given fields with the corresponding fields from
            // the 'tilesets' Array in 'currMapData'.
            var ts = {
                "firstgid": map.tilesets[i].firstgid,

                // 'image' should equal the Image object we
                // just created.

                "image": img,
                "imageheight": map.tilesets[i].imageheight,
                "imagewidth": map.tilesets[i].imagewidth,
                "name": map.tilesets[i].name,

                // These next two fields are tricky. You'll
                // need to calculate this data from the
                // width and height of the overall image and
                // the size of each individual tile.
                // 
                // Remember: This should be an integer, so you
                // might need to do a bit of manipulation after
                // you calculate it.

                "numXTiles": Math.floor(map.tilesets[i].imagewidth / gMap.tileSize.x),
                "numYTiles": Math.floor(map.tilesets[i].imageheight / gMap.tileSize.y)
            };

            // After that, push the newly created object into
            // the 'tilesets' Array above. Javascript Arrays
            // have a handy method called, appropriately, 'push'
            // that does exactly this. It takes the object
            // we'd like to put into the Array as a parameter.
            // 
            // YOUR CODE HERE
            gMap.tilesets.push(ts);
        }
    },

    //-----------------------------------------
    // Grabs a tile from our 'layer' data and returns
    // the 'pkt' object for the layer we want to draw.
    // It takes as a parameter 'tileIndex', which is
    // the id of the tile we'd like to draw in our
    // layer data.
    getTilePacket: function (tileIndex) {

        var pkt = {
            "img": null,
            "px": 0,
            "py": 0
        };

        var tile = 0;
        for(tile = gMap.tilesets.length - 1; tile >= 0; tile--) {
            if(gMap.tilesets[tile].firstgid <= tileIndex) break;
        }


        pkt.img = gMap.tilesets[tile].image;


        var localIdx = tileIndex - gMap.tilesets[tile].firstgid;

        // 2) The (x,y) position of the tile in terms of the
        //    number of tiles in our tileset. This is based on
        //    the 'numXTiles' of the given tileset. Note that
        //    'numYTiles' isn't actually needed here. Think about
        //    how the tiles are arranged if you don't see this,
        //    It's a little tricky. You might want to use the 
        //    modulo and division operators here.
        var lTileX = Math.floor(localIdx % gMap.tilesets[tile].numXTiles);
        var lTileY = Math.floor(localIdx / gMap.tilesets[tile].numXTiles);

        // 3) the (x,y) pixel position in our tileset image of the
        //    tile we want to draw. This is based on the tile
        //    position we just calculated and the (x,y) size of
        //    each tile in pixels.
        pkt.px = (lTileX * gMap.tileSize.x);
        pkt.py = (lTileY * gMap.tileSize.y);

	//console.log ( '#someButton was clicked' );
	//	console.log(lTileX);
	//	console.log(lTileY);
        return pkt;
    },

    //-----------------------------------------
    // Test if two rectangles intersect. The parameters
    // are objects of the shape:
    // {
    //     top: The 'y' coordinate of the top edge
    //     left: The 'x' coordinate of the left edge
    //     bottom: The 'y' coordinate of the bottom edge
    //     right: The 'x' coordinate of the right edge
    // }
    intersectRect: function (r1, r2) {
        // Check if the rectangles r1 and r2 intersect,
        // returning true if they do intersect and false
        // if they do not intersect.
        return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
    },

    //-----------------------------------------
    // Shifts the 'viewRect' object such that it's
    // center stays at the center of the canvas.
    centerAt: function(x, y) {
        // Set the properties of the 'viewRect' such that:
        //
        // 1) The width and height is equal to that of the
        //    canvas.
        //
        // 2) The (x,y) position of the top-left corner of
        //    the 'viewRect' is equal to the passed-in
        //    (x,y) parameters, shifted by the width and
        //    height of half the canvas.
        gMap.viewRect.x = x - (this.viewRect.w / 2);
        gMap.viewRect.y = y - (this.viewRect.h / 2);
        gMap.viewRect.w = this.viewRect.w;
        gMap.viewRect.h = this.viewRect.h;
    },

    //-----------------------------------------
    draw: function () {
        if(!gMap.fullyLoaded) return;
		if(!gMap.fullyLoadedCanv) return;
        // For each 'CanvasTile' in our 'canvasTileArray', we
        // need to test whether or not it is currently visible.
        // the 'isVisible' method of our canvas tile might be
        // useful here...
        //
        // If it is visible, then we need to draw the 'cvsHdl'
        // to our game canvas.
        //
        // One thing to keep in mind is that you'll need to
        // adjust the position to draw to based on the position
        // of our 'viewRect'.
        for(var q = 0; q < gMap.canvasTileArray.length; q++) {
            var r1 = gMap.canvasTileArray[q];

            if(r1.isVisible()) 
            {
            	ctx.drawImage(r1.cvsHdl, r1.x - gMap.viewRect.x, r1.y - gMap.viewRect.y);
            }
        }
    },

    //-----------------------------------------
    // Draws all of our map tiles to the 'canvasTileArray'
    // property of our 'TILEDMapClass' that we defined above.
    preDrawCache: function () {
        // First let's grab the total number of canvases (canvi? canvii?)
        // that we need to draw to fully tile our map, both across and
        // down.
        //
        // Be careful to make sure that at least 1 canvas is always drawn!
        var xCanvasCount = /* YOUR CODE HERE */1 + Math.floor(gMap.pixelSize.x / gMap.canvasTileSize.x);
        var yCanvasCount = /* YOUR CODE HERE */1 + Math.floor(gMap.pixelSize.y / gMap.canvasTileSize.y);

        // Now we'll need to create a new 'CanvasTile' for each of the
        // tile positions we calculated above, and initialize it with
        // the default size of our canvases as defined in our
        // 'canvasTileSize' property defined above.
        //
        // Finally, we'll need to push this new canvas to our
        // 'canvasTileArray'.
        for(var yC = 0; yC < yCanvasCount; yC++) {
            for(var xC = 0; xC < xCanvasCount; xC++) {
                var canvasTile = new CanvasTile();
                canvasTile.create(gMap.canvasTileSize.x, gMap.canvasTileSize.y);
                canvasTile.x = xC * gMap.canvasTileSize.x;
                canvasTile.y = yC * gMap.canvasTileSize.y;
                gMap.canvasTileArray.push(canvasTile);
                gMap.fillCanvasTile(canvasTile);
            }
        }
		gMap.joinWallsTogether();
        gMap.fullyLoadedCanv = true;
    },

	findWallTiles: function(layerIdx,dataNumb)
	{
		gMap.currMapData.tilesets.tileproperties;
		var tilePropertys = gMap.currMapData.tilesets[layerIdx].tileproperties[dataNumb];
		if(tilePropertys)
			return tilePropertys.TileType;
	},

	joinWallsTogether: function()
	{
        for(var layerIdx = 0; layerIdx < gMap.currMapData.layers.length; layerIdx++) {
        	var dat = gMap.currMapData.layers[layerIdx].data;
        	for(var tileIDX = 0; tileIDX < dat.length; tileIDX++) {
        	    
        	    var worldX = Math.floor(tileIDX % gMap.numXTiles) * gMap.tileSize.x;
                var worldY = Math.floor(tileIDX / gMap.numXTiles) * gMap.tileSize.y;
        	    var wallPeace = {
                	x: worldX,
                	y: worldY,
                	w: gMap.tileSize.x,
                	h: gMap.tileSize.y
                };
                this.findWallTiles(layerIdx,(dat[tileIDX]-1).toString())
                if(this.findWallTiles(layerIdx,(dat[tileIDX]-1).toString()) == "Wall")
                {
                	var newBucket = {
                		Ar: [],
                		direct: ""
                	};
            		var foundSpot = false;
					for(var j=0;j < bucketsOfWalls.length;j++)
					{
						var len = bucketsOfWalls[j].Ar.length-1;
						var	 b1 = bucketsOfWalls[j].Ar[len];
						var  a1 = wallPeace;
						
						if(((b1.x+b1.w) == a1.x) && (b1.y == a1.y))
						{
							if(bucketsOfWalls[j].direct == "V")
								continue;
							bucketsOfWalls[j].direct = "H"
							bucketsOfWalls[j].Ar.push(a1);
							foundSpot = true;
				
						}else if(((b1.y+a1.h) == a1.y) && (b1.x == a1.x))
						{
							if(bucketsOfWalls[j].direct == "H")
								continue;
							bucketsOfWalls[j].direct = "V"
							bucketsOfWalls[j].Ar.push(a1);
							foundSpot = true;
						}   			
					
        			}
        			if(!foundSpot)
					{
						newBucket.Ar.push(wallPeace)
						bucketsOfWalls.push(newBucket);
					}
        		}
        		else if(this.findWallTiles(layerIdx,(dat[tileIDX]-1).toString()) == "FIN")
                {
                		PlayerFINX = worldX;
						PlayerFINY = worldY;
						PlayerFINSizeX = gMap.tileSize.x;
						PlayerFINSizeY = gMap.tileSize.y;
                } 
        		    
                
        }
        }
	},
    //-----------------------------------------
    // Draws all the relevant data to the passed-in
    // 'CanvasTile'. Note that this is very similar
    // to our 'draw' method above, but draws to the
    // context of the passed-in 'ctile'.
    fillCanvasTile: function (ctile) {
    	
     	if(!gMap.fullyLoaded)
     	{
     	 	return;
     	}

        var Lctx = ctile.ctx;
        Lctx.fillRect(0, 0, ctile.w, ctile.h);
        var vRect = {
            top: ctile.y,
            left: ctile.x,
            bottom: ctile.y + ctile.h,
            right: ctile.x + ctile.w
        };

        // Now, for every single layer in the 'layers' Array
        // of 'currMapData'...
        
        for(var layerIdx = 0; layerIdx < gMap.currMapData.layers.length; layerIdx++) {
            // Check if the 'type' of the layer is "tilelayer". If it isn't, we don't
            // care about drawing it...
            if(gMap.currMapData.layers[layerIdx].type != "tilelayer") continue;

            // ...Grab the 'data' Array of the given layer...
            var dat = gMap.currMapData.layers[layerIdx].data;
           
            // ...For each tileID in the 'data' Array...
            for(var tileIDX = 0; tileIDX < dat.length; tileIDX++) {
                // ...Check if that tileID is 0. Remember, we don't draw
                // draw those, so we can skip processing them...
                var tID = dat[tileIDX];
                if(tID === 0) continue;


                // ...If the tileID is not 0, then we grab the
                // packet data using getTilePacket.
                var tPKT = gMap.getTilePacket(tID);

                var worldX = Math.floor(tileIDX % gMap.numXTiles) * gMap.tileSize.x;
                var worldY = Math.floor(tileIDX / gMap.numXTiles) * gMap.tileSize.y;

                var visible = gMap.intersectRect(vRect, {
                    top: worldY,
                    left: worldX,
                    bottom: worldY + gMap.tileSize.y,
                    right: worldX + gMap.tileSize.x
                });

                if(!visible) 
                {
                	continue;
                }
				
                Lctx.drawImage(tPKT.img, tPKT.px, tPKT.py, this.tileSize.x, this.tileSize.y,worldX - vRect.left,worldY - vRect.top, this.tileSize.x, this.tileSize.y);
                
            }
        }
    },
    moveMapToSpawn: function(x,y){
		//Width
		var XtoR = x+ (canvas.width/2);
		var XtoL = x- (canvas.width/2);
		var xTocloseToL = (XtoL < 0);
		var xTocloseToR = (XtoR > gMap.pixelSize.x);
		//Height
		var YtoB = y+ (canvas.height/2);
		var YtoT = y- (canvas.height/2);
		var yTocloseToT = (YtoT < 0);
		var yTocloseToB = (YtoB > gMap.pixelSize.y);
		
		var CTopLeftX = 0;
		var CTopLeftY = 0;
		//X assighnment
		if(xTocloseToL)
		{
			CTopLeftX = 0;
		}else if(xTocloseToR)
		{
			CTopLeftX = gMap.pixelSize.x-canvas.width;
			
		}else
		{
			CTopLeftX = x-(canvas.width/2);
		}
		
		//Y assighnment
		if(yTocloseToT)
		{
			CTopLeftY = 0;
		}else if(yTocloseToB)
		{
			CTopLeftY = gMap.pixelSize.y-canvas.height;
		}else
		{
			CTopLeftY = y-(canvas.height/2);
		}
		gMap.viewRect.x = CTopLeftX;
		gMap.viewRect.y = CTopLeftY;
	},
});

//var gMap = new TILEDMapClass();
//canvas.create(500,500);
//gMap.load();
//gMap.draw();
//document.body.appendChild(can2);
//var myvar = setInterval(gMap.preDrawCache(),framerate); gMap.fillCanvasTile(gMap.canvasTileArray)
