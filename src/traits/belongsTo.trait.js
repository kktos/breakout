import Trait from './Trait.js';

export default class BelongsToTrait extends Trait {

	constructor(owner= null) {
		super();
		if(!owner)
			throw new Error("BelongsToTrait needs an owner!");

		this.owner= owner;
	}

	forward(name, callback, count = Infinity) {
        this.owner(name, callback, count);
    }

}
