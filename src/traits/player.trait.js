import Trait from '../Trait.js';

export default class PlayerTrait extends Trait {

	constructor() {
		super();

        this.name= "UNNAMED";
        this.lives= 3;
        this.score= 0;
	}

    update(entity, {dt}) {
    }
}
