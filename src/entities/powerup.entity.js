
import Entity from "./Entity.js";
import AnimationTrait from "../traits/animation.trait.js";
import GravityTrait from "../traits/gravity.trait.js";
import VelocityTrait from "../traits/velocity.trait.js";
import BoundingBoxTrait from "../traits/boundingBox.trait.js";
import KillableTrait from "../traits/killable.trait.js";

// src; https://strategywiki.org/wiki/Arkanoid/Getting_Started
/*
Laser	Collect the red capsule to transform the Vaus into its Laser-firing configuration. In this form, you can fire lasers at the top of the screen by pushing the fire button. Lasers can be used against every brick except Gold bricks, and against enemies. Silver bricks can only be destroyed by lasers when they are hit the required number of times.
Enlarge	Collect the blue capsule to extend the width of the Vaus.
Slow	Collect the orange capsule to slow the velocity at which the ball moves. Collecting multiple orange capsules will have a cumulative effect and the ball velocity can become extremely slow. However, the ball velocity will gradually increase as it bounces and destroys bricks. The velocity may sometimes suddenly increase with little warning.
Catch	Collect the green capsule to gain the catch ability. When the ball hits the Vaus, it will stick to the surface. Press the Fire button to release the ball. The ball will automatically release after a certain period of time has passed.
Break	Collect the violet capsule to create a "break out" exit on the right side of the stage. Passing through this exit will cause you to advance to the next stage immediately, as well as earn a 10,000 point bonus.
Disruption	Collect the cyan capsule to cause the ball to split into three instances of itself. All three balls can be kept aloft. There is no penalty for losing the first two balls. No colored capsules will fall as long as there is more than one ball in play. This is the only power up that, while in effect, prevents other power ups from falling.
T
N
Player	Collect the gray capsule to earn an extra Vaus.
R
I
M
*/
// const TYPES= "LESCBDTNPRIM";
const TYPES= "LESCBDPM";
const TYPE_ANIMS= {
	L: "laser",
	E: "enlarge",
	C: "catch",
	S: "slow",
	B: "break",
	D: "disruption",
	P: "player",
	M: "magnet"
};

export default class PowerupEntity extends Entity {

	constructor(resourceMgr, x, y) {
		super(resourceMgr, x, y, "powerups");

		this.mass= 2;
		this.ghost= true;
		this.isSolid= false;

		this.animTrait= new AnimationTrait();
		this.addTrait(this.animTrait);
		this.addTrait(new GravityTrait());
		this.addTrait(new VelocityTrait());
		this.addTrait(new KillableTrait());
		this.addTrait(new BoundingBoxTrait());

		this.setType();
	}

	setType() {
		this.type= TYPES[ Math.random()*TYPES.length|0 ];	
		this.animTrait.setAnim(this, TYPE_ANIMS[this.type]);
	}

	render({screen:{ctx}}) {
		this.spritesheet.draw(this.currSprite, ctx, this.pos.x, this.pos.y);
	}	
}