
import Scene from "../../scene/Scene.js";
import LocalDB from "../../utils/storage.util.js";

export class System {

	constructor({gc, vars, layer}) {
		this.gc= gc;
		this.vars= vars;
		this.layer= layer;
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
		let value= this.vars.get(str);
		const text = this.vars.get("itemSelected").text;
		if(maxLen) {
			if(value.length >= maxLen)
				value= "";
			value += text;
			value= value.substr(0, maxLen);
		}
		else
			value+= text;
		this.vars.set(str, value);

	}
	
}
