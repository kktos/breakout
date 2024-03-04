import ResourceManager from "./ResourceManager.js";
import { Timer } from "./Timer.js";
import { GAME_EVENTS } from "./constants/events.const.js";
import { GP_BUTTONS, GP_STICKS_AXES } from "./constants/gamepad.const.js";
import ENV from "./env.js";
import Director from "./scene/director.js";
import { createViewport } from "./utils/canvas.utils.js";

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
		return this.get(key) === true;
	}
}

export default class Game {
	constructor(canvas) {
		this.coppola= null;

		this.gc= {
			viewport: createViewport(canvas),

			resourceManager: null,

			dt: ENV.FPS,
			tick: 0,

			mouse: {x: 0, y: 0, down: false},
			gamepad: null,
			keys: new KeyMap(),
			scene: null
		};

		this.gc.viewport.ctx.scale(this.gc.viewport.ratioWidth, this.gc.viewport.ratioHeight);

		this.timer = new Timer(ENV.FPS);
		this.timer.update = (deltaTime) => {
			this.gc.tick++;
			this.gc.deltaTime = deltaTime;
			this.gc.gamepad && this.readGamepad();
			this.coppola.update(this.gc);
		};
		
	}

	pause() {
		this.timer.stop();

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
		overlay?.remove();

		this.timer.start();
	}

	readGamepad() {
		const gamepad= navigator.getGamepads()[this.gc.gamepad.id];
		if(gamepad.timestamp === this.gc.gamepad.lastTime)
			return;

		this.gc.gamepad.lastTime= gamepad.timestamp;
		const hMove= gamepad.axes[GP_STICKS_AXES.RIGHT_HORIZONTAL].toFixed(3);
		const vMove= gamepad.axes[GP_STICKS_AXES.RIGHT_VERTICAL].toFixed(3);

		if(hMove!==0 || vMove!==0)
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

		if(e.srcElement.className === "overlay")
			return;

		let x;
		let y;

		if(["touchstart", "touchend", "touchcancel", "touchmove"].includes(e.type)) {
			const touch= e.touches[0] || e.changedTouches[0];
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
				this.gc.keys.set(e.key, evt.type === "keydown");
				break;
	
			// biome-ignore lint/suspicious/noFallthroughSwitchClause: <explanation>
			case  "click":
				if(evt.x>this.gc.viewport.width - 50 && evt.y>this.gc.viewport.height - 50)
					console.show();
			case "mousedown":
			case "mouseup":
			case "mousemove": {
				this.gc.mouse.down= evt.type === "mousedown";
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

		for (let idx = 0; idx < GAME_EVENTS.length; idx++) {
			window.addEventListener(GAME_EVENTS[idx], this);
		}
	
		console.log("play()");
		this.play();
	}
}
