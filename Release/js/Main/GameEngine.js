/*
	Created By :Jan-Jacques Theron
	Contact: theronjanjacques@gmail.com
*/
var gMap = null;
GameEngineClass = Class.extend({
	
	entities: [],
    factory: {},
    
	setup: function () {
		gInputEngine.setup();
		gMap= new TILEDMapClass();
		gMap.load();
		gPhysicsEngine.addContactListener({

            PostSolve: function (bodyA, bodyB, impulse) {
                var userDataA = bodyA.GetUserData();
                var userDataB = bodyB.GetUserData();
                userDataA.ent.onTouch(userDataB);
                userDataB.ent.onTouch(userDataA);
            }
        });
		
	},
    draw: function () {
        // Draw map. Note that we're passing a canvas context
        // of 'null' in. This would normally be our game context,
        // but we don't need to grade this here.
        

        // Bucket entities by zIndex
        var fudgeVariance = 128;
        var zIndex_array = [];
        var entities_bucketed_by_zIndex = {};
        // Draw entities sorted by zIndex
        for(var i = 0;i < gGameEngine.entities.length; i++)
        {
        	gGameEngine.entities[i].clear();
        }
		gMap.draw();
        // Draw entities sorted by zIndex
        for(var i = 0;i < gGameEngine.entities.length; i++)
        {
        	gGameEngine.entities[i].draw();
        }
        
    },

	spawnEntity: function (typename,x,y) {
        var ent = new (gGameEngine.factory[typename])(x,y);
		//ent.init(x,y);
		
        gGameEngine.entities.push(ent);

        return ent;
    },
    
    update: function () {
        for(var i = 0;i < gGameEngine.entities.length; i++)
        {
        	gGameEngine.entities[i].update();
        	
        }
        if(Begin)
        {
        	stopWach.start();
        	Begin= false;
        }
        gPhysicsEngine.update();
        gGameEngine.draw();
        stopWach.getTime();
        //console.log(gGameEngine.entities);
    }


});
