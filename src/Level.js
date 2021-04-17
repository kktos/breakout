import ENV from "./env.js";
import BallEntity from "./entities/ball.entity.js";
import PaddleEntity from "./entities/paddle.entity.js";
import {collideRect, COLLISION} from "./math.js";
import EntitiesLayer from "./layers/entities.layer.js";
import BackgroundLayer from "./layers/background.layer.js";
import DashboardLayer from "./layers/dashboard.layer.js";
import BricksLayer from "./layers/bricks.layer.js";
import StickyTrait from "./traits/sticky.trait.js";
import {loadJson} from "./utils/loaders.util.js";

export default class Level {

	static REMOVE_ENTITY= Symbol('removeEntity');
	static ADD_ENTITY= Symbol('addEntity');
	static RESET= Symbol('reset');

	static async Loader(id, gameContext) {
		const sheet= await loadJson(`${ENV.LEVELS_DIR}${id}.json`);

		const level= new Level(id, gameContext);

		level.addLayer(new BackgroundLayer(gameContext, sheet.background));

		if(sheet.bricks)
			level.addLayer(new BricksLayer(gameContext, level.entities, sheet.bricks));

		level.addLayer(new EntitiesLayer(gameContext, level.entities));

		level.addLayer(new DashboardLayer(gameContext, level.entities, level.paddle));

		return level;
	}

	constructor(id, gameContext) {

		this.audio= gameContext.resourceManager.get("audio","level.json");
		this.audio.play("new_level");

		this.gravity= 50;

		const canvas= gameContext.screen.canvas;
		this.bbox= {x:18, y:ENV.WALL_TOP+12, dx:canvas.width-18, dy:canvas.height};
		this.screenWidth= canvas.width;

		this.entities= [];
		this.layers= [];
		this.tasks = [];

		this.ball= new BallEntity(gameContext.resourceManager, 200, 200);
		this.paddle= new PaddleEntity(gameContext.resourceManager, 300, 550);

		this.entities.push(this.paddle);

		this.reset();
	}

	reset() {

		this.entities.push(this.ball);

		this.paddle.move(300);
		const sticky= this.paddle.traits.get(StickyTrait);
		sticky.stickIt(this.ball, this.paddle);
		sticky.isSticky= true;
		sticky.removeAfter= 1;
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
				case Level.REMOVE_ENTITY: {
					const idx= this.entities.indexOf(args[0]);
					if(idx != -1)
						this.entities.splice(idx, 1);
					break;
				}
				case Level.ADD_ENTITY: {
					this.entities.push(args[0]);
					break;
				}
				case Level.RESET: {
					this.reset();
					break;
				}
			}
		});
		this.tasks.length= 0;
	}

	broadcast(name, ...args) {
		this.entities.forEach(entity => entity.emit(name, ...args));
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
	
	}

	update(gameContext) {
		this.entities.forEach(entity => entity.update(gameContext));

		this.collides(gameContext, this.ball);

        this.entities.forEach(entity => entity.finalize());

		this.processTasks();
	}

	render(gameContext) {

		this.layers.forEach(layer => layer.render(gameContext));

		// this.ball.render(gameContext);

		// ctx.fillStyle= "#ffffff";
		// ctx.font = '12px sans-serif';
		// ctx.fillText(`${((1/dt)|0).toString().padStart(3, '0')} FPS`, 10, 15);

	}

	handleEvent(e) {
		switch(e.type) {
			case "click": {
				this.paddle.traits.get(StickyTrait).free();
			}

			case "mousemove": {
				const paddleX= this.screenWidth * e.clientX * 2 /document.body.offsetWidth;
				this.paddle.move(paddleX);
				break;
			}
		}
	}
}