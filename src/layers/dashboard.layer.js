import ENV from "../env.js";
import Layer from "./layer.js";
import WallEntity from "../entities/wall.entity.js";
import PlayerTrait from "../traits/player.trait.js";

export default class DashboardLayer extends Layer {
	
	constructor(gameContext, entities, entity) {
		super(gameContext);

		const rezMgr= gameContext.resourceManager;

		this.width= gameContext.screen.canvas.width;
		this.spritesheet= rezMgr.get("sprite", "paddles.json");
        this.playerTrait= entity.traits.get(PlayerTrait);

		const lifeSize= this.spritesheet.spriteSize("life");
		this.lifeY= 600 - lifeSize.y - 5;
		this.lifeW= lifeSize.x+2;
		
		let wall;
		wall= new WallEntity(rezMgr, "wallTop", 0, ENV.WALL_TOP);
		entities.push(wall);

		wall= new WallEntity(rezMgr, "wallLeft", 0, ENV.WALL_TOP);
		entities.push(wall);

		wall= new WallEntity(rezMgr, "wallRight", 0, ENV.WALL_TOP);
		wall.pos.x= this.width - wall.size.x;
		entities.push(wall);
	}

	render({screen:{ctx}}) {
		ctx.fillStyle= "#000";
		ctx.fillRect(0, 0, this.width, ENV.WALL_TOP);

		ctx.fillStyle= "red";
		ctx.fillText(this.playerTrait.score, this.width/2, 20);

		for(let idx= 0; idx<this.playerTrait.lives; idx++)
			this.spritesheet.draw("life", ctx, 20+(idx*this.lifeW), this.lifeY);
	}	

}