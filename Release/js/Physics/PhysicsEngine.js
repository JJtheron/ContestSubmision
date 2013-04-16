/*
	Created By :Jan-Jacques Theron
	Contact: theronjanjacques@gmail.com
*/
var Vec2 = Box2D.Common.Math.b2Vec2;
var BodyDef = Box2D.Dynamics.b2BodyDef;
var Body = Box2D.Dynamics.b2Body;
var FixtureDef = Box2D.Dynamics.b2FixtureDef;
var Fixture = Box2D.Dynamics.b2Fixture;
var World = Box2D.Dynamics.b2World;
var MassData = Box2D.Collision.Shapes.b2MassData;
var PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var DebugDraw = Box2D.Dynamics.b2DebugDraw;
var RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
var b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef

PhysicsEngineClass = Class.extend({
    world: null,

    PHYSICS_LOOP_HZ : 1.0 / 60.0,

    //-----------------------------------------
    create: function () {
        gPhysicsEngine.world = new World(
            new Vec2(0, 75), // Gravity vector
            false           // Don't allow sleep
        );
    },

    //-----------------------------------------
    update: function () {
        var start = Date.now();

        gPhysicsEngine.world.Step(
            gPhysicsEngine.PHYSICS_LOOP_HZ,    //frame-rate
            10,                 //velocity iterations
            10                  //position iterations
        );
        gPhysicsEngine.world.DrawDebugData();
        gPhysicsEngine.world.ClearForces();

        return(Date.now() - start);
    },

    //-----------------------------------------
    registerBody: function (bodyDef) {
        var body = gPhysicsEngine.world.CreateBody(bodyDef);
        return body;
    },
    addContactListener: function (callbacks) {
        var listener = new Box2D.Dynamics.b2ContactListener();

        if(callbacks.PostSolve) listener.PostSolve = function (contact, impulse) {
            callbacks.PostSolve(contact.GetFixtureA().GetBody(),
                                contact.GetFixtureB().GetBody(),
                                impulse.normalImpulses[0]);
        };

        gPhysicsEngine.world.SetContactListener(listener);
    },
    //-----------------------------------------
    addBody: function (entityDef) {
        var bodyDef = new BodyDef();

        bodyDef.id = entityDef.id;

        if(entityDef.type == 'static') {
            bodyDef.type = Body.b2_staticBody;
        } else {
           bodyDef.type = Body.b2_dynamicBody;
        }

        bodyDef.position.x = entityDef.x;
       	bodyDef.position.y = entityDef.y;
       	if(entityDef.userData)
       		bodyDef.userData = entityDef.userData;

        var body = this.registerBody(bodyDef);
        var fixtureDefinition = new FixtureDef();
        if(entityDef.density)
            fixtureDefinition.density = entityDef.density;
        if(entityDef.friction)
            fixtureDefinition.friction = entityDef.friction;
        if(entityDef.restitution)
            fixtureDefinition.restitution = entityDef.restitution;
		
        // Now we define the shape of this object as a box
        fixtureDefinition.shape = new PolygonShape();
        fixtureDefinition.shape.SetAsBox(entityDef.halfWidth, entityDef.halfHeight);
        body.CreateFixture(fixtureDefinition);

        return body;
    },

});

var gPhysicsEngine = new PhysicsEngineClass();
gPhysicsEngine.create();

