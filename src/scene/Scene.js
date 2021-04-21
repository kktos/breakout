import ENV from "../env.js";
import EventEmitter from "../events/EventEmitter.js";
import {loadJson} from "../utils/loaders.util.js";
import BackgroundLayer from "../layers/background.layer.js";
import DebuggerLayer from "../layers/debugger.layer.js";
import DisplayLayer from "../layers/display.layer.js";
import DashboardLayer from "../layers/dashboard.layer.js";
import EntitiesLayer from "../layers/entities.layer.js";
import EditorLayer from "../layers/editor.layer.js";
import Level from "../Level.js";

export default class Scene {
    static EVENT_COMPLETE = Symbol('scene complete');

	constructor(gc, name) {
		this.name= name;
        this.events= new EventEmitter();
		this.layers= [];
		this.screenWidth= gc.screen.canvas.width;
		this.screenHeight= gc.screen.canvas.height;
		this.receiver= null;
		this.isRunning= true;
		this.killOnExit= false;
		this.next= null;
	}

	init(gc) {}

	addLayer(layer) {
		this.layers.push(layer);
	}

    update(gc) {}

	render(gc) {
		this.layers.forEach(layer => layer.render(gc));
	}

	pause() {
		this.isRunning= false;
	}
	run() {
		this.isRunning= true;
	}
	
	handleEvent(gc, e) {
		if(this.receiver)
			this.receiver.handleEvent(gc, e);
	}
}

Scene.load= async function(gc, name) {
	const sheet= await loadJson(`${ENV.SCENES_PATH}${name}.json`);

	const scene= sheet.bricks ? new Level(gc, name) : new Scene(gc, name);

	scene.killOnExit= sheet.killOnExit ? true : false;

	const bkgndLayer= new BackgroundLayer(gc, sheet.background);
	scene.addLayer(bkgndLayer);

	if(sheet.debug)
		scene.addLayer(new DebuggerLayer(gc));

	if(sheet.layout)
		scene.addLayer(new DisplayLayer(gc, sheet.layout));

	if(sheet.editor) {
		const entities= [];
		scene.addLayer(new EntitiesLayer(gc, entities));
		scene.addLayer(new DashboardLayer(gc));
		scene.receiver= new EditorLayer(gc, entities, sheet.template, bkgndLayer);
		scene.addLayer(scene.receiver);
	}

	if(sheet.bricks) {
		scene.addLayer(new EntitiesLayer(gc, scene.entities, sheet.bricks));
		scene.addLayer(new DashboardLayer(gc, scene.paddle));	
	}

	return scene;
}