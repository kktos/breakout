import Scene from "./Scene.js";
import LocalDB from "../utils/storage.util.js";
import EnterNameUI from "../ui/enterName.ui.js";

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
		this.username= null;

		EnterNameUI.ask((name) => {
			this.username= name;
			LocalDB.newPlayer(name);
		});
	}

	render(gc) {
		if(!this.username)
			return;
		this.currentLevel++;
		if(this.currentLevel >= this.levels.length) {
			this.killOnExit= true;
			this.events.emit(Scene.EVENT_COMPLETE, "menu");
		}
		else
			this.events.emit(Scene.EVENT_COMPLETE, this.levels[this.currentLevel]);
	}
}
