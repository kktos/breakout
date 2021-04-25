import ENV from "../env.js";
import Events from "../events/Events.js";
import {collideRect, COLLISION} from "../math.js";
import Scene from "./Scene.js";
import TaskList from "../TaskList.js";
import BallEntity from "../entities/ball.entity.js";
import PaddleEntity from "../entities/paddle.entity.js";
import SpawnerEntity from "../entities/enemyspawner.entity.js";
import Trait from "../traits/Trait.js";
import StickyTrait from "../traits/powerups/sticky.trait.js";
import PlayerTrait from "../traits/player.trait.js";
import PaddleTrait from "../traits/paddle.trait.js";
import KillableTrait from "../traits/killable.trait.js";
import BackgroundLayer from "../layers/background.layer.js";
import EntitiesLayer from "../layers/entities.layer.js";
import DashboardLayer from "../layers/dashboard.layer.js";

export default class LevelScene extends Scene {

	static TASK_REMOVE_ENTITY= Symbol('removeEntity');
	static TASK_ADD_ENTITY= Symbol('addEntity');
	static TASK_RESET= Symbol('reset');

	static STATE_STARTING= Symbol('starting');
	static STATE_RUNNING= Symbol('running');
	static STATE_ENDING= Symbol('ending');

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
	
		this.addLayer(new BackgroundLayer(gc, background));
		this.addLayer(new EntitiesLayer(gc, this.entities, bricks));
		this.addLayer(new DashboardLayer(gc));
	}

	newPlayer(gc) {
		if(this.paddle) {
			const idx= this.entities.indexOf(this.paddle);
			if(idx != -1)
				this.entities.splice(idx, 1);
		}

		this.paddle= new PaddleEntity(gc.resourceManager, 300, 550);

		const trait= new Trait();
		trait
			.on(PlayerTrait.EVENT_PLAYER_KILLED, async (lives) => {
				if(lives==0) {
					this.audio
						.play("game_over")
						.then(() => this.events.emit(Scene.EVENT_COMPLETE, "menu"));
				} else
					this.reset(gc);
			})
			.on(KillableTrait.EVENT_KILLED, async (entity) => {
				if(entity.class == "BrickEntity")
					this.breakableCount--;

				if(this.breakableCount<=0)
					this.events.emit(Scene.EVENT_COMPLETE, -1);
			});
		this.paddle.addTrait(trait);
		this.entities.push(this.paddle);

		this.reset(gc);

	}

	init(gc) {
		this.audio
			.play("new_level")
			.then(() => this.newPlayer(gc));

		this.breakableCount= this.entities.filter(entity => (entity.class == "BrickEntity") && (entity.type != "X") ).length;
	}

	reset(gc) {
		const ball= new BallEntity(gc.resourceManager, 200, 200, this.paddle);
		this.entities.push(ball);

		this.paddle.reset();

		const sticky= this.paddle.traits.get(StickyTrait);
		sticky.stickIt(this.paddle, ball, true);

		this.state= LevelScene.STATE_RUNNING;
	}

	setTaskHandlers(gc) {
		this.tasks
			.onTask(LevelScene.TASK_REMOVE_ENTITY, (entity) => {
				const idx= this.entities.indexOf(entity);
				if(idx != -1)
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
		this.entities.forEach(entity => entity.emit(name, ...args));
	}

	collides(gc, target) {
		this.entities.forEach(entity => {
			if(target == entity)
				return;

			if(!(entity.size.x + entity.size.y) || !(target.size.x + target.size.y))
				return;

			const side= collideRect(entity, target);
			if(side != COLLISION.NONE) {
				target.collides(gc, side, entity);
			}
		});
	
	}

	update(gc) {

		// function generateID() {
		// 	let letters= [];
		// 	for(let idx= 0; idx <5; idx++)
		// 		letters.push(65 + Math.random()*26);
		// 	return String.fromCharCode(...letters);
		// }

		// if(!gc.entities)
		// 	gc.entities= {};
		// gc.entities.MAINLOOP= generateID();

		this.entities.forEach(entity => entity.update(gc));
		this.entities.forEach(entity => this.collides(gc, entity));
        this.entities.forEach(entity => entity.finalize());

		// if(this.tasks.tasks.length) {
		// 	console.log(
		// 		`${gc.entities.MAINLOOP} TASK:${this.tasks.tasks.length}`,
		// 		this.tasks.tasks.map(({name}) => name.toString()).join(",")
		// 	);
		// }
		this.tasks.processTasks();
	}

	handleEvent(gc, e) {
		switch(e.type) {
			case "click": {
				this.paddle.emit(Events.EVENT_MOUSECLICK, gc, this.paddle.pos);
				break;
			}
		}
	}
}