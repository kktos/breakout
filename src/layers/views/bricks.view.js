import BrickEntity from "../../entities/brick.entity.js";
import { ptInRect } from "../../math.js";
import { createBricks } from "../../utils/bricks.util.js";
import { createViewport } from "../../utils/canvas.utils.js";

const BrickTypes= BrickEntity.TYPES.split("");

export class BrickView {

	constructor(ctx, entityList= null, sheet= null) {
		this.gc= ctx.gc;
		this.vars= ctx.vars;
		this.width= ctx.canvas.width;
		this.height= ctx.canvas.height;
		this.ctx= ctx.canvas.getContext('2d');
		this.canvas= ctx.canvas;
		this.isDrawing= false;

		this.vars.set("BrickEntity", BrickEntity);
		
		let bricksDef= sheet;
		let entities= entityList;

		if(!bricksDef && !entities) {
			bricksDef= [
				"##### ####### #####",
				"##### ####### #####",
				"##### ####### #####",
				"##### ####### #####",
				"##### ####### #####",
				"##### ####### #####",
				"##### ####### #####",
				"##### ####### #####",
				"##### ####### #####",
				"##### ####### #####",
				"##### ####### #####",
				"##### ####### #####",
				"##### ####### #####",
				"##### ####### #####",
				"##### ####### #####",
				"##### ####### #####"
			];
		}

		if(!entities)
			entities= [];

		if(bricksDef)
			entities.push(...createBricks(this.gc, {bricksDef, pos: {x:0, y:0}}));

		this.entities= entities;
		this.selectedBrick= "#";
	}

	selectBrickType(typeIdx) {
		this.selectedBrick= BrickTypes[typeIdx];
	}

	drawBrick(x, y, buttons) {
		const target= this.entities.find(entity => ptInRect(x, y, entity));
		if(target) {
			target.setType(buttons===2 ? "#" : this.selectedBrick);
			this.isModified= true;
			// this.updateBrickStats();
		}				
	}

	// https://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript
	line({x:x0, y:y0}, {x:x1, y:y1}, buttons) {
		const dx = Math.abs(x1 - x0);
		const dy = Math.abs(y1 - y0);
		const sx = (x0 < x1) ? 1 : -1;
		const sy = (y0 < y1) ? 1 : -1;
		let err = dx - dy;
	 
		while(true) {
		   this.drawBrick(x0, y0, buttons);
	 
		//    if ((x0 === x1) && (y0 === y1)) break;
		   if (Math.abs(x0 - x1) < 0.0001 && Math.abs(y0 - y1) < 0.0001) break;
		   const e2 = 2*err;
		   if (e2 > -dy) { err -= dy; x0  += sx; }
		   if (e2 < dx) { err += dx; y0  += sy; }
		}
	 }
	 
	handleEvent(gc, e) {
		switch(e.type) {
			case "mousedown": {
				this.isDrawing= true;
				this.firstPoint= {x:e.x, y:e.y};
				this.drawBrick(e.x, e.y, e.buttons);
				break;
			}
			case "mouseup": {
				this.isDrawing= false;
				break;
			}
			case "mousemove": {
				gc.viewport.canvas.style.cursor= "pointer";

				if(!this.isDrawing)
					return;

				if(gc.keys.isPressed("Control"))
					this.line(this.firstPoint, {x:e.x, y:e.y}, e.buttons);
				else
					this.drawBrick(e.x, e.y, e.buttons);
				break;
			}			
		}
	}

	render(gc) {
		const localGc= {...gc};
		localGc.viewport= createViewport(this.canvas);

		this.ctx.clearRect(0, 0, this.width, this.height);

		for (let idx = 0; idx < this.entities.length; idx++)
			this.entities[idx].render(localGc);
		
		// const ctx= gc.viewport.ctx;
		this.ctx.fillStyle="#fff";
		this.ctx.font= "10px";
		this.ctx.fillText(`${gc.scene?gc.scene.breakableCount|0:"-"}/${this.entities.length}`,600-60,600-10);

		// this.ctx.strokeRect(this.bbox.left,this.bbox.top,this.width,this.height);
	}

}