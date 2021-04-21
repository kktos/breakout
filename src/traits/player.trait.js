import Trait from './Trait.js';
import KillableTrait from './killable.trait.js';
import BallEntity from '../entities/ball.entity.js';

export default class PlayerTrait extends Trait {

	static EVENT_PLAYER_KILLED = Symbol('playerKilled');

	constructor(paddle) {
		super();
        
        this.name= "UNNAMED";
        this.lives= 3;
        this.score= 0;
        this.highscore= 50000;
        this.paddle= paddle;

        this.on(KillableTrait.EVENT_KILLED, (entity) => {
            // console.log("killed", entity);

            if(entity instanceof BallEntity) {
                this.lives--;
                this.paddle.emit(PlayerTrait.EVENT_PLAYER_KILLED, this.lives);
                return;
            }

            if(entity.points>0 && entity.points<1) {
                // 50 * stage number (level id)
                this.score+= 1/entity.points;
            } else
                this.score+= entity.points;

        });
	}

    addLife() {
        this.lives++;
        if(this.lives>6)
            this.lives= 6;
    }

}

