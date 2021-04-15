import Layer from "./layer.js";
import Wall from "../entities/Wall.js";
import ENV from "../env.js";

export default class LayerDashboard extends Layer {
	
	constructor(gameContext, entities) {
		super(gameContext);
		
		this.width= gameContext.screen.canvas.width;
		let wall;

		wall= new Wall("wallTop", 0, ENV.WALL_TOP);
		entities.push(wall);

		wall= new Wall("wallLeft", 0, ENV.WALL_TOP);
		entities.push(wall);

		wall= new Wall("wallRight", 0, ENV.WALL_TOP);
		wall.pos.x= this.width - wall.size.x;
		entities.push(wall);
	}

	render({screen:{ctx}}) {
		ctx.fillStyle= "#000";
		ctx.fillRect(0, 0, this.width, ENV.WALL_TOP);
	}	

}