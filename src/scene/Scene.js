import EventEmitter from "../events/EventEmitter.js";

export default class Scene {
    static EVENT_COMPLETE = Symbol('scene complete');

	constructor(gc, name) {
		this.gc= gc;
		this.name= name;
        this.events= new EventEmitter();
		this.layers= [];
		this.screenWidth= gc.screen.canvas.width;
		this.screenHeight= gc.screen.canvas.height;
		this.receiver= null;
		this.isRunning= true;
		this.killOnExit= true;
		this.next= null;
	}

	init(gc) {}

	addLayer(layer) {
		this.layers.push(layer);
	}

    update(gc) {}

	render(gc) {
		this.layers.forEach(layer => layer.render(gc, this));
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
