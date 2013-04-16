/*
	Created By :Jan-Jacques Theron
	Contact: theronjanjacques@gmail.com
*/

FinClass = EntityClass.extend({
	zindex : 20,

	physBody: null,

	init: function (x, y) {
	this.size.y = PlayerFINSizeY;
	this.size.x = PlayerFINSizeX;
       var entityDef = {
            id: "FIN"+this.ID,
            x: x+(this.size.x/2)-15,
            y: y+(this.size.y/2)-15,
            halfHeight: this.size.y * 0.5,
            halfWidth: this.size.x * 0.5,
            type: "static",
            userData: {
            	id: "FIN",
                ent: this
            }
        };

    	this.physBody = gPhysicsEngine.addBody(entityDef);
        
    },
	
	//-----------------------------

    
    update: function () {
    	var position = this.physBody.GetPosition();
    },
    
    draw: function(){
//    	var position = this.physBody.GetPosition();
//		ctx.fillStyle="#FF0000";
//		var position2 = this.calcPosition(position.x,position.y);
//		ctx.fillRect(position2.x,position2.y,this.size.x,this.size.y);
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
