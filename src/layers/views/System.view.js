
import Scene from "../../scene/Scene.js";
import LocalDB from "../../utils/storage.util.js";

export class System {

	constructor(gc) {
		this.gc= gc;
	}

	goto(sceneName) {
		this.gc.scene.events.emit(Scene.EVENT_COMPLETE, sceneName);
	}
	
	updateHighscores(playerName) {
		if(playerName) {
			LocalDB.updateName(playerName);
			LocalDB.updateHighscores();
		}
	}
	
	concat(str, maxLen) {
		let value= str;
		if(maxLen) {
			if(value.length >= maxLen)
				value= "";
			value += menuItem.text;
			value= value.substr(0, maxLen);
		}
		else
			value+= menuItem.text
		this.vars.set(str, value);
	}
	
}
