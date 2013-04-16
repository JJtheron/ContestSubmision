/*
	Created By :Jan-Jacques Theron
	Contact: theronjanjacques@gmail.com
*/
var ctx = null;
var canvas = null;
var framerate = 1000/60;
var PlayerStartX = 1080;
var PlayerStartY = 1150;
var PlayerFINX = 1000;
var PlayerFINY = 0;
var PlayerFINSizeY = 0;
var PlayerFINSizeX = 0;
var PanAmountX = (PlayerStartX-PlayerFINX)/100;
var PanAmountY = (PlayerStartY-PlayerFINY)/100;
var PanY = PlayerFINY;
var PanX = PlayerFINX;
var Stall = 100;
var Begin = true;

var SSheet = new SpriteSheetClass();
SSheet.parseAtlasDefinition(mantexpack);
SSheet.load("Objects/mantexpack.png");
var gGameEngine = new GameEngineClass();
var myvar =  null;



var main = function(){

	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	SSheet.parseAtlasDefinition(mantexpack);
	SSheet.load("Objects/mantexpack.png");
	gGameEngine.setup();
	gGameEngine.factory['Player'] = PlayerClass;
	gGameEngine.factory['Wall'] = WallClass;
	gGameEngine.factory['Fin'] = FinClass;
	StartPage()
	
}

function StartPage()
{
	var div = document.createElement("div");
	div.id = "Start_Page";
	div.style.width = "200px";
	div.style.height = "200px";
	div.style.background = "#f6f6f6";
	div.style.zIndex = "10";
	div.style.position = "absolute";
	div.style.top = "150px";
	div.style.left = "150px";
	div.style.color = "#000500";
	div.innerHTML = "<p><font size='3'>Welcome to Runner!</font></p>"+
		"<p><font size='2'>Controls:</font><br><br>"+
		"<font size='1'>UP Arrow : Jump <br>"+
		"Left/Right Arrows : RUNNN!!!<br>"+
		"DOWN Arrow : flounder</font></p>"+
		"<button onclick='killAndStart()'>Sart The Game</button>"
		;
	document.body.appendChild(div);
	
	
	
}

function killAndStart()
{
	var Start_Page = document.getElementById("Start_Page");
	while ( Start_Page.firstChild ) Start_Page.removeChild( Start_Page.firstChild );
	document.body.removeChild(Start_Page);
	GameBegins();
	
}

function EndPage()
{
	var div = document.createElement("div");
	div.id = "Game_End";
	div.style.width = "200px";
	div.style.height = "200px";
	div.style.background = "#f6f6f6";
	div.style.zIndex = "10";
	div.style.position = "absolute";
	div.style.top = "150px";
	div.style.left = "150px";
	div.style.color = "#000500";
	var tsimeObject = stopWach.getTime();
	div.innerHTML = "<p><font size='3'>Done!</font></p>"+
		"<p><font size='2'>Time:</font><br>"+
		"<p><font size='2'>"+tsimeObject.hour+":"+tsimeObject.min+":"+tsimeObject.seconds+":"+tsimeObject.mSeconds+"</font></p>"+
		"<button onclick='Redo()'>Redo</button>"
		;
	document.body.appendChild(div);
}

function GameBegins()
{
	setTimeout(function(){
		gMap.preDrawCache();
		gMap.draw();
		gGameEngine.spawnEntity('Player',PlayerStartX,PlayerStartY);
		gGameEngine.spawnEntity('Fin',PlayerFINX,PlayerFINY);
		PanX = PlayerFINX;
		PanY = PlayerFINY;
		PanAmountX = (PlayerStartX-PlayerFINX)/100;
		PanAmountY = (PlayerStartY-PlayerFINY)/100;
		gGameEngine.draw();

		myvar = setInterval(function() {
				var value = PanDisplyToFin();
				if(value)
					gGameEngine.update();
				},framerate);
		//console.log(bucketsOfWalls);
		makeWalles();
	}, 1000);
}
//if(PanDisplyToFin(PlayerFINX,PlayerFINY))
function PanDisplyToFin()
{
	var withinTenX = (((PanX-10) < PlayerStartX) && ((PanX+10) > PlayerStartX));
	var withinTenY = (((PanY-10) < PlayerStartY) && ((PanY+10) > PlayerStartY));
	if(withinTenY && withinTenX)
		return true;
	if(Stall == 0)
	{
		PanX += PanAmountX;
		PanY += PanAmountY;
	}else
	{
		Stall-=1;
	}
	gMap.moveMapToSpawn(PanX,PanY);
	gMap.draw();
	return false;
	
}
function makeWalles()
{				
		while(0 < bucketsOfWalls.length)
		{
        	gGameEngine.spawnEntity("Wall",0,0);
        }
}
function GameEnds()
{
	console.log("Game is Over");
	clearInterval(myvar);
	stopWach.stop();
	EndPage();
}
function Redo()
{
	location.reload();
}

main();