import {generateID} from "../utils/id.util.js";

export default class Trait {
	constructor() {
		const m= String(this.constructor).match(/class ([a-zA-Z0-9_]+)/);
		this.class= m[1];
		this.id= generateID();

		this.listeners= [];
	}

	on(name, callback, count = Infinity) {

		console.log("Trait.on", name, callback);

        this.listeners.push({name, callback, count});
		return this;
    }

    finalize(entity) {
        this.listeners= this.listeners.filter(listener => {

			console.log("Trait.finalize", entity);

			entity.events.process(listener.name, listener.callback);
            return --listener.count;
        });
    }


	// collides() {}
	// update() {}
}