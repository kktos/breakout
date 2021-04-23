import ENV from "../env.js";
import {loadJson} from "../utils/loaders.util.js";
import LevelScene from "./level.scene.js";
import LayoutScene from "./layout.scene.js";
import EditorScene from "./editor.scene.js";
import DebugScene from "./debug.scene.js";
import GameScene from "./game.scene.js";

export default class SceneFactory {

	static async load(gc, name) {
		const sheet= await loadJson(`${ENV.SCENES_PATH}${name}.json`);

		let scene;

		switch(sheet.type) {
			case "layout":
				scene= new LayoutScene(gc, name, sheet);
				break;
			case "debug":
				scene= new DebugScene(gc, name, sheet);
				break;
			case "editor":
				scene= new EditorScene(gc, name, sheet);
				break;
			case "level":
				scene= new LevelScene(gc, name, sheet);
				break;
			case "game":
				scene= new GameScene(gc, name, sheet);
				break;
			default:
				throw new Error("Uknown Scene type: "+sheet.type);
		}

		// scene.killOnExit= sheet.killOnExit ? true : false;
		document.body.style.cursor= sheet.showCursor ? "default" : "none";
	
		return scene;		
	}

}