import {loadJson} from "./utils/loaders.util.js";
import SpriteSheet from "./spritesheet.js";
import Audio from "./audio.js";
import Font from "./font.js";

function loadSpritesheets(mgr, sheets) {
	return sheets.map(filename => SpriteSheet.load(filename)
									.catch(err => console.error(`SpriteSheet.load ${filename}`, err))
									.then(r => mgr.add("sprite", filename, r)
					));
}

function loadAudiosheets(mgr, sheets) {
	return sheets.map(filename => Audio.load(filename)
									.catch(err => console.error(`Audio.load ${filename}`, err))
									.then(r=>mgr.add("audio", filename, r)
					));
}

function loadFonts(mgr, sheets) {
	return sheets.map(filename => Font.load(filename)
									.catch(err => console.error(`Font.load ${filename}`, err))
									.then(r=>mgr.add("font", r.name, r)
					));
}

export default class ResourceManager {

	constructor() {
		this.cache= new Map();
	}

	async load() {
		const sheet= await loadJson("resources.json");

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
		console.log(`ResourceManager.add(${id})`);
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
