
import Entity from "./Entity.js";
import KillableTrait from "../traits/killable.trait.js";
import VelocityTrait from "../traits/velocity.trait.js";
import Trait from "../traits/Trait.js";

export default class BulletEntity extends Entity {

	constructor(resourceMgr, x, y) {
		super(resourceMgr, x, y, "paddles");

		this.vel.x= 0;
		this.vel.y= -360;
		this.mass= 2;
		this.ghost= true;
		this.isSolid= false;

		this.setSprite("bullets");
		this.addTrait(new KillableTrait());
		this.addTrait(new VelocityTrait());

		const deathOnTop= new Trait();
		deathOnTop.collides= (gc, side, entity, target) => {
			if(!target.points)
				return;
			if(entity.traits.has(KillableTrait))
				entity.traits.get(KillableTrait).kill();
		}
		deathOnTop.update= (entity, {scene}) => {
			const bbox= scene.bbox;
			if(entity.pos.y < bbox.y) {
				if(entity.traits.has(KillableTrait))
					entity.traits.get(KillableTrait).kill();				
			}
		}
		this.addTrait(deathOnTop);

	}

	render({screen:{ctx}}) {
		this.spritesheet.draw(this.currSprite, ctx, this.pos.x, this.pos.y);
	}	
}