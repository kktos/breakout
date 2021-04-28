import Scene from "./Scene.js";
import LocalDB from "../utils/storage.util.js";

export default class GameScene extends Scene {

	constructor(gc, name, sheet) {
		super(gc, name);
		this.killOnExit= false;

		this.currentLevel= 0;
		this.rounds= sheet.rounds;
		this.theme= sheet.theme;

		LocalDB.newPlayer("currentPlayer");
	}

	render(gc) {
		this.currentLevel++;
		if(!LocalDB.currentPlayer().lives || this.currentLevel > this.rounds) {
			this.killOnExit= true;

			if(LocalDB.isPlayerScoreGoodEnough()) {
				this.events.emit(Scene.EVENT_COMPLETE, "input_name");
			}
			else
				this.events.emit(Scene.EVENT_COMPLETE, "menu");
		}
		else {
			LocalDB.updateRound(this.currentLevel);
			this.events.emit(Scene.EVENT_COMPLETE, `./levels/${this.theme}/stage${this.currentLevel}`);
		}
	}
}
