import Trait from '../Trait.js';
import Events from "../../events/Events.js";
import BounceTrait from '../bounce.trait.js';
import BallEntity from "../../entities/ball.entity.js";

export default class StickyTrait extends Trait {

	constructor() {
		super();

		this.isSticky= false;
		this.gluedTo= null;
		this.isTemporary= false;

		this.on(Events.EVENT_MOUSECLICK, () => {
			this.free();
		});
	}

	get glued() {
		return this.gluedTo != null;
	}

	free() {
		if(!this.gluedTo)
			return;

		this.gluedTo.go();
		this.gluedTo.vel.x= 0;
		this.gluedTo.vel.y= -1*Math.abs(this.gluedTo.vel.y);

		if(this.gluedTo.traits.has(BounceTrait))
			this.gluedTo.traits.get(BounceTrait).isBouncing= true;		

		this.gluedTo= null;

		if(this.isTemporary) {
			this.isSticky= false;
			this.isTemporary= false;
		}
	}

	stickIt(magnet, entity, isTemporary= true) {
		entity.pause();
		this.follow(magnet, entity);
		this.gluedTo= entity;
		this.isSticky= true;
		this.isTemporary= isTemporary;
	}

	follow(magnet, entity) {
		entity.pos.x= magnet.left + (magnet.right - magnet.left)/2 - (entity.right-entity.left)/2;
		entity.pos.y= magnet.pos.y - entity.size.y - 1;
	}

	update(entity) {
		if(this.gluedTo)
			this.follow(entity, this.gluedTo);
    }

	collides(_, side, entity, target) {
		if(!this.isSticky || this.gluedTo || !(target instanceof BallEntity))
			return;

		this.gluedTo= target;
		target.pause();

		if(target.traits.has(BounceTrait))
			target.traits.get(BounceTrait).isBouncing= false;
	}

}
