/*
	Created By :Jan-Jacques Theron
	Contact: theronjanjacques@gmail.com
*/
InputEngineClass = Class.extend({

	bindings: {},

	actions: {},

	mouse: {
		x: 0,
		y: 0
	},

	//-----------------------------
	setup: function () {
		gInputEngine.bind(38, 'move-up');
		gInputEngine.bind(37, 'move-left');
		gInputEngine.bind(40, 'move-down');
		gInputEngine.bind(39, 'move-right');

		document.addEventListener('keydown', gInputEngine.onKeyDown);
		document.addEventListener('keyup', gInputEngine.onKeyUp);
	},

	//-----------------------------
	onMouseMove: function (event) {
		gInputEngine.mouse.x = event.clientX;
		gInputEngine.mouse.y = event.clientY;
	},

	//-----------------------------
	onKeyDown: function (event) {
		var action = gInputEngine.bindings[event.keyCode];
		if (action) {
			gInputEngine.actions[action] = true;
		}
	},

	//-----------------------------
	onKeyUp: function (event) {

		var action = gInputEngine.bindings[event.keyCode];

		if (action) {
			gInputEngine.actions[action] = false;
		}
	},

	bind: function (key, action) {
		gInputEngine.bindings[key] = action;
	}

});

gInputEngine = new InputEngineClass();
