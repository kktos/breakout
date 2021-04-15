import ENV from "./env.js";
import {loadJson} from "./loaders.js";

function loadSound(context, sound) {
	return fetch(ENV.AUDIO_DIR + sound)
		.then(response => response.arrayBuffer())
		.then(arrayBuffer => context.decodeAudioData(arrayBuffer));
}

function loadSounds(filename, sheet) {
	const audio= new Audio();
	Audio.cache.set(filename, audio);
	return Promise.all(
			Object.keys(sheet)
				.map(name => loadSound(audio.context, sheet[name].sound)
								.then(buf => audio.add(name, buf))
				)
		);
}

export default class Audio {

	static cache= new Map();
	static retrieve(name) {
		return Audio.cache.has(name) ? 
				Audio.cache.get(name)
				:
				null;
	}
	static load(filename) {
		if(Audio.cache.has(filename))
			throw new Error(`Audiosheet ${filename} was already loaded !`);

		return loadJson(ENV.AUDIO_DIR + filename)
					.then(sheet => loadSounds(filename, sheet));
	}

	constructor() {
		this.buffers= new Map();
		this.context= new AudioContext();
		this.gainNode= this.context.createGain();
		this.gainNode.gain.value= Math.pow(ENV.VOLUME / 100, 2);
	}

	add(name, buffer) {
		this.buffers.set(name, buffer);
	}

	play(name) {
        const source= this.context.createBufferSource();
        source.connect(this.gainNode);
        this.gainNode.connect(this.context.destination);
        source.buffer= this.buffers.get(name);
        source.start(0);
	}

}