import ENV from "./env.js";
import Level from "./Level.js";
import ResourceManager from "./ResourceManager.js";
import Director from "./scene/Director.js";
import Scene from "./scene/Scene.js";

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

function handleEvent(gc, e) {
	if(!e.isTrusted)
		return;
	switch(e.type) {
		case "click": {
			gc.coppola.handleEvent(gc, e);
			// this.paddle.emit(Events.EVENT_MOUSECLICK, gc, this.paddle.pos);
			break;
		}

		case "keyup":
			gc.keys.set(e.key, false);
			break;

		case "keydown":
			gc.keys.set(e.key, true);
			switch(e.key) {
				case "r":
					this.reset(gc);
					break;
			}
			break;

		case "mousedown": {
			gc.coppola.handleEvent(gc, e);
			gc.mouse.down= true;
			break;
		}
		case "mouseup": {
			gc.coppola.handleEvent(gc, e);
			gc.mouse.down= false;
			break;
		}

		case "mousemove": {
			gc.coppola.handleEvent(gc, e);
			const w= gc.screen.canvas.width;
			gc.mouse.x= Math.min(w, w * e.clientX /document.body.offsetWidth);
			gc.mouse.y= 0;
			break;
		}
	}
}

export default class Game {
	constructor(canvas) {
		this.gc= {
			screen: {
				canvas,
				ctx: canvas.getContext("2d")
			},

			resourceManager: new ResourceManager(),

			dt: inc,
			tick: 0,

			mouse: {x: 0, y: 0, down: false},
			keys: new KeyMap(),
			level: null,
			coppola: null
		};
	}

	loop(dt= 0) {
		acc+= (dt - lastTime) / 1000;
		while(acc > inc) {
	
			this.gc.coppola.update(this.gc);

			this.gc.tick++;
			acc-= inc;
		}
		lastTime= dt;
		requestAnimationFrame((dt)=> this.loop(dt));
	}

	async start() {
		await this.gc.resourceManager.load();

		this.gc.coppola= new Director(this.gc);
        this.gc.coppola.run("menu");

		["mousemove", "keyup", "keydown"]
			.forEach(type=> document.addEventListener(type, (e) => handleEvent(this.gc, e)));

		["mousedown", "mouseup", "click"]
			.forEach(type=> this.gc.screen.canvas.addEventListener(type, (e) => handleEvent(this.gc, e)));

		this.gc.screen.canvas.addEventListener('contextmenu', function(evt) { 
				evt.preventDefault();
			  }, false);

		this.loop();
	}
}