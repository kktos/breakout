import Ball from "./entities/Ball.js";
import Paddle from "./entities/Paddle.js";
import {collideRect, COLLISION} from "./math.js";
import LayerEntities from "./layers/layer-entities.js";
import LayerBackground from "./layers/layer-background.js";
import LayerDashboard from "./layers/layer-dashboard.js";
import LayerBricks from "./layers/layer-bricks.js";
import Sticky from "./traits/trait-sticky.js";
import {loadJson} from "./loaders.js";
import Audio from "./Audio.js";

const LEVELS_DIR= "./assets/levels/";

export default class Level {

	static REMOVE_ENTITY= Symbol('removeEntity');

	static async Loader(id, gameContext) {
		const sheet= await loadJson(`${LEVELS_DIR}${id}.json`);

		const level= new Level(id, gameContext);

		level.addLayer(new LayerBackground(gameContext, sheet.background));

		if(sheet.bricks)
			level.addLayer(new LayerBricks(gameContext, level.entities, sheet.bricks));

		level.addLayer(new LayerEntities(gameContext, level.entities));

		level.addLayer(new LayerDashboard(gameContext, level.entities, level.paddle));

		return level;
	}

	constructor(id, gameContext) {
		this.gameContext= gameContext;

		this.audio= Audio.retrieve("level.json");
	
		this.audio.play("new_level");

		this.entities= [];
		this.layers= [];
		this.tasks = [];

		const canvas= gameContext.screen.canvas;
		this.paddle= new Paddle(300, 550);
		this.ball= new Ball(200, 200, 0, 0, canvas.width, canvas.height);

		const sticky= this.paddle.traits.get(Sticky);
		sticky.stickIt(this.ball, this.paddle);
		sticky.isSticky= true;
		sticky.stickyCountdown= 1;

		this.entities.push(this.paddle);

	}

	addLayer(layer) {
		this.layers.push(layer);
	}

    addTask(name, ...args) {
        this.tasks.push({name, args});
    }

	processTasks() {
		if(!this.tasks.length)
			return;

		this.tasks.forEach(({name, args}) => {
			switch(name) {
				case Level.REMOVE_ENTITY:
					const idx= this.entities.indexOf(args[0]);
					if(idx != -1)
						this.entities.splice(idx, 1);
					break;
			}
		});
		this.tasks.length= 0;
	}

	collides(gameContext, target) {
		this.entities.forEach(entity => {
			if(target == entity)
				return;

			const side= collideRect(entity, target);
			if(side != COLLISION.NONE) {
				target.collides(gameContext, side, entity);
				entity.collides(gameContext, side, target);
			}
		});
	
		this.processTasks();
	}

	update(gameContext) {
		this.ball.update(gameContext);
		this.collides(gameContext, this.ball);
	
		 this.paddle.update(gameContext);
		// this.collides(paddle);	
	}

	render(gameContext) {

		this.layers.forEach(layer => layer.render(gameContext));

		this.ball.render(gameContext);

		// ctx.fillStyle= "#ffffff";
		// ctx.font = '12px sans-serif';
		// ctx.fillText(`${((1/dt)|0).toString().padStart(3, '0')} FPS`, 10, 15);

	}

	handleEvent(e) {
		switch(e.type) {
			case "click": {
				this.paddle.traits.get(Sticky).free();
			}

			case "mousemove": {
				const paddleX= this.gameContext.screen.canvas.width * e.clientX * 2 /document.body.offsetWidth;
				this.paddle.move(paddleX);
				break;
			}
		}
	}
}