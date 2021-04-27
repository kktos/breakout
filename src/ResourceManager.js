import ENV from "./env.js";
import {loadJson} from "./utils/loaders.util.js";
import SpriteSheet from "./Spritesheet.js";
import Audio from "./Audio.js";
import Font from "./Font.js";

function loadSpritesheets(mgr, sheets) {
	return sheets.map(filename => SpriteSheet.load(filename).then(r=>mgr.add("sprite", filename, r)));
}

function loadAudiosheets(mgr, sheets) {
	return sheets.map(filename => Audio.load(filename).then(r=>mgr.add("audio", filename, r)));
}

function loadFonts(mgr, sheets) {
	return sheets.map(filename => Font.load(filename).then(r=>mgr.add("font", r.name, r)));
}

export default class ResourceManager {

	constructor() {
		this.cache= new Map();
	}

	async load() {
		const sheet= await loadJson(ENV.RESOURCES_PATH+"resources.json");

		const jobs= [];
		const kinds= Object.keys(sheet);
		kinds.forEach(kind => {
			switch(kind) {
				case "spritesheets":
					jobs.push(...loadSpritesheets(this, sheet.spritesheets));
					break;
				case "audiosheets":
					jobs.push(...loadAudiosheets(this, sheet.audiosheets));
					break;
				case "fonts":
					jobs.push(...loadFonts(this, sheet.fonts));
					break;
			}
		});
		
		return Promise.all(jobs);
	}

	add(kind, name, rez) {
		const id= (kind+":"+name).replace(/\.json/,'');
		if(this.cache.has(id))
			throw new Error(`Duplicate resource ${id}!`);
		this.cache.set(id, rez);
	}

	get(kind, name= null) {
		const id= name ? kind+":"+name : kind;
		if(!this.cache.has(id))
			throw new Error(`Unable to find resource ${id}!`);

		return this.cache.get(id);
	}

	byKind(kind) {
		const re= new RegExp("^"+kind+":");
		return [...this.cache.keys()].filter(k => k.match(re));
	}

}
