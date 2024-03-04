import LevelScene from '../scene/level.scene.js';
import Trait from './Trait.js';

export default class KillableTrait extends Trait {
	// static EVENT_KILLED = Symbol('Killed');

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
		const {scene, dt}= gc;

		if(this.isDead) {
			entity.isSolid= false;

			this.deadTime += dt;
			entity.pause();
			if(this.deadTime > this.removeAfter) {
				scene.broadcast(KillableTrait.EVENT_KILLED, entity);
				scene.addTask(LevelScene.TASK_REMOVE_ENTITY, entity);
			}
		}
    }

}

KillableTrait.EVENT_KILLED = Symbol('Killed');
