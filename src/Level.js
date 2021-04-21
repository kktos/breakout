import ENV from "./env.js";
import Events from "./events/Events.js";
import {collideRect, COLLISION} from "./math.js";
import Scene from "./scene/Scene.js";
import TaskList from "./TaskList.js";
import {loadJson} from "./utils/loaders.util.js";
import createBricks from "./utils/createBricks.util.js";
import BallEntity from "./entities/ball.entity.js";
import PaddleEntity from "./entities/paddle.entity.js";
import SpawnerEntity from "./entities/spawner.entity.js";
import EntitiesLayer from "./layers/entities.layer.js";
import BackgroundLayer from "./layers/background.layer.js";
import DashboardLayer from "./layers/dashboard.layer.js";
import DebuggerLayer from "./layers/debugger.layer.js";
import DisplayLayer from "./layers/display.layer.js";
import Trait from "./traits/Trait.js";
import StickyTrait from "./traits/powerups/sticky.trait.js";
import PlayerTrait from "./traits/player.trait.js";
import PaddleTrait from "./traits/paddle.trait.js";

export default class Level extends Scene {

	static REMOVE_ENTITY= Symbol('removeEntity');
	static ADD_ENTITY= Symbol('addEntity');
	static RESET= Symbol('reset');

	// static async load(id, gc) {
	// 	const sheet= await loadJson(`${ENV.LEVELS_DIR}${id}.json`);

	// 	const level= new Level(id, gc);

	// 	level.addLayer(new BackgroundLayer(gc, sheet.background));

	// 	if(sheet.debug) {
	// 		level.addLayer(new DebuggerLayer(gc));
	// 	}
	// 	else
	// 	if(sheet.texts) {
	// 		level.addLayer(new DisplayLayer(gc, sheet.texts));
	// 	}
	// 	else
	// 	if(sheet.bricks) {
	// 		createBricks(gc, level.entities, sheet.bricks)
	// 		level.addLayer(new EntitiesLayer(gc, level.entities));
	// 		level.addLayer(new DashboardLayer(gc, level.paddle));	
	// 	}

	// 	return level;
	// }

	// static async next(gc, next= null) {
	// 	next= next!=null ? next : gc.level.id+1;
	// 	gc.level= await Level.load(next, gc);
	// }	

	constructor(gc, id) {

		super(gc);

		this.id= id;
		this.audio= gc.resourceManager.get("audio","level");
		this.audio.play("new_level");

		this.gravity= 50;
		this.bbox= {x:18, y:ENV.WALL_TOP+12, dx:this.screenWidth-18, dy:this.screenHeight};
		this.entities= [];

		this.tasks= new TaskList();
		this.setTaskHandlers(gc);

		this.paddle= new PaddleEntity(gc.resourceManager, 300, 550);
		const trait= new Trait();
		trait.on(PlayerTrait.EVENT_PLAYER_KILLED, async (lives) => {
			if(lives==0) {
				this.audio.play("game_over");
				gc.level= await Level.load(0, gc);
			} else
				this.reset(gc);
		});
		this.paddle.addTrait(trait);
		this.entities.push(this.paddle);

		const spawner= new SpawnerEntity(gc.resourceManager, 300, 550);
		this.entities.push(spawner);

		this.reset(gc);
	}

	init(gc) {
		gc.level= this;
	}

	reset(gc) {
		const ball= new BallEntity(gc.resourceManager, 200, 200, this.paddle);
		this.entities.push(ball);

		this.paddle.traits.get(PaddleTrait).revokePower(this.paddle);

		const sticky= this.paddle.traits.get(StickyTrait);
		sticky.stickIt(this.paddle, ball, true);
	}

	setTaskHandlers(gc) {
		this.tasks
			.onTask(Level.REMOVE_ENTITY, (entity) => {
				const idx= this.entities.indexOf(entity);
				if(idx != -1)
					this.entities.splice(idx, 1);			
			});

		this.tasks
			.onTask(Level.ADD_ENTITY, (entity) => {
				this.entities.push(entity);
			});

		this.tasks
			.onTask(Level.RESET, () => {
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

			// case "keyup":
			// 	gc.keys.set(e.key, false);
			// 	break;

			// case "keydown":
			// 	gc.keys.set(e.key, true);
			// 	switch(e.key) {
			// 		case "r":
			// 			this.reset(gc);
			// 			break;
			// 	}
			// 	break;

			// case "mousedown": {
			// 	gc.mouse.down= true;
			// 	break;
			// }
			// case "mouseup": {
			// 	gc.mouse.down= false;
			// 	break;
			// }

			// case "mousemove": {
			// 	gc.mouse.x= Math.min(this.screenWidth, this.screenWidth * e.clientX /document.body.offsetWidth);
			// 	gc.mouse.y= 0;
			// 	break;
			// }
		}
	}
}