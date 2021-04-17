import Trait from './Trait.js';
import KillableTrait from './killable.trait.js';
import BrickEntity from '../entities/brick.entity.js';
import BallEntity from '../entities/ball.entity.js';

export default class PlayerTrait extends Trait {

	constructor() {
		super();

        this.name= "UNNAMED";
        this.lives= 3;
        this.score= 0;

        this.on(KillableTrait.EVENT_KILLED, (entity) => {
            if(entity instanceof BallEntity) {
                this.lives--;
                return;
            }

            if(entity instanceof BrickEntity) {
                this.score+= 50;
                return;
            }

            console.log("killed", entity);
        });
	}

}
