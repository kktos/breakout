import Entity from "../entities/Entity.js";
import BallEntity from "../entities/ball.entity.js";
import SpawnerEntity from "../entities/enemyspawner.entity.js";
import PaddleEntity from "../entities/paddle.entity.js";
import ENV from "../env.js";
import Events from "../events/events.js";
import BackgroundLayer from "../layers/background.layer.js";
import DashboardLayer from "../layers/dashboard.layer.js";
import EntitiesLayer from "../layers/entities.layer.js";
import {COLLISION,collideRect } from "../math.js";
import TaskList from "../tasklist.js";
import Trait from "../traits/Trait.js";
import KillableTrait from "../traits/killable.trait.js";
import PlayerTrait from "../traits/player.trait.js";
import StickyTrait from "../traits/powerups/sticky.trait.js";
import Scene from "./Scene.js";

export default class LevelScene extends Scene {

	// static TASK_REMOVE_ENTITY= Symbol('removeEntity');
	// static TASK_ADD_ENTITY= Symbol('addEntity');
	// static TASK_RESET= Symbol('reset');

	// static STATE_STARTING= Symbol('starting');
	// static STATE_RUNNING= Symbol('running');
	// static STATE_ENDING= Symbol('ending');

	constructor(gc, name, {background, bricks}) {
		super(gc, name);

		this.bbox= {x:18, y:ENV.WALL_TOP+12, dx:this.screenWidth-18, dy:this.screenHeight};
		this.entities= [];

		this.audio= gc.resourceManager.get("audio","level");
		this.state= LevelScene.STATE_STARTING;

		this.breakableCount= 0;
		this.gravity= 50;

		this.tasks= new TaskList();
		this.setTaskHandlers(gc);

		const spawner= new SpawnerEntity(gc.resourceManager, 300, 550);
		this.entities.push(spawner);
	
		// const thing= new Entity(gc.resourceManager, 300, 100);
		// thing.size= {x:20,y:20};
		// this.entities.push(thing);

		this.addLayer(new BackgroundLayer(gc, background, true));
		this.addLayer(new EntitiesLayer(gc, this.entities, bricks));
		this.addLayer(new DashboardLayer(gc));
	}

	newPlayer(gc) {
		if(this.paddle) {
			const idx= this.entities.indexOf(this.paddle);
			if(idx !== -1)
				this.entities.splice(idx, 1);
		}

		this.paddle= new PaddleEntity(gc, ENV.PADDLE_X, ENV.PADDLE_Y);

		const trait= new Trait();
		trait
			.on(PlayerTrait.EVENT_PLAYER_KILLED, async (lives) => {
				if(lives===0) {
					this.state= LevelScene.STATE_ENDING;
					this.audio
						.play("game_over")
						.then(() => {
							this.events.emit(Scene.EVENT_COMPLETE, -1);
						});
				} else
					this.reset(gc);
			})
			.on(KillableTrait.EVENT_KILLED, async (entity) => {
				if(entity.class === "BrickEntity")
					this.breakableCount--;

				if(this.breakableCount<=0)
					this.events.emit(Scene.EVENT_COMPLETE, -1);
			});
		this.paddle.addTrait(trait);
		this.entities.push(this.paddle);

	}

	// findBall() {
	// 	return this.entities.find(e=>e.class==="BallEntity");
	// }

	init(gc) {
		this.newPlayer(gc);
		this.audio
			.play("new_level")
			.then(() => this.reset(gc));

		this.breakableCount= this.entities.filter(entity => (entity.class === "BrickEntity") && (entity.breakable) ).length;
	}

	reset(gc) {
		const ballIdx= this.entities.findIndex(e=>e.class==="BallEntity");
		if(ballIdx>=0)
			this.entities.splice(ballIdx, 1);

		const ball= new BallEntity(gc.resourceManager, 0, 0);
		this.entities.push(ball);

		this.paddle.reset();

		const sticky= this.paddle.traits.get(StickyTrait);
		sticky.stickIt(this.paddle, ball, true);

		this.state= LevelScene.STATE_RUNNING;

		// const bricks= this.entities.filter(a=>a.class=="BrickEntity");
		// console.log("BRICKS", bricks);
		// console.log("BREAKABLES", bricks.filter(b=>b.breakable));
		// console.log("OTHERS",this.entities.filter(a=>a.class!="BrickEntity"));

	}

	setTaskHandlers(gc) {
		this.tasks
			.onTask(LevelScene.TASK_REMOVE_ENTITY, (entity) => {
				const idx= this.entities.indexOf(entity);
				if(idx !== -1)
					this.entities.splice(idx, 1);			
			});

		this.tasks
			.onTask(LevelScene.TASK_ADD_ENTITY, (entity) => {
				this.entities.push(entity);
			});

		this.tasks
			.onTask(LevelScene.TASK_RESET, () => {
				this.reset(gc);
			});

	}

    addTask(name, ...args) {
		this.tasks.addTask(name, ...args);
 	}

	broadcast(name, ...args) {
		// this.entities.forEach(entity => entity.emit(name, ...args));
		for (let idx = 0; idx < this.entities.length; idx++) {
			this.entities[idx].emit(name, ...args);
		}
	}

	collides(gc, target) {
		for (let idx = 0; idx < this.entities.length; idx++) {
			const entity= this.entities[idx];

			if(target === entity)
				continue;

			// if(target.class === "BallEntity")
			// 	console.log("Level.collides", this.entities.length, idx, entity.class, entity.size, target.size);

			if(!(entity.size.x + entity.size.y) || !(target.size.x + target.size.y))
				continue;

			let side= collideRect(entity, target);

			if(side !== COLLISION.NONE) {
				target.collides(gc, side, entity);
				if(!entity.isFixed)
					continue;
				switch(side) {
					case COLLISION.LEFT:
						side= COLLISION.RIGHT;
						break;
		
					case COLLISION.RIGHT:
						side= COLLISION.LEFT;
						break;
		
					case COLLISION.TOP:
						side= COLLISION.BOTTOM;
						break;
		
					case COLLISION.BOTTOM:
						side= COLLISION.TOP;
						break;
				}
				entity.collides(gc, side, target);
			}
		}
	
	}

	update(gc) {
		const entities= this.entities;
		const movingOnes= entities.filter(entity => !entity.isFixed);

		// entities.forEach(entity => entity.update(gc));
		for (let idx = 0; idx < entities.length; idx++)
			entities[idx].update(gc);

		// movingOnes.forEach(entity => this.collides(gc, entity));
		for (let idx = 0; idx < movingOnes.length; idx++)
			this.collides(gc, movingOnes[idx]);

		// entities.forEach(entity => entity.finalize());
		for (let idx = 0; idx < entities.length; idx++)
			entities[idx].finalize();

		this.tasks.processTasks();
	}

	handleEvent(gc, e) {
		switch(e.type) {
			case "keydown": {
				switch(e.key) {
					case "r":
						this.reset(gc);
						break;
					case "n":
						this.events.emit(Scene.EVENT_COMPLETE, -1);
						break;
				}
				break;
			}
			case "click": {
				// console.log("Level.handleEvent", "click", this.paddle);
				this.paddle.emit(Events.EVENT_MOUSECLICK, gc, this.paddle.pos);
				break;
			}
		}
	}
}

LevelScene.TASK_REMOVE_ENTITY= Symbol('removeEntity');
LevelScene.TASK_ADD_ENTITY= Symbol('addEntity');
LevelScene.TASK_RESET= Symbol('reset');

LevelScene.STATE_STARTING= Symbol('starting');
LevelScene.STATE_RUNNING= Symbol('running');
LevelScene.STATE_ENDING= Symbol('ending');