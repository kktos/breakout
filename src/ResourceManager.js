import SpriteSheet from "./Spritesheet.js";
import Audio from "./audio.js";
import Font from "./font.js";
import {loadJson} from "./utils/loaders.util.js";

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
		let resource;
		for (const [kind, value] of Object.entries(sheet)) {
			switch(kind) {
				case "spritesheets":
					resource= loadSpritesheets(this, value);
					break;
				case "audiosheets":
					resource= loadAudiosheets(this, value);
					break;
				case "fonts":
					resource= loadFonts(this, value);
					break;
			}
			jobs.push(...resource);
		}
		
		return Promise.all(jobs);
	}

	add(kind, name, rez) {
		const id= (`${kind}:${name}`).replace(/\.json/,'');
		if(this.cache.has(id))
			throw new Error(`Duplicate resource ${id}!`);
		console.log(`ResourceManager.add(${id})`);
		this.cache.set(id, rez);
	}

	get(kind, name= null) {
		const id= name ? `${kind}:${name}` : kind;
		if(!this.cache.has(id))
			throw new Error(`Unable to find resource ${id}!`);

		return this.cache.get(id);
	}

	byKind(kind) {
		const re= new RegExp(`^${kind}:`);
		return [...this.cache.keys()].filter(k => k.match(re));
	}

}
