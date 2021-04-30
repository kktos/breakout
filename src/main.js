import "./index.css";
// import Game from "./game.js";

const LOGLEVELS= ["LOG", "ERR"];
const OUTPUT= document.getElementById("log");
OUTPUT.innerHTML= "";
function print(level, args) {
	OUTPUT.innerHTML+= `<div class="${level==2?"err":""}">${LOGLEVELS[level-1]}:${args.join(" ")}</div>`;
	con.log(...args);

}
const con= window.console;
const console= {};
console.log= (...args) => print(1, args);
console.error= (...args) => print(2, args);
window.console= console;

const canvas= document.getElementById("game");
canvas.width= window.innerWidth;
canvas.height= window.innerHeight;

console.log('TEST 6');

try {
	import(
		/* webpackPrefetch: true */
		"./game.js"
	)
		.then(m=>m.default)
		.then(Game => {
			const game= new Game(canvas);
			game.start();
		})
		.catch(err => console.error("IMPORT",err))
}
catch(e) {
	console.error("EXCEPTION");
	console.error(e);
}
