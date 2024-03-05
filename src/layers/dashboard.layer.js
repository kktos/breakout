import WallEntity from "../entities/wall.entity.js";
import ENV from "../env.js";
import {Align} from "../font.js";
import Level from "../scene/level.scene.js";
import PlayerTrait from "../traits/player.trait.js";
import Layer from "./layer.js";

let flipflop= true;
export default class DashboardLayer extends Layer {
	
	constructor(gc) {
		super(gc);

		const rezMgr= gc.resourceManager;

		this.width= gc.viewport.width;
		this.spritesheet= rezMgr.get("sprite", "paddles");

		const lifeSize= this.spritesheet.spriteSize("life");
		this.lifeY= 600 - lifeSize.y - 5;
		this.lifeW= lifeSize.x+2;

		this.walls= [];
		this.walls.push(
			new WallEntity(rezMgr, "wallTop", 0, ENV.WALL_TOP),
			new WallEntity(rezMgr, "wallLeft", 2, ENV.WALL_TOP),
			new WallEntity(rezMgr, "wallRight", 0, ENV.WALL_TOP)
		);
		this.walls[2].left= this.width - this.walls[2].size.x - 2;

		this.font= rezMgr.get("font", ENV.MAIN_FONT);

		this.timer= 0;
	}

	render({scene:{paddle, state, name},tick,viewport:{ctx}}) {
		ctx.fillStyle= "#000";
		ctx.fillRect(0, 0, this.width, ENV.WALL_TOP);

        const playerTrait= paddle?.traits.get(PlayerTrait);
        const playerInfo= { highscore:playerTrait?.highscore??0, score:playerTrait?.score??0, lives:playerTrait?.lives??3 };

		this.font.size= 3;
		this.font.align= Align.Center;
		this.font.print(ctx, "HIGH SCORE", this.width/2, 1, "red");
		this.font.print(ctx, playerInfo.highscore, this.width/2, 28);

		this.font.align= Align.Left;
		if(!(tick % 28))
			flipflop= !flipflop;
		if(flipflop)
			this.font.print(ctx, "1UP", this.width/8, 1, "red");
		this.font.print(ctx, playerInfo.score, this.width/8, 28);

		for(let idx= 0; idx<this.walls.length; idx++)
			this.walls[idx].draw(ctx);

		for(let idx= 0; idx<playerInfo.lives; idx++)
			this.spritesheet.draw("life", ctx, 20+(idx*this.lifeW), this.lifeY);		

		switch(state) {
			case Level.STATE_STARTING: {
				if(!this.timer)
					this.timer= tick;
				this.font.align= Align.Center;
				this.font.print(ctx, name, this.width/2, 480);
				if(tick - this.timer > 50)
					this.font.print(ctx, "READY", this.width/2, 520);
				break;
			}
			case Level.STATE_ENDING: {
				this.font.align= Align.Center;
				this.font.print(ctx, "GAME OVER", this.width/2, 400);
			}
		}
	}	

}