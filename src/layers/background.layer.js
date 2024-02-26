import BackgroundEntity from "../entities/background.entity.js";
import Layer from "./layer.js";

export default class BackgroundLayer extends Layer {

	// static SPRITES= ["normal-0", "normal-1", "normal-2", "normal-3", "normal-4"];
	// static DARK_SPRITES= ["dark-0", "dark-1", "dark-2", "dark-3", "dark-4"];

	constructor(gc, id, withShadows= false) {
		super(gc);
		this.id= id;
		this.type= typeof id === "string" ? "color" : "tile";

		switch(this.type) {
			case "color":
				break;

			case "tile": {
				const view= gc.viewport;
				this.canvas= document.createElement('canvas');
				this.canvas.width= view.width;
				this.canvas.height= view.height;
				this.ctx= this.canvas.getContext('2d');
				this.ctx.imageSmoothingEnabled= false;
				this.setBackground(gc, id, withShadows);
				break;
			}
		}

	}

	init(gc, scene) {
		scene?.events.on(BackgroundLayer.EVENT_UPDATE_BKGND, (id, withShadows) => {
			this.setBackground(gc, id, withShadows);
		});
	}

	setBackground(gc, id, withShadows) {
		const view= gc.viewport;
		const background= new BackgroundEntity(gc.resourceManager, BackgroundLayer.SPRITES[id]);
		const s= background.size;	
		const w= view.width / s.x;
		const h= view.height / s.y;

		this.compose(this.ctx, id, background, w, h, withShadows);
	}

	compose(ctx, id, background, w, h, withShadows) {
		for(let col= 0; col<w; col++) {
			for(let row= 0; row<h; row++) {
				background.draw(ctx, col, row);
			}
		}
		if(withShadows) {
			background.setSprite(BackgroundLayer.DARK_SPRITES[id]);
			for(let col= 0; col<w; col++)
				background.draw(ctx, col, 1.5);
			for(let row= 0; row<h; row++)
				background.draw(ctx, -0.6, row);
		}
	}

	render({viewport:{ctx, width, height}}) {
		switch(this.type) {
			case "color":
				ctx.fillStyle= this.id;
				ctx.fillRect(0,0,width, height)
				break;

			case "tile": {
				const w= this.canvas.width;
				const h= this.canvas.height;
				ctx.drawImage(
					this.canvas,
					0, 0, w, h,
					0, 0, w, h);		
				break;
			}
		}
	}
}

BackgroundLayer.SPRITES= ["normal-0", "normal-1", "normal-2", "normal-3", "normal-4"];
BackgroundLayer.DARK_SPRITES= ["dark-0", "dark-1", "dark-2", "dark-3", "dark-4"];

BackgroundLayer.EVENT_UPDATE_BKGND= Symbol('update background');