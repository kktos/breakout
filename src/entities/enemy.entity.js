
import AnimationTrait from "../traits/animation.trait.js";
import BounceTrait from "../traits/bounce.trait.js";
import BoundingBoxTrait from "../traits/boundingBox.trait.js";
import BreakTrait from "../traits/break.trait.js";
import ExplosionTrait from "../traits/explosion.trait.js";
import FollowPathTrait from "../traits/followPath.trait.js";
import GravityTrait from "../traits/gravity.trait.js";
import KillableTrait from "../traits/killable.trait.js";
import VelocityTrait from "../traits/velocity.trait.js";
import Entity from "./Entity.js";

const TYPES= [
	"3cubes",
	"blueCone",
	"greenTriangle",
	"3coloredBalls",
	"3redBalls",
	"3blueBalls",
	"redCube",
	"planets",
	"portal",
	"sphere"
]
export default class EnemyEntity extends Entity {

	constructor(resourceMgr, x, y, type= null) {
		super(resourceMgr, x, y, "enemies");

		this.audio= resourceMgr.get("audio", "paddle");
		this.vel= {x: 0, y: 10};
		this.speed= 0;
		this.mass= 0.05;
		this.isFixed= false;

		this.data= 0;
		this.points= 100;

		const animTrait= new AnimationTrait();
		
		this.setType(type, animTrait);

		this.addTrait(new GravityTrait());
		this.addTrait(new VelocityTrait());
		this.addTrait(new BounceTrait());
		this.addTrait(new ExplosionTrait());
		this.addTrait(new KillableTrait());
		this.addTrait(new BoundingBoxTrait());
		this.addTrait(new FollowPathTrait());
		this.addTrait(new BreakTrait());
		this.addTrait(animTrait);

	}

	setType(type, animTrait) {
		this.type= type!=null ? type : TYPES[Math.random()*TYPES.length|0];
		animTrait.setAnim(this, this.type);
	}

	render({viewport:{ctx}}) {
		this.spritesheet.draw(this.currSprite, ctx, this.pos.x, this.pos.y);
		// this.spritesheet.drawAnim(this.currSprite, ctx, this.pos.x, this.pos.y, this.lifetime);
		// ctx.fillText(`${this.vel.x} ${this.vel.y}`,300,600-20);
	}	
}