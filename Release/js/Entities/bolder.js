/*
	Created By :Jan-Jacques Theron
	Contact: theronjanjacques@gmail.com
*/
BOLDERClass = EntityClass.extend({
	zindex : 20,

	physBody: null,

	ID: "",
	fixedX: 0,
	fixedY: 0,
	init: function (x, y) {
		
		var bucket = bucketsOfWalls.pop();
		console.dir(bucket);

	    this.ID = "BOLDER";
    	this.fixedX = x;
		this.fixedY = y;
		this.size.x = 50;
		this.size.y = 50;
       var entityDef = {
            id: "BOLDER"+this.ID,
            x: x,
            y: y,
            halfHeight: this.size.x * 0.5,
            halfWidth: this.size.y* 0.5,
            userData: {
            	id: "BOLDER",
                ent: this
            },
            density:1.0,
            friction:0,
            restitution:0.2
        };

    	this.physBody = gPhysicsEngine.addBody(entityDef);
        
    },
	
	//-----------------------------

    
    update: function () {
 //   	var position = this.physBody.GetPosition();
    },
    
    draw: function(){
    	gPhysicsEngine.world.DrawDebugData();
		var position = this.physBody.GetPosition();
		ctx.fillStyle="#FF0000";
		var position2 = this.calcPosition(position.x,position.y);
		ctx.fillRect(position2.x-(this.size.x/2)+15,position2.y-(this.size.y/2)+15,this.size.x,this.size.y);
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