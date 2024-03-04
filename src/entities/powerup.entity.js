
import AnimationTrait from "../traits/animation.trait.js";
import BoundingBoxTrait from "../traits/boundingBox.trait.js";
import GravityTrait from "../traits/gravity.trait.js";
import KillableTrait from "../traits/killable.trait.js";
import VelocityTrait from "../traits/velocity.trait.js";
import Entity from "./Entity.js";

// src: https://strategywiki.org/wiki/Arkanoid/Getting_Started
// src: https://strategywiki.org/wiki/Arkanoid:_Revenge_of_Doh/Getting_Started
/*
- Laser
Collect the red capsule to transform the Vaus into its Laser-firing configuration. In this form, you can fire lasers at the top of the viewport by pushing the fire button. Lasers can be used against every brick except Gold bricks, and against enemies. Silver bricks can only be destroyed by lasers when they are hit the required number of times.
- Enlarge
Collect the blue capsule to extend the width of the Vaus.
- Slow
Collect the orange capsule to slow the velocity at which the ball moves. Collecting multiple orange capsules will have a cumulative effect and the ball velocity can become extremely slow. However, the ball velocity will gradually increase as it bounces and destroys bricks. The velocity may sometimes suddenly increase with little warning.
- Catch
Collect the green capsule to gain the catch ability. When the ball hits the Vaus, it will stick to the surface. Press the Fire button to release the ball. The ball will automatically release after a certain period of time has passed.
- Break
Collect the violet capsule to create a "break out" exit on the right side of the stage.
Passing through this exit will cause you to advance to the next stage immediately, as well as earn a 10,000 point bonus.
- Disruption
Collect the cyan capsule to cause the ball to split into three instances of itself. All three balls can be kept aloft. There is no penalty for losing the first two balls. No colored capsules will fall as long as there is more than one ball in play. This is the only power up that, while in effect, prevents other power ups from falling.
- Twin
Collect the navy blue capsule to split the Vaus in to two pieces that move side by side. Both Vaus can return the ball to the top of the viewport. However, there is a small gap between the Vaus that you must be careful not to let the ball slip through.
- New Disruption
Collect the white capsule to cause the ball to split into three continuously regenerating instances of itself. When a ball is lost, one of the remaining balls will split apart so that there's always three balls on the viewport. Collecting any other capsule will cause the balls to stop splitting.
- Player
Collect the gray capsule to earn an extra Vaus.
- Reduce
Collecting the small black capsule causes the Vaus to shrink in size. All points scored are doubled. The Vaus will return to its regular size as soon as any other capsule is collected.
- Illusion
Collect the dark green capsule to activate the Vaus Illusion mode. As the Vaus moves back and forth across the bottom of the viewport, it leaves ghost trails behind it. The trails are capable of returning the ball, but simply bounce the ball rather than allowing the trajectory to be changed. The faster the Vaus moves, the farther the trails extend.
- Mega
Collect the purple capsule to transform the ball into a red Mega-ball which is capable of crashing through bricks without rebounding until it hits one of the three surrounding walls. Collecting any other capsule will return the ball to its original status.
*/
// const TYPES= "LESCBDTNPRIM";
// const TYPES= "LESCBDPM";
const TYPES= "D";
const TYPE_ANIMS= {
	L: "laser",
	E: "enlarge",
	C: "catch",
	S: "slow",
	B: "break",
	D: "disruption",
	P: "player",
	M: "mega"
};

export default class PowerupEntity extends Entity {

	constructor(resourceMgr, x, y) {
		super(resourceMgr, x, y, "powerups");

		this.mass= 2;
		this.ghost= true;
		this.isSolid= false;
		this.isFixed= false;

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

	render({viewport:{ctx}}) {
		this.spritesheet.draw(this.currSprite, ctx, this.pos.x, this.pos.y);
	}	
}