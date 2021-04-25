import Scene from "./Scene.js";
import LocalDB from "../utils/storage.util.js";

export default class GameScene extends Scene {

	constructor(gc, name, sheet) {
		super(gc, name);
		this.killOnExit= false;

		localStorage.setItem("score", 0);
		localStorage.setItem("lives", 3);

		if(!Array.isArray(sheet.levels)) {
			this.levels= LocalDB.levels(sheet.levels);
		}
		else
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
