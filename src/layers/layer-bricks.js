import Layer from "./Layer.js";
import Brick from "../entities/Brick.js";
import ENV from '../env.js';

export default class LayerBricks extends Layer {

	constructor(gameContext, entities, bricks) {
		super(gameContext);

		this.entities= entities;

		this.buildBricks(bricks.join(""));
	}

	buildBricks(bricks) {
		let strCursor= 0;
		function getNextBrick() {
			while(bricks.charCodeAt(strCursor)<33)
				strCursor++;
			return bricks[strCursor++];
		}
		
		let col= 0;
		let row= 0;
		const perRow= 15;
		for(let idx= 0; idx<perRow*6; idx++) {
		
			row= ((idx/perRow)|0)*35;
			col= ((idx)%perRow) * 32;
		
			const type= getNextBrick();
			if(type != "-") {
				const brick= new Brick(ENV.BRICK_LEFT + col, ENV.BRICK_TOP + row, type);
				this.entities.push(brick);
			}
		}		
	}

}