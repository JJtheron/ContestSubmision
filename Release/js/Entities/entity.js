/*
	Created By :Jan-Jacques Theron
	Contact: theronjanjacques@gmail.com
*/
EntityClass = Class.extend({
    pos : {x:0,y:0},
    size : {x:0,y:0},
    last : {x:0,y:0},
    currSpriteName : null,
    zindex: 0,

    update : function() { },
    onTouch: function() {},

    //-----------------------------------------
    draw : function() { }
});