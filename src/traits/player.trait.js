import Trait from './Trait.js';
import KillableTrait from './killable.trait.js';
import BallEntity from '../entities/ball.entity.js';

export default class PlayerTrait extends Trait {

	static EVENT_PLAYER_KILLED = Symbol('playerKilled');

	constructor(paddle) {
		super();
        
        this.lives= localStorage.getItem("lives")|0;
        this.score= localStorage.getItem("score")|0;
        this.highscore= localStorage.getItem("highscore")|0;

        this.paddle= paddle;

        this.on(KillableTrait.EVENT_KILLED, (entity) => {

            if(entity instanceof BallEntity) {
                this.lives--;
                localStorage.setItem("lives", this.lives);
                this.paddle.emit(PlayerTrait.EVENT_PLAYER_KILLED, this.lives);
                return;
            }

            if(entity.points>0 && entity.points<1) {
                // 50 * stage number (level id)
                this.score+= 1/entity.points;
            } else
                this.score+= entity.points;
            localStorage.setItem("score", this.score);

            if(this.score > this.highscore) {
                this.highscore= this.score
                localStorage.setItem("highscore", this.highscore);
            }

        });
	}

    addLife() {
        this.lives++;
        if(this.lives>6)
            this.lives= 6;
        localStorage.setItem("lives", this.lives);
    }

}

