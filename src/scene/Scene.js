import EventEmitter from "../events/eventemitter.js";

export default class Scene {
    // static EVENT_COMPLETE = Symbol('scene complete');

	constructor(gc, name) {
		this.gc= gc;
		this.name= name;
        this.events= new EventEmitter();
		this.layers= [];
		this.screenWidth= gc.viewport.width;
		this.screenHeight= gc.viewport.height;
		this.receiver= null;
		this.isRunning= true;
		this.killOnExit= true;
		this.next= null;
	}

	init(gc) {
		for(let idx=0; idx<this.layers.length; idx++)
			this.layers[idx].init?.(gc, this);
	}

	addLayer(layer) {
		this.layers.push(layer);
	}

    update(gc) {}

	render(gc) {
		for(let idx=0; idx<this.layers.length; idx++)
			this.layers[idx].render(gc, this)
	}

	pause() {
		this.isRunning= false;
	}
	run() {
		this.isRunning= true;
		this.gc.scene= this;
	}
	
	handleEvent(gc, e) {
		if(this.receiver)
			this.receiver.handleEvent(gc, e);
	}
}
Scene.EVENT_COMPLETE= Symbol('scene complete');
