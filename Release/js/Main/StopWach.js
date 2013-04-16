/*
	Created By :Jan-Jacques Theron
	Contact: theronjanjacques@gmail.com
*/
StopWachClass = Class.extend({
		
		startTime: 0,
		stoppedValue: 0,
		clockRunning: false,
		
        init : function () {
        	this.startTime = 0;
			this.stoppedValue = 0;
			this.clockRunning = false;             
        },
        start : function () {
        	dateObject = new Date();
        	this.startTime = dateObject.getTime();
        	this.clockRunning = true;
        },
        stop : function () {
        	dateObject = new Date();
        	this.clockRunning = false;
        	this.stoppedValue = dateObject.getTime();
        },
        getTime : function () {
        	dateObject = new Date();
        	var curTime = dateObject.getTime();
        	var tsimeObject = {
        		mSeconds:0,
        		seconds:0,
        		min:0,
        		hour:0
        	};
        	
        	if(this.clockRunning)
        	{   
        		var elapsedTime = curTime - this.startTime;
        		tsimeObject.mSeconds = Math.floor(elapsedTime % 1000);
        		tsimeObject.seconds = Math.floor((elapsedTime / 1000) % 60);
        		tsimeObject.min = Math.floor(((elapsedTime / 1000)/60) % 60);
        		tsimeObject.hour = Math.floor((((elapsedTime / 1000)/60)/60)%60);
        		
        		
        	}else{
        	
        		var elapsedTime = this.stoppedValue - this.startTime;
        		tsimeObject.mSeconds = Math.floor(elapsedTime % 1000);
        		tsimeObject.seconds = Math.floor((elapsedTime / 1000) % 60);
        		tsimeObject.min = Math.floor(((elapsedTime / 1000)/60) % 60);
        		tsimeObject.hour = Math.floor((((elapsedTime / 1000)/60)/60)%60);
        	}
        	var timeWindow = document.getElementById("stropWach")
        	timeWindow.innerHTML ="<p><font size='1'>"+tsimeObject.hour+":"+tsimeObject.min+":"+tsimeObject.seconds+":"+tsimeObject.mSeconds+"</font></p>"
        	return tsimeObject;
			
        }
});
var stopWach = new StopWachClass();