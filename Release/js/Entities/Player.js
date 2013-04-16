/*
	Created By :Jan-Jacques Theron
	Contact: theronjanjacques@gmail.com
*/
PlayerClass = EntityClass.extend({
	zindex : 50,


	walkSpeed: 500000,
	jumpPower: 9999999999,
	slide: 75,
	moved: 3, 
	standing: false,
	BlockBody: null,
	climb: {
			hanging: false,
			hungX: 0
			},
	physBody: null,
	
	frame : 0,
	frameStand : ["ManStanding.png"],
	framesLR : ["ManWalking1.png",
				"ManWalking1.png",
				"ManWalking1.png",
				"ManWalking1.png",
				"ManWalking2.png",
				"ManWalking2.png",
				"ManWalking2.png",
				"ManWalking2.png",
				"ManWalking2.png",
				"ManWalking.png",
				"ManWalking.png",
				"ManWalking.png",
				"ManWalking.png"
				],
				
	framesUD : ["ManWalkingUD1.png",
				"ManWalkingUD1.png",
				"ManWalkingUD1.png",
				"ManWalkingUD1.png",
				"ManWalkingUD2.png",
				"ManWalkingUD2.png",
				"ManWalkingUD2.png",
				"ManWalkingUD2.png"
				],

	CurrDrawArray: null,

	init: function (x, y) {
		

        this.dir = {
            x: 0,
            y: 0
        };
        this.pos.x= x;
        this.pos.y= y;

		this.CurrDrawArray = this.frameStand;
		
        this.lifetime = 2;
		var sprite = SSheet.getStats(this.frameStand[0]);
        // Create our physics body;
        var entityDef = {
            id: "Player0",
            x: this.pos.x,
            y: this.pos.y,
            halfHeight: sprite.h * 0.5,
            halfWidth: sprite.w * 0.5,
            damping: 0,
            density: 1,
            friction: 0,
            restitution:.5,
            userData: {
            	id:"Player0",
                ent: this
            }
        };
        this.physBody = gPhysicsEngine.addBody(entityDef);

        this.physBody.SetLinearVelocity(new Vec2(0,0));
       	gPhysicsEngine.update();
       	this.draw();
        

    },
	
	//-----------------------------
    
    update: function () {
    	var mov = false;
		if (gInputEngine.actions['move-up']) {

			 this.dir.y -= 1;
			 this.CurrDrawArray = this.framesUD;
			 mov = true;
			 this.moved = 3;
			 
			

		}
		if (gInputEngine.actions['move-down']) {

			 this.dir.y += 1;
			 this.CurrDrawArray = this.framesUD;
			 mov = true;
			 this.moved = 3;
		
		}
		if (gInputEngine.actions['move-left']) {

			this.dir.x -= 1;
			this.CurrDrawArray = this.framesLR;
			mov = true;
			this.moved = 3;
			
		}
		if (gInputEngine.actions['move-right']) {

			 this.dir.x += 1;			 
			 this.CurrDrawArray = this.framesLR;
			 mov = true;
			 this.moved = 3;
			 
		}
		
		if(!mov){
			this.moved -= 1;
			this.physNoMoveUpdate();

				
		}else{
			
			this.physicsUpdate();
			}
		if(this.moved < 1)
		{
			this.CurrDrawArray = this.frameStand;
			this.moved = 3;
		}
		 
		//gMap.centerAt(this.pos.x,this.pos.y);
		gMap.moveMapToSpawn(this.pos.x,this.pos.y);
		
    },
    physNoMoveUpdate: function(){
        var liniearV = this.physBody.GetLinearVelocity();
        if(this.standing == true)
        {
        	if(Math.abs(liniearV.x/2 > 1))
        		this.physBody.SetLinearVelocity(new Vec2(liniearV.x/2,liniearV.y));
        	else
        		this.physBody.SetLinearVelocity(new Vec2(0,liniearV.y));

    		
    		this.standing = false;
    	}
        if(this.physBody !== null) {
        	var pyPos = this.physBody.GetPosition();
        	this.pos = pyPos;
        }
    },
    physicsUpdate: function() {
    	//this.physBody.SetLinearVelocity(new Vec2(this.dir.x * this.walkSpeed,
        //                                         this.dir.y * this.walkSpeed));
    	//this.physBody.Set(this.pos.x+this.dir.x, this.dir.y+this.pos.y)
    	var liniearV = this.physBody.GetLinearVelocity();
    	//this.physBody.SetLinearVelocity(new Vec2(liniearV.x,liniearV.y));
    	
    	if(this.climb.hanging)
    	{
    		
    		if(this.climb.hungX < (this.pos.x - 5) || this.climb.hungX > (this.pos.x + 5))
    		{
    			this.physBody.ApplyForce(new Vec2(this.dir.x*this.jumpPower,
    										this.dir.y*this.jumpPower),
    										this.physBody.GetWorldCenter());
    			this.climb.hungX = this.pos.x;
    		}else
    		{
    			this.physBody.ApplyForce(new Vec2(this.dir.x*this.jumpPower,
    										0),
    										this.physBody.GetWorldCenter());
    			this.climb.hungX = this.pos.x;
    			
    		}
    		this.standing = false;
    		this.climb.hanging = false;
    	}
    	else if(this.standing) {
    		this.physBody.ApplyForce(new Vec2(this.dir.x*this.jumpPower,this.dir.y*this.jumpPower),
    									this.physBody.GetWorldCenter());
    		this.standing = false;
    		this.climb.hanging = false;
    		this.climb.hungX = this.pos.x;
    	}
        var oldX = this.pos.x;
    	var oldY = this.pos.y;

        if(this.physBody !== null) {
        	var pyPos = this.physBody.GetPosition();
        	this.pos = pyPos;
        }
		this.dir.x = 0;
		this.dir.y = 0;
    },
    
    draw: function(){
    	var sprite = SSheet.getStats(this.frameStand[0]);
		if(this.CurrDrawArray.length > 1)
		{
			this.frame = (this.frame+1) % this.CurrDrawArray.length;
			var drawPOS = this.calcPosition(this.pos.x,this.pos.y);
    		drawSprite(this.CurrDrawArray[this.frame], drawPOS.x+(sprite.w/2), drawPOS.y+(sprite.h/2));
    	}
    	else
    	{
    		var drawPOS = this.calcPosition(this.pos.x,this.pos.y);
    		drawSprite(this.CurrDrawArray[0], drawPOS.x+(sprite.w/2), drawPOS.y+(sprite.h/2));  		
    	}
    	//gMap.moveMap(this.pos.x,this.pos.y);
    	//gMap.moveMapToSpawn(this.pos.x,this.pos.y);
    	//gMap.centerAt(this.pos.x, this.pos.y);
    	
    },
    // Function normalizes the players position to a screenposition
    calcPosition: function(x,y){
		var viewTopLeftX = gMap.viewRect.x;
		var viewTopLeftY = gMap.viewRect.y;
		
		var actualPOS = {
		 x: x-viewTopLeftX,
		 y: y-viewTopLeftY
		 };
		return actualPOS;
    },
    
    createjoint: function() {
    		var mouseJoint = null;
    	    if(this.BlockBody.physBody) {
                  var md = new b2MouseJointDef();
                  md.bodyA = gPhysicsEngine.world.GetGroundBody();
                  md.bodyB = this.BlockBody.physBody;
                  md.target.Set(this.pos.x, this.pos.y);
                  md.collideConnected = true;
                  md.maxForce = this.jumpPower;
                  mouseJoint = gPhysicsEngine.world.CreateJoint(md);
               }
               mouseJoint.SetTarget(new Vec2(this.pos.x, this.pos.y));
    },
    
    onTouch: function(Body) {
    
    	if(Body.id == "Wall")
    	{
    		this.climb.hanging = true;
    		this.standing = false;
    		
    	}
    	else if(Body.id == "Ground")
    	{
    		this.standing = true;
    		this.climb.hanging = false;
    	}
    	if(Body.id == "FIN")
    	{
    		GameEnds();
    	}
     },
    
    clear: function(){
    	var sprite = SSheet.getStats(this.frameStand[0]);
    	var whidth = sprite.w;
    	var hight = sprite.h;
    	var myX = this.pos.x-sprite.w/2;
    	var myY = this.pos.y-sprite.h/2;
    	ctx.clearRect(myX,myY-5,whidth ,hight+10);
    }
    
    
});