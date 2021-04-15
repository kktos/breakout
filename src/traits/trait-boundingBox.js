import Trait from '../Trait.js';

export default class BoundingBox extends Trait {

	constructor(bbx, bby, bbdx, bbdy) {
		super()
		this.box= {
			x: bbx,
			y: bby, 
			dx: bbdx,
			dy: bbdy
		}
	}

    update(entity) {
		if(entity.pos.x < this.box.x) {
			entity.pos.x= this.box.x;
			entity.vel.x *= -1;
		}
		if(entity.right > this.box.dx) {
			entity.pos.x= this.box.dx - entity.size.x;
			entity.vel.x *= -1;
		}

		if(entity.bottom > this.box.dy || entity.pos.y < this.box.y)
			entity.vel.y *= -1;
    }
}
