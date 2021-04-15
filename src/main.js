
import Game from "./game.js";

const canvas= document.getElementById("game");
const ctx= canvas.getContext("2d");
canvas.width= 600;
canvas.height= 600;

function clear() {
	ctx.fillStyle= "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const bootstrap= () => {
	document.removeEventListener("click", bootstrap);
	const game= new Game(canvas);
	game.start();	
}

document.addEventListener("click", bootstrap);

clear();
ctx.fillStyle= "#ffffff";
ctx.font = '36px sans-serif';
ctx.fillText("CLICK TO START", canvas.width/2 - 150, canvas.height/2);

