import ENV from "../env.js";
import Trait from './Trait.js';

export default class TimerTrait extends Trait {
	// static EVENT_TIMER = Symbol('timer');

	constructor(id, time = 1000) {
		super();

		this.id= id;
		this.totalTime= time;
		this.reset();
	}

	reset() {
		this.currentTime= this.totalTime;
	}

	update(entity, {dt}) {
		this.currentTime-= dt * 1/ENV.FPS * 10;

		if(this.currentTime<=0) {
			this.reset();
			entity.emit(TimerTrait.EVENT_TIMER, this.id);
		}

    }

}

TimerTrait.EVENT_TIMER = Symbol('timer');
