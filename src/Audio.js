import ENV from "./env.js";
import {loadJson, loadSound} from "./utils/loaders.util.js";

const audioContext= new (window.AudioContext || window.webkitAudioContext)();
unlockAudioContext(audioContext);

function unlockAudioContext(audioCtx) {
	if (audioCtx.state === 'suspended') {
		console.log("!! AudioContext suspended !!");

		const events= ['touchstart', 'touchend', 'mousedown', 'keydown'];
		const unlock= () => {
			events.forEach((event) => document.body.removeEventListener(event, unlock));
			audioCtx.resume();
			console.log("!! AudioContext resumed !!");
		};
		events.forEach((event) => document.body.addEventListener(event, unlock, false));
	}
}

function loadFile(context, sound) {
	return loadSound(sound)
		.then(response => response.arrayBuffer())
		.then(arrayBuffer => {
			return new Promise((resolve, reject) => {
				console.log(`decodeAudioData(${sound})`);
				context.decodeAudioData(arrayBuffer,
					(buffer) => {
						console.log(`decodeAudioData(${sound}) OK`);
						resolve(buffer);
					},
					(e) => {
						console.error(`decodeAudioData(${sound}) ERR:'${e}'`);
						reject(e);
					}
				);
			})
		})
		.catch(err=>console.error(`loadSound(${sound})`,err));
}

function loadSounds(sheet) {
	const audio= new Audio();
	return Promise.all(
			Object.keys(sheet)
				.map(name => loadFile(audio.context, sheet[name].sound)
								.then(buf => audio.add(name, buf))
								.catch(err=>console.error(`loadFile(${sheet[name].sound})`,err))
				)
		).then(()=>audio);
}

export default class Audio {

	static load(filename) {
		return loadJson(ENV.SOUNDS_PATH + filename)
					.then(sheet => loadSounds(sheet))
					.catch(err=>console.error(`Audio.load(${filename})`,err));
	}

	constructor() {
		this.buffers= new Map();
		this.context= audioContext;
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