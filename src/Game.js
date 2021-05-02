import ENV from "./env.js";
import ResourceManager from "./resourcemanager.js";
import Director from "./scene/director.js";

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
		return this.get(key) == true;
	}
}

export default class Game {
	constructor(canvas) {
		this.isRunning= false;
		this.coppola= null;

		this.gc= {
			viewport: {
				width: ENV.VIEWPORT_WIDTH,
				height: ENV.VIEWPORT_HEIGHT,
				canvas,
				bbox: canvas.getBoundingClientRect(),
				ctx: canvas.getContext("2d"),
				ratioWidth: canvas.width / ENV.VIEWPORT_WIDTH,
				ratioHeight: canvas.height / ENV.VIEWPORT_HEIGHT,
			},

			resourceManager: null,

			dt: inc,
			tick: 0,

			mouse: {x: 0, y: 0, down: false},
			keys: new KeyMap(),
			scene: null
		};

		this.gc.viewport.ctx.scale(this.gc.viewport.ratioWidth, this.gc.viewport.ratioHeight);

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

		if(e.srcElement.className == "overlay")
			return;

		let x,y;

		if(["touchstart", "touchend", "touchcancel", "touchmove"].includes(e.type)) {
			let touch= e.touches[0] || e.changedTouches[0];
			x= touch.pageX;
			y= touch.pageY;
		}

		if(["mousedown", "mouseup", "mousemove", "click"].includes(e.type)) {
			x= e.clientX;
			y= e.clientY;	
		}

		const bbox= this.gc.viewport.bbox;
		const evt= {
			type: e.type,
			buttons: e.buttons,
			x: ((x - bbox.x) / this.gc.viewport.ratioWidth) | 0,
			y: ((y - bbox.y) / this.gc.viewport.ratioHeight) | 0,
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
				this.gc.keys.set(e.key, evt.type == "keydown");
				break;
	
			case "click":
				if(evt.x>this.gc.viewport.width - 50 && evt.y>this.gc.viewport.height - 50)
					console.show();
			case "mousedown":
			case "mouseup":
			case "mousemove": {
				this.gc.mouse.down= evt.type == "mousedown";
				this.gc.mouse.x= evt.x;
				this.gc.mouse.y= evt.y;
				break;
			}

			case "touchmove": {
				evt.type= "mousemove";
				this.gc.mouse.x= evt.x;
				this.gc.mouse.y= evt.y;
				break;
			}
			case "touchstart": {
				evt.type= "mousedown";
				this.gc.mouse.x= evt.x;
				this.gc.mouse.y= evt.y;
				break;
			}
			case "touchcancel": {
				evt.type= "mouseup";
				this.gc.mouse.x= evt.x;
				this.gc.mouse.y= evt.y;
				break;
			}

			case "devicemotion":
				console.log("devicemotion", e.rotationRate);
				break;

		}
		this.coppola.handleEvent(this.gc, evt);
	}
	
	async start() {

		this.gc.resourceManager= new ResourceManager();

		console.log("resourceManager.load");
		try{
			await this.gc.resourceManager.load();
		}
		catch(err) {
			console.error("resourceManager.load", err);
		}

		console.log("new Director");
		this.coppola= new Director(this.gc);
        this.coppola.run("menu");

		[
			"mousemove", "mousedown", "mouseup", "click",
			"touchmove", "touchstart", "touchend", "touchcancel",
			"keyup", "keydown",
			"contextmenu",
			"blur", "focus"
		].forEach(type=> window.addEventListener(type, this));
	
		console.log("play()");
		this.play();
	}
}
