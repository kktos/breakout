import Scene from "./Scene.js";

export default class GameScene extends Scene {

	constructor(gc, name, sheet) {
		super(gc, name);
		this.killOnExit= false;

		localStorage.setItem("score", 0);
		localStorage.setItem("lives", 3);

		this.levels= sheet.levels;
		this.currentLevel= -1;
	}

	render(gc) {
		this.currentLevel++;
		if(this.currentLevel >= this.levels.length) {
			this.killOnExit= true;
			this.events.emit(Scene.EVENT_COMPLETE, "menu");
		}
		else
			this.events.emit(Scene.EVENT_COMPLETE, this.levels[this.currentLevel]);
	}
}
