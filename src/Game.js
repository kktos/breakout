import ENV from "./env.js";
import ResourceManager from "./ResourceManager.js";
import Director from "./scene/Director.js";

let lastTime= 0;
let acc= 0;
let inc= ENV.FPS;

class KeyMap {
	constructor() {
		this.map= new Map();
	}

	get(key) {
		if(!this.map.has(key))
			this.map.set(key, false);
		return this.map.get(key);
	}

	set(key, pressed) {
		this.map.set(key, pressed);
	}
}

function handleEvent(gc, coppola, e) {
	if(!e.isTrusted)
		return;

	const bbox= gc.screen.bbox;
	const evt= {
		type: e.type,
		buttons: e.buttons,
		x: e.x - bbox.x,
		y: e.y - bbox.y,
		key: undefined

	};

	switch(e.type) {

		case "contextmenu":
			e.preventDefault();
			return;

		case "keyup":
		case "keydown":
			evt.key= e.key;
			gc.keys.set(e.key, evt.type == "keydown");
			break;

		case "mousedown":
		case "mouseup":
		case "click":
		case "mousemove": {
			gc.mouse.down= evt.type == "mousedown";
			gc.mouse.x= evt.x;
			gc.mouse.y= evt.y;
			break;
		}
	}
	coppola.handleEvent(gc, evt);
}

export default class Game {
	constructor(canvas) {
		this.gc= {
			screen: {
				canvas,
				bbox: canvas.getBoundingClientRect(),
				ctx: canvas.getContext("2d")
			},

			resourceManager: new ResourceManager(),

			dt: inc,
			tick: 0,

			mouse: {x: 0, y: 0, down: false},
			keys: new KeyMap(),
			scene: null
		};
	}

	loop(coppola, dt= 0) {
		acc+= (dt - lastTime) / 1000;
		while(acc > inc) {
	
			coppola.update(this.gc);

			this.gc.tick++;
			acc-= inc;
		}
		lastTime= dt;
		requestAnimationFrame((dt)=> this.loop(coppola, dt));
	}

	async start() {
		await this.gc.resourceManager.load();

		const coppola= new Director(this.gc);
        coppola.run("menu");

		["mousemove", "keyup", "keydown", "mousedown", "mouseup", "click", "contextmenu"]
			.forEach(type=> document.addEventListener(type, (e) => handleEvent(this.gc, coppola, e)));

		this.loop(coppola);
	}
}