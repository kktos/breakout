import EventEmitter from "./events/EventEmitter.js";

export default class Anim {

	static EVENT_END= Symbol("end");

	constructor(name, sheet) {
		this.name= name;
		this.events= new EventEmitter();

		this.loop= sheet.loop || Infinity;
		this.len= sheet.len;
		this.frames= [];
		if(Array.isArray(sheet.frames))
			this.frames.push(...sheet.frames);
		else {
			const framesDef= sheet.frames;
			const [from, to]= framesDef.range;
			for(let idx= from; idx<=to; idx++)
				this.frames.push(framesDef.name+"-"+idx);
		}
		this.loopInitialValue= this.loop;
		this.reset();
	}

	backwards() {
		this.pause();
		this.frameIdx= this.frames.length;
		this.lastHearbeat= null;
		this.loop= this.loopInitialValue;
		this.step= -1;
		return this.play();
	}

	reset() {
		this.frameIdx= -1;
		this.lastHearbeat= null;
		this.loop= this.loopInitialValue;
		this.step= 1;
		return this.play();
	}
	pause() {
		this.isStopped= true;
		return this;
	}
	play() {
		this.isStopped= false;
		return this;
	}

	frame(time) {
		if(this.isStopped || !this.loop)
			return this.frames[this.frameIdx];
	
		const heartbeat= Math.floor(time / this.len) % this.frames.length;
		if(this.lastHearbeat != heartbeat) {
			this.lastHearbeat= heartbeat;
			this.frameIdx+= this.step;
			if(this.step>0) {
				if(this.frameIdx == this.frames.length) {
					this.loop--;
					this.frameIdx= this.loop ? 0 : this.frameIdx-1;
				}		
			} else {
				if(this.frameIdx<0) {
					this.loop--;
					this.frameIdx= this.loop ? this.frames.length-1 : this.frameIdx+1;
				}
			}
		}

		const frame= this.frames[this.frameIdx];
		if(!this.loop)
			this.events.emit(Anim.EVENT_END, this);
		return frame;
	}

}