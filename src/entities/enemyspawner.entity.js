import Entity from "./Entity.js";
import Anim from "../Anim.js";
import SpawnerTrait from "../traits/spawner.trait.js";
import TimerTrait from "../traits/timer.trait.js";
import EnemyEntity from "./enemy.entity.js";
import FollowPathTrait from "../traits/followPath.trait.js";

export default class EnemySpawner extends Entity {

	constructor(resourceMgr, x, y) {
		super(resourceMgr, x, y);

		this.count= 0;
		this.max= 4;

		const spawner= new SpawnerTrait();

		const doors= [[160,50], [384,50]].map(([x,y]) => {
			const door= new Entity(resourceMgr, x, y, "backgrounds");
			door.isSolid= false;
			door.setAnim("enemydoor");
			door.render= function({screen:{ctx}}) {
				this.spritesheet.drawAnim(this.currSprite, ctx, this.pos.x, this.pos.y, this.lifetime);
			};

			return door;
		});
		
		const doorAnim= doors[0].spritesheet.animations.get("enemydoor");
		const open= (anim)=> {
			if(anim.step<0)
				return;

			const enemy= new EnemyEntity(resourceMgr, (this.count%2) ? 160 : 384, 50, "M");
			const followPath= enemy.traits.get(FollowPathTrait);
			followPath
				.whenAt(160, 100)
				.setVel(-30, 20);
			spawner.spawn(enemy);

			anim.backwards();
		};
		doorAnim.events.on(Anim.EVENT_END, open);
		doorAnim.pause();

		spawner.on(TimerTrait.EVENT_TIMER, (id) => {
			if(this.count==this.max)
				return;

			doorAnim.reset();

			this.count++;
		});

		doors.forEach((door) => spawner.spawn(door));

		this.addTrait(new TimerTrait("spawn", 5000));
		this.addTrait(spawner);

	}

}