import Trait from './Trait.js';
export default class FollowPathTrait extends Trait {

	constructor() {
		super();
		this.to= null;
		this.vel= null;
	}

    update(entity, {dt, scene}) {
		if(!this.to || !this.vel)
			return;

		// entity.vel.y+= scene.gravity * entity.mass * dt;
		entity.pos.x+= 0 * dt;
		entity.pos.y+= 50 * dt;
	
        // if((entity.pos.x == this.to.x) && (entity.pos.y == this.to.y)) {
        if(entity.pos.y >= this.to.y) {
			entity.vel.x= this.vel.x;
			entity.vel.y= this.vel.y;
			this.to= this.vel= null;
		}
    }

	whenAt(x, y) {
		this.to= {x, y};
		return this;
	}
	setVel(x, y) {
		this.vel= {x, y};
		return this;
	}
}
