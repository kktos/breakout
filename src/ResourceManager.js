import ENV from "./env.js";
import {loadJson} from "./loaders.js";
import SpriteSheet from "./Spritesheet.js";
import Audio from "./Audio.js";

function loadSpritesheets(sheets) {
	return sheets.map(filename => SpriteSheet.load(filename));
}

function loadAudiosheets(sheets) {
	return sheets.map(filename => Audio.load(filename));
}

export default class ResourceManager {

	constructor() {
		
	}

	async load() {
		const sheet= await loadJson(ENV.RESOURCE_DIR+"resources.json");

		const jobs= [];
		const kinds= Object.keys(sheet);
		kinds.forEach(kind => {
			switch(kind) {
				case "spritesheets":
					jobs.push(...loadSpritesheets(sheet.spritesheets));
					break;
				case "audiosheets":
					jobs.push(...loadAudiosheets(sheet.audiosheets));
					break;
			}
		});
		
		return Promise.all(jobs);
	}


}
