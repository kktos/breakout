import ENV from '../env.js';
import BrickEntity from "../entities/brick.entity.js";

export default function createBricks({resourceManager}, bricksDef) {
	const entities= [];
	const bricks= bricksDef.join("");

	let strCursor= 0;
	function getNextBrick() {
		if(strCursor>=bricks.length)
			return 0;
		while(bricks.charCodeAt(strCursor)<33)
			strCursor++;
		return bricks[strCursor++];
	}
	
	const perRow= 15;
	let col= 0;
	let row= 0;
	let idx= -1;
	let type;
	while(type= getNextBrick()) {
	
		idx++;

		if(type == "-")
			continue;

		row= ((idx/perRow)|0)*17;
		col= ((idx)%perRow) * 33;
	
		const brick= new BrickEntity(resourceManager, ENV.BRICK_LEFT + col, ENV.BRICK_TOP + row, type);
		entities.push(brick);

	}
	return entities;
}