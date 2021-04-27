import Scene from "./Scene.js";
import LocalDB from "../utils/storage.util.js";

export default class GameScene extends Scene {

	constructor(gc, name, sheet) {
		super(gc, name);
		this.killOnExit= false;

		if(!Array.isArray(sheet.levels)) {
			this.levels= LocalDB.levels(sheet.levels);
		}
		else
			this.levels= sheet.levels;

		this.currentLevel= -1;

		LocalDB.newPlayer("currentPlayer");
	}

	render(gc) {
		this.currentLevel++;
		if(!LocalDB.currentPlayer().lives || this.currentLevel >= this.levels.length) {
			this.killOnExit= true;
			this.events.emit(Scene.EVENT_COMPLETE, "menu");
		}
		else {
			LocalDB.updateRound(this.currentLevel);
			this.events.emit(Scene.EVENT_COMPLETE, this.levels[this.currentLevel]);
		}
	}
}
