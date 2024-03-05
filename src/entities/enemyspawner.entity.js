import Anim from "../anim.js";
import { getRandom } from "../math.js";
import FollowPathTrait from "../traits/followPath.trait.js";
import KillableTrait from "../traits/killable.trait.js";
import SpawnerTrait from "../traits/spawner.trait.js";
import TimerTrait from "../traits/timer.trait.js";
import Entity from "./Entity.js";
import EnemyEntity from "./enemy.entity.js";

export default class EnemySpawner extends Entity {

	constructor(resourceMgr, x, y) {
		super(resourceMgr, x, y);

		this.count= 0;
		this.max= 4;

		const spawner= new SpawnerTrait();

		spawner.on(KillableTrait.EVENT_KILLED, (entity) => {
			entity.class === "EnemyEntity" && this.count--;
		});

		const onDoorOpen= (anim, x, y)=> {
			if(anim.step<0)
				return;
			const enemy= new EnemyEntity(resourceMgr, x, y);
			const followPath= enemy.traits.get(FollowPathTrait);
			followPath
				.whenAt(x, y+50)
				.setVel(-getRandom(30,60), getRandom(20,60));

			spawner.spawn(enemy);
			anim.backwards();
		};

		const createDoor= (x, y, animName)=> {
			const door= new Entity(resourceMgr, x, y, "backgrounds");
			door.isSolid= false;
			const anim= door.setAnim(animName, { paused: true });
			door.render= function({viewport:{ctx}}) {
				this.spritesheet.drawAnim(this.currSprite, ctx, this.left, this.top, this.lifetime);
			};

			anim.events.on(Anim.EVENT_END, () => onDoorOpen(anim, x, y));

			return { entity:door, anim };
		};

		const doorLeft= createDoor(160, 50, "enemyDoorLeft");
		const doorRight= createDoor(384, 50, "enemyDoorRight");

		spawner.on(TimerTrait.EVENT_TIMER, (id) => {
			if(this.count===this.max)
				return;
			[doorLeft, doorRight].at(this.count%2).anim.reset();
			this.count++;
		});

		spawner.spawn(doorLeft.entity);
		spawner.spawn(doorRight.entity);

		this.addTrait(new TimerTrait("spawn", 5000));
		this.addTrait(spawner);

	}

}