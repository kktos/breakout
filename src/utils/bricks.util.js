import ENV from '../env.js';
import BrickEntity from "../entities/brick.entity.js";

const perRow= 15;

export function createBricks({resourceManager}, bricksDef, templateMode= false) {
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
	
	let col= 0;
	let row= 0;
	let idx= -1;
	let type;
	while(type= getNextBrick()) {
	
		idx++;

		if(type == "-") {
			if(templateMode)
				type= "#";
			else
				continue;
		}

		row= ((idx/perRow)|0)*17;
		col= ((idx)%perRow) * 33;
	
		const brick= new BrickEntity(resourceManager, ENV.BRICK_LEFT + col, ENV.BRICK_TOP + row, type);
		entities.push(brick);

	}
	return entities;
}

export function stringifyBricks(entities) {
	const bricks= [];
	let str= "";
	let idx= 0;
	while(idx < entities.length) {
		const entity= entities[idx++];
		str+= entity.type;
		if(!(idx%perRow|0)) {
			bricks.push(str.replaceAll('#', '-'));
			str= "";
		}
	}
	return bricks;

}