import ENV from "./env.js";
import {loadJson, loadSound} from "./utils/loaders.util.js";

function loadFile(context, sound) {
	return loadSound(sound)
		.then(response => response.arrayBuffer())
		.then(arrayBuffer => context.decodeAudioData(arrayBuffer));
}

function loadSounds(sheet) {
	const audio= new Audio();
	return Promise.all(
			Object.keys(sheet)
				.map(name => loadFile(audio.context, sheet[name].sound)
								.then(buf => audio.add(name, buf))
				)
		).then(()=>audio);
}

export default class Audio {

	static load(filename) {
		return loadJson(ENV.SOUNDS_PATH + filename)
					.then(sheet => loadSounds(sheet));
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
		return new Promise(resolve => {
			const source= this.context.createBufferSource();
			source.connect(this.gainNode);
			this.gainNode.connect(this.context.destination);
			source.buffer= this.buffers.get(name);
			source.start(0);
			source.onended= () => resolve(name);
		});
	}

}