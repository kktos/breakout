import Level from "./Level.js";
import ResourceManager from "./ResourceManager.js";

let lastTime= 0;
let acc= 0;
let inc= 1/120;

export default class Game {
	constructor(canvas) {
		this.ctx= {
			screen: {
				canvas,
				ctx: canvas.getContext("2d")
			},

			resourceManager: new ResourceManager(),

			dt: inc,
			tick: 0,

			level: null
		};
	}

	update() {
		this.ctx.level.update(this.ctx);
	}

	render() {
		this.ctx.level.render(this.ctx);
	}

	loop(dt= 0) {
		acc+= (dt - lastTime) / 1000;
		while(acc > inc) {
			this.update();
			this.ctx.tick++;
			acc-= inc;
		}
		lastTime= dt;
		this.render();
		requestAnimationFrame((dt)=> this.loop(dt));
	}

	async start() {
		await this.ctx.resourceManager.load();

		this.ctx.level= await Level.Loader(0, this.ctx);

		["mousemove", "mousedown", "mouseup", "click"]
			.forEach(type=> document.addEventListener(type, (e) => this.ctx.level.handleEvent(e)));

		this.loop();
	}
}