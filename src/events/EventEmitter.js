export default class EventEmitter {
	constructor() {
		this._events= {};
	}

	on(name, listener) {
		if(!this._events[name]) {
			this._events[name]= [];
		}

		this._events[name].push(listener);
	}

	off(name, listenerToRemove) {
		if(!this._events[name]) {
			throw new Error(`Can't remove a listener. Event "${name}" doesn't exits.`);
		}

		const filterListeners= (listener) => listener !== listenerToRemove;
		this._events[name]= this._events[name].filter(filterListeners);
	}

	emit(name, ...args) {
		if(!this._events[name]) {
			// throw new Error(`Can't emit an event. Event "${String(name)}" doesn't exits.`);
			return;
		}

		this._events[name].forEach(callback => callback(...args));
	}
}