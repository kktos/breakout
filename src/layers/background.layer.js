import Background from "../background.js";
import Layer from "./Layer.js";

export default class BackgroundLayer extends Layer {

	constructor(gameContext, id) {
		super(gameContext);

		const canvas= gameContext.screen.canvas;
		this.background= new Background(id, canvas.width, canvas.height);
		const s= this.background.spriteSize();	
		this.col= canvas.width / s.x;
		this.row= canvas.height / s.y;		
	}

	render({screen:{ctx}}) {
		for(let col= 0; col<this.col; col++) {
			for(let row= 0; row<this.row; row++) {
				this.background.draw(ctx, col, row);
			}
		}		
		this.background.render(ctx);
	}
}