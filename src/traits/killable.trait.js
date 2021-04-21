import Trait from './Trait.js';
import Level from '../Level.js';

export default class KillableTrait extends Trait {
	static EVENT_KILLED = Symbol('Killed');

	constructor(removeAfter= 0) {
		super();

		this.isDead= false;
        this.deadTime= 0;
        this.removeAfter= removeAfter;
	}

	kill() {
		this.isDead= true;		
	}

	update(entity,gc) {
		const {level, dt}= gc;

		// if(window.ENTITIES && window.ENTITIES.includes(entity.id))
		// 	console.log(
		// 		`${gc.entities.MAINLOOP} UPDT:${gc.entities[entity.id].updateID}`,
		// 		"dead?",
		// 		`${entity.class}:${entity.id}`,
		// 		this.isDead?"DEAD":"ALIVE"
		// 	);

		if(this.isDead) {

			// console.log(
			// 	`${gc.entities.MAINLOOP} UPDT:${gc.entities[entity.id].updateID}`,
			// 	"KILL ",
			// 	`${entity.class}:${entity.id}`,
			// );
	
			this.deadTime += dt;
			entity.pause();
			if(this.deadTime > this.removeAfter) {
				level.broadcast(KillableTrait.EVENT_KILLED, entity);
				level.addTask(Level.REMOVE_ENTITY, entity);
			}
		}
    }

}
