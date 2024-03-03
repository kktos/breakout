import BrickEntity from "../entities/brick.entity.js";
import ENV from '../env.js';

const perRow= ENV.BRICKS_PER_ROW;

export function createBricks({resourceManager}, {pos= {x:ENV.BRICK_LEFT, y:ENV.BRICK_TOP}, bricksDef, isTemplateMode= false}) {
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

	// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
	while(type= getNextBrick()) {
	
		idx++;

		if(type === "-") {
			if(isTemplateMode)
				type= "#";
			else
				continue;
		}

		row= ((idx/perRow)|0) * 17;
		col= (idx % perRow) * 33;
	
		const brick= new BrickEntity(resourceManager, pos.x + col, pos.y + row, type);
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