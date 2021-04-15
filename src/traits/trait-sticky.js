import Trait from '../Trait.js';
import Bounce from './trait-bounce.js';

export default class Sticky extends Trait {

	constructor() {
		super();

		this.isSticky= false;
		this.stickyCountdown= Infinity;
		this.gluedTo= null;
		this.offset= {x: 0,y: 0};
		this.vel= {x: 0,y: 0};
	}

	get glued() {
		return this.gluedTo != null;
	}

	free() {
		if(!this.gluedTo)
			return;

		if(this.stickyCountdown>0) {
			this.stickyCountdown--;
			if(!this.stickyCountdown)
				this.isSticky= false;
		}
		this.gluedTo.vel.x= this.vel.x;
		this.gluedTo.vel.y= this.vel.y;

		if(this.gluedTo.traits.has(Bounce))
			this.gluedTo.traits.get(Bounce).isBouncing= true;		

		this.gluedTo= null;
	}

	stickIt(target, entity) {
		target.pos.x= entity.left + (entity.right - entity.left)/2;
		target.pos.y= entity.pos.y - target.size.y;

	}

	update(entity) {
		if(this.gluedTo)
			this.stickIt(this.gluedTo, entity);
    }

	collides(_, side, entity, target) {
		if(!this.isSticky || this.gluedTo)
			return;

		this.gluedTo= target;

		this.vel.x= target.vel.x;
		this.vel.y= target.vel.y;

		target.vel.x= 0;
		target.vel.y= 0;

		if(target.traits.has(Bounce))
			target.traits.get(Bounce).isBouncing= false;
	}

}
