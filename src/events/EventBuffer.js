export default class EventBuffer {
    constructor() {
        this.events= [];
    }

    emit(name, ...args) {
        const event= {name, args};
        this.events.push(event);
    }

    process(name, callback) {
        for (let idx = 0; idx < this.events.length; idx++) {
            const event = this.events[idx];
            if(event.name === name || name === "*") {
                callback(...event.args);
            }
        }
    }

    clear() {
        this.events.length= 0;
    }
}
