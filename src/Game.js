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
	
	isPressed(key) {
		// console.log({key,pressed:this.get(key)});
		return this.get(key) == true;
	}
}

export default class Game {
	constructor(canvas) {
		this.isRunning= false;
		this.coppola= null;

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

	loop(dt= 0) {
		acc+= (dt - lastTime) / 1000;
		while(acc > inc) {
	
			this.coppola.update(this.gc);

			this.gc.tick++;
			acc-= inc;
		}
		lastTime= dt;
		this.isRunning && requestAnimationFrame((dt)=> this.loop(dt));
	}

	pause() {
		this.isRunning= false;
		const overlay= document.createElement("div");
		overlay.className= "overlay";
		overlay.id= "gamepaused";
		const msg= document.createElement("div");
		msg.className= "gamepaused";
		msg.innerText= "GAME PAUSED";
		overlay.appendChild(msg);
		document.body.appendChild(overlay);
	}

	play() {
		const overlay= document.querySelector("#gamepaused");
		overlay && overlay.remove();
		this.isRunning= true;
		this.loop();
	}

	handleEvent(e) {
		if(!e.isTrusted)
			return;
	
		const bbox= this.gc.screen.bbox;
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
	
			case "focus":
				this.play();
				return;
	
			case "blur":
				this.pause();
				return;
	
			case "keyup":
			case "keydown":
				evt.key= e.key;
				// console.log(evt.type, e.key);
				this.gc.keys.set(e.key, evt.type == "keydown");
				break;
	
			case "mousedown":
			case "mouseup":
			case "click":
			case "mousemove": {
				this.gc.mouse.down= evt.type == "mousedown";
				this.gc.mouse.x= evt.x;
				this.gc.mouse.y= evt.y;
				break;
			}
		}
		this.coppola.handleEvent(this.gc, evt);
	}
	
	async start() {
		await this.gc.resourceManager.load();

		this.coppola= new Director(this.gc);
        this.coppola.run("menu");

		[
			"mousemove", "mousedown", "mouseup", "click",
			"keyup", "keydown",
			"contextmenu"]
			.forEach(type=> document.addEventListener(type, (e) => this.handleEvent(e)));

		["blur", "focus"]
			.forEach(type=> window.addEventListener(type, (e) => this.handleEvent(e)));

		this.play();
	}
}