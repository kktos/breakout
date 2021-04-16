import ENV from "./env.js";
import BallEntity from "./entities/ball.entity.js";
import PaddleEntity from "./entities/paddle.entity.js";
import {collideRect, COLLISION} from "./math.js";
import EntitiesLayer from "./layers/entities.layer.js";
import BackgroundLayer from "./layers/background.layer.js";
import DashboardLayer from "./layers/dashboard.layer.js";
import BricksLayer from "./layers/bricks.layer.js";
import StickyTrait from "./traits/sticky.trait.js";
import {loadJson} from "./loaders.js";
import Audio from "./Audio.js";

export default class Level {

	static REMOVE_ENTITY= Symbol('removeEntity');

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
		this.gameContext= gameContext;

		this.audio= Audio.retrieve("level.json");
	
		this.audio.play("new_level");

		this.entities= [];
		this.layers= [];
		this.tasks = [];

		const canvas= gameContext.screen.canvas;

		this.ball= new BallEntity(200, 200, 18, ENV.WALL_TOP+12, canvas.width-18, canvas.height);
		this.entities.push(this.ball);
		
		this.paddle= new PaddleEntity(300, 550);
		const sticky= this.paddle.traits.get(StickyTrait);
		sticky.stickIt(this.ball, this.paddle);
		sticky.isSticky= true;
		sticky.removeAfter= 1;

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

		this.entities.forEach(entity => {
			entity.update(gameContext);
		});
		// this.ball.update(gameContext);
		this.collides(gameContext, this.ball);
	
		//  this.paddle.update(gameContext);
		// this.collides(paddle);	
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
				const paddleX= this.gameContext.screen.canvas.width * e.clientX * 2 /document.body.offsetWidth;
				this.paddle.move(paddleX);
				break;
			}
		}
	}
}