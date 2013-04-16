/*
	Created By :Jan-Jacques Theron
	Contact: theronjanjacques@gmail.com
*/
WallClass = EntityClass.extend({
	zindex : 20,

	physBody: null,

	ID: "",
	fixedX: 0,
	fixedY: 0,
	init: function (x, y) {
		
		var bucket = bucketsOfWalls.pop();
		//console.dir(bucket);

	    if(bucket.direct == "H")
	    {
        	this.size.x = (bucket.Ar[bucket.Ar.length-1].x+bucket.Ar[0].w)-bucket.Ar[0].x;
    		this.size.y = bucket.Ar[0].h;
    		x = bucket.Ar[0].x+(this.size.x/2)-15;
    		y = bucket.Ar[0].y;
    		this.ID = "Ground";
    	}else
    	{
    		this.size.y = (bucket.Ar[bucket.Ar.length-1].y+bucket.Ar[0].h)-bucket.Ar[0].y;
    		this.size.x = bucket.Ar[0].w;
    		x = bucket.Ar[0].x;
    		y = bucket.Ar[0].y+(this.size.y/2)-15;
    		this.ID = "Wall";
    	}
    	this.fixedX = x;
		this.fixedY = y;

       var entityDef = {
            id: "Wall"+this.ID,
            x: x,
            y: y,
            halfHeight: this.size.y * 0.5,
            halfWidth: this.size.x * 0.5,
            type: "static",
            userData: {
            	id: this.ID,
                ent: this
            }
        };

    	this.physBody = gPhysicsEngine.addBody(entityDef);
//console.dir(entityDef);
//        var groundSd = new b2BoxDef();
//	groundSd.extents.Set(1000, 50);
//	groundSd.restitution = 0.2;
//	var groundBd = new b2BodyDef();
//	groundBd.AddShape(groundSd);
//	groundBd.position.Set(-500, 340);
//	return world.CreateBody(groundBd)
		//console.log("loadWall "+this.ID);
        // YOUR CODE HERE
        // Use the 'SetLinearVelocity' method of physBody to
        // give the projectile a starting velocity.
        //
        // The SetLinearVelocity method takes a Vec2 as a
        // parameter. Use this.dir and this.speed to calculate
        // what this Vec2 should be.
        
    },
	
	//-----------------------------

    
    update: function () {
    	var position = this.physBody.GetPosition();
    },
    
    draw: function(){
    //	var position = this.physBody.GetPosition();
	//	ctx.fillStyle="#FF0000";
	//	var position2 = this.calcPosition(position.x,position.y);
	//	ctx.fillRect(position2.x,position2.y,this.size.x,this.size.y);
    },
    calcPosition: function(x,y){
		var viewTopLeftX = gMap.viewRect.x;
		var viewTopLeftY = gMap.viewRect.y;
		
		var actualPOS = {
		 x: x-viewTopLeftX,
		 y: y-viewTopLeftY
		 };
		return actualPOS;
    },
    clear: function(){

    }
    
});
