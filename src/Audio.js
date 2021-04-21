import ENV from "./env.js";
import {loadJson} from "./utils/loaders.util.js";

function loadSound(context, sound) {
	return fetch(ENV.SOUNDS_DIR + sound)
		.then(response => response.arrayBuffer())
		.then(arrayBuffer => context.decodeAudioData(arrayBuffer));
}

function loadSounds(filename, sheet) {
	const audio= new Audio();
	return Promise.all(
			Object.keys(sheet)
				.map(name => loadSound(audio.context, sheet[name].sound)
								.then(buf => audio.add(name, buf))
				)
		).then(()=>audio);
}

export default class Audio {

	static load(filename) {
		return loadJson(ENV.SOUNDS_DIR + filename)
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