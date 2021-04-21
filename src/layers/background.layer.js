import BackgroundEntity from "../entities/background.entity.js";
import Layer from "./Layer.js";

export default class BackgroundLayer extends Layer {

	constructor(gc, id= 0) {
		super(gc);

		const view= gc.screen.canvas;

		this.canvas= document.createElement('canvas');
		this.canvas.width= view.width;
		this.canvas.height= view.height;
        const ctx= this.canvas.getContext('2d');
		ctx.imageSmoothingEnabled= false;

		const background= new BackgroundEntity(gc.resourceManager, id);
		const s= background.size;	
		const w= view.width / s.x;
		const h= view.height / s.y;

		this.compose(ctx, background, w, h);
	}

	compose(ctx, background, w, h) {
		for(let col= 0; col<w; col++) {
			for(let row= 0; row<h; row++) {
				background.draw(ctx, col, row);
			}
		}
	}

	render({screen:{ctx}}) {
		const w= this.canvas.width;
		const h= this.canvas.height;
		ctx.drawImage(
			this.canvas,
			0, 0, w, h,
			0, 0, w, h);
	}
}