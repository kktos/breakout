import ENV from "../env.js";
import Layer from "./layer.js";
import WallEntity from "../entities/wall.entity.js";
import PlayerTrait from "../traits/player.trait.js";
import {Align} from "../Font.js";

let flipflop= true;
export default class DashboardLayer extends Layer {
	
	constructor(gc, paddle= null) {
		super(gc);

		const rezMgr= gc.resourceManager;

		this.width= gc.screen.canvas.width;
		this.spritesheet= rezMgr.get("sprite", "paddles");
        this.playerTrait= paddle ? paddle.traits.get(PlayerTrait) : {highscore:0,score:0,lives:3};

		const lifeSize= this.spritesheet.spriteSize("life");
		this.lifeY= 600 - lifeSize.y - 5;
		this.lifeW= lifeSize.x+2;

		this.walls= [];
		this.walls.push(
			new WallEntity(rezMgr, "wallTop", 0, ENV.WALL_TOP),
			new WallEntity(rezMgr, "wallLeft", 0, ENV.WALL_TOP),
			new WallEntity(rezMgr, "wallRight", 0, ENV.WALL_TOP)
		);
		this.walls[2].pos.x= this.width - this.walls[2].size.x;

		this.font= rezMgr.get("font","font.png");
	}

	render({tick,screen:{ctx}}) {
		ctx.fillStyle= "#000";
		ctx.fillRect(0, 0, this.width, ENV.WALL_TOP);

		this.font.size= 3;
		this.font.align= Align.Center;
		this.font.print(ctx, "HIGH SCORE", this.width/2, 1, "red");
		this.font.print(ctx, this.playerTrait.highscore, this.width/2, 28);

		this.font.align= Align.Left;
		// if(!(tick%50))
		// 	flipflop= !flipflop;
		if(flipflop)
			this.font.print(ctx, "1UP", this.width/8, 1, "red");
		this.font.print(ctx, this.playerTrait.score, this.width/8, 28);

		for(let idx= 0; idx<this.walls.length; idx++)
			this.walls[idx].draw(ctx);

		for(let idx= 0; idx<this.playerTrait.lives; idx++)
			this.spritesheet.draw("life", ctx, 20+(idx*this.lifeW), this.lifeY);
	}	

}