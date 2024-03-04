import "./index.css";
import "./utils/console.util.js";

console.hide();

const canvas= document.getElementById("game");
canvas.width= window.innerWidth;
canvas.height= window.innerHeight;

try {
	import(
		/* webpackPrefetch: true */
		"./Game.js"
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
