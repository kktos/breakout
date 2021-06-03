import ENV from "./env.js";
import ResourceManager from "./resourcemanager.js";
import Director from "./scene/director.js";

const GP_STICKS_AXES= {
	LEFT_HORIZONTAL: 0,
	LEFT_VERTICAL: 1,
	RIGHT_HORIZONTAL: 2,
	RIGHT_VERTICAL: 3
};
const GP_BUTTONS= {
	X: 2,
	Y: 3,
	A: 0,
	B: 1,
	CURSOR_UP: 12,
	CURSOR_DOWN: 13,
	CURSOR_LEFT: 14,
	CURSOR_RIGHT: 15,
	TRIGGER_LEFT: 6,
	TRIGGER_RIGHT: 7,
	LEFT: 4,
	RIGHT: 5
};

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
			gamepad: null,
			keys: new KeyMap(),
			scene: null
		};

		this.gc.viewport.ctx.scale(this.gc.viewport.ratioWidth, this.gc.viewport.ratioHeight);

	}

	loop(dt= 0) {
		acc+= (dt - lastTime) / 1000;
		while(acc > inc) {
			this.gc.gamepad && this.readGamepad();
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

	readGamepad() {
		const gamepad= navigator.getGamepads()[this.gc.gamepad.id];
		if(gamepad.timestamp == this.gc.gamepad.lastTime)
			return;

		this.gc.gamepad.lastTime= gamepad.timestamp;
		const hMove= gamepad.axes[GP_STICKS_AXES.RIGHT_HORIZONTAL].toFixed(3);
		const vMove= gamepad.axes[GP_STICKS_AXES.RIGHT_VERTICAL].toFixed(3);

		if(hMove!=0 || vMove!=0)
			setTimeout(() => {
				// const bbox= this.gc.viewport.bbox;
				// const w= bbox.width/2;
				// const h= bbox.height/2;
				// const evt= {
				// 	type: "mousemove",
				// 	buttons: [],
				// 	x: (w + (w * hMove)) / this.gc.viewport.ratioWidth | 0,
				// 	y: (h + (h * vMove)) / this.gc.viewport.ratioHeight | 0,
				// 	key: undefined
				// };
				// this.gc.mouse.x= evt.x;
				// this.gc.mouse.y= evt.y;
				// this.coppola.handleEvent(this.gc, evt);

				const evt= {
					type: "joyaxismove",
					timestamp: gamepad.timestamp,
					vertical: vMove,
					horizontal: hMove
				};				
				this.coppola.handleEvent(this.gc, evt);

			}, 0);

		if(	gamepad.buttons[GP_BUTTONS.X].pressed ||
			gamepad.buttons[GP_BUTTONS.Y].pressed ||
			gamepad.buttons[GP_BUTTONS.A].pressed ||
			gamepad.buttons[GP_BUTTONS.B].pressed ||
			gamepad.buttons[GP_BUTTONS.CURSOR_UP].pressed ||
			gamepad.buttons[GP_BUTTONS.CURSOR_DOWN].pressed ||
			gamepad.buttons[GP_BUTTONS.CURSOR_LEFT].pressed ||
			gamepad.buttons[GP_BUTTONS.CURSOR_RIGHT].pressed ||
			gamepad.buttons[GP_BUTTONS.TRIGGER_LEFT].pressed ||
			gamepad.buttons[GP_BUTTONS.TRIGGER_RIGHT].pressed
			)
			setTimeout(() => {
				const evt= {
					type: "joybuttondown",
					timestamp: gamepad.timestamp,
					X: gamepad.buttons[GP_BUTTONS.X].pressed,
					Y: gamepad.buttons[GP_BUTTONS.Y].pressed,
					A: gamepad.buttons[GP_BUTTONS.A].pressed,
					B: gamepad.buttons[GP_BUTTONS.B].pressed,
					CURSOR_UP: gamepad.buttons[GP_BUTTONS.CURSOR_UP].pressed,
					CURSOR_DOWN: gamepad.buttons[GP_BUTTONS.CURSOR_DOWN].pressed,
					CURSOR_LEFT: gamepad.buttons[GP_BUTTONS.CURSOR_LEFT].pressed,
					CURSOR_RIGHT: gamepad.buttons[GP_BUTTONS.CURSOR_RIGHT].pressed,
					TRIGGER_LEFT: gamepad.buttons[GP_BUTTONS.TRIGGER_LEFT].pressed,
					TRIGGER_RIGHT: gamepad.buttons[GP_BUTTONS.TRIGGER_RIGHT].pressed
				};				
				this.coppola.handleEvent(this.gc, evt);
			}, 0);			
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

			case "gamepadconnected":
				this.gc.gamepad= {id: e.gamepad.index, lastTime: 0};
				break;
			case "gamepaddisconnected":
				this.gc.gamepad= null;
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
			"blur", "focus",
			"gamepadconnected", "gamepaddisconnected"
		].forEach(type=> window.addEventListener(type, this));
	
		console.log("play()");
		this.play();
	}
}
