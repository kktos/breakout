
export default class Trait {
	constructor() {
		this.listeners= [];
	}

	on(name, callback, count = Infinity) {
        this.listeners.push({name, callback, count});
		return this;
    }

    finalize(entity) {
        this.listeners= this.listeners.filter(listener => {
			entity.events.process(listener.name, listener.callback);
            return --listener.count;
        });
    }

	collides() {
	}

	update() {
	}
}