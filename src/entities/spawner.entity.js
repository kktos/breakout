import Entity from "./Entity.js";
import SpawnerTrait from "../traits/spawner.trait.js";
import TimerTrait from "../traits/timer.trait.js";
import EnemyEntity from "./enemy.entity.js";

export default class Spawner extends Entity {

	constructor(resourceMgr, x, y) {
		super(resourceMgr, x, y);

		this.count= 0;
		this.max= 2;

		const spawner= new SpawnerTrait();
		spawner.on(TimerTrait.EVENT_TIMER, (id) => {
			if(this.count==this.max)
				return;
			const enemy= new EnemyEntity(resourceMgr, 100, 70, "M");
			spawner.spawn(enemy);
			this.count++;
		});

		this.addTrait(new TimerTrait("spawn", 10000));
		this.addTrait(spawner);

	}

}