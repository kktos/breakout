import Trait from '../trait.js';
import BallEntity from "../../entities/ball.entity.js";
import SpawnerTrait from "../spawner.trait.js";

export default class DisruptionTrait extends Trait {

	constructor(gc) {
		super();
		this.gc= gc;
	}

	addBalls(entity) {
		const spawner= entity.traits.get(SpawnerTrait);
		for(let idx=0;idx<8;idx++) {
			const ball= new BallEntity(this.gc.resourceManager, entity.pos.x+(80-15*idx), entity.pos.y-10);
			ball.vel.x= 160-40*idx;
			spawner.spawn(ball);
			entity.ballCount++;
		}
	}

}