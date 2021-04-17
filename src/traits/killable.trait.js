import Trait from './Trait.js';
import Level from '../Level.js';

export default class KillableTrait extends Trait {
	static EVENT_KILLED = Symbol('brickKilled');

	constructor() {
		super();

		this.isDead= false;
	}

	kill() {
		this.isDead= true;		
	}

	update(entity, {level}) {
		if(this.isDead) {
			level.broadcast(KillableTrait.EVENT_KILLED, entity);
			level.addTask(Level.REMOVE_ENTITY, entity);
		}
    }

}
