import Layer from "./Layer.js";

export default class DisplayLayer extends Layer {

	constructor(gc, layout) {
		super(gc);

		const rezMgr= gc.resourceManager;

		this.width= gc.screen.canvas.width;
		this.font= rezMgr.get("font","font.png");

		this.layout= layout;
		this.time= 0;
		this.blinkFlag= false;

		this.itemSelected= 0;
		this.upLatch= false;
		this.downLatch= false;

		const menus= layout.filter(op => op.type=="menu");
		if(menus.length>1)
			throw new Error("Only one menu is allowed per screen");
		
		this.menu= menus.length>0 ? menus[0] : null;

	}

	renderText({screen:{ctx}}, op) {
		if(op.blink && this.blinkFlag)
			return;
		if(op.align)
			this.font.align= op.align;
		if(op.size)
			this.font.size= op.size;
		this.font.print(ctx, op.text, op.pos[0], op.pos[1], op.color);
	}

	renderSprite({resourceManager, tick, screen:{ctx}}, op) {
		const [sheet, sprite]= op.sprite.split(":");
		const ss= resourceManager.get("sprite", sheet);
		const zoom= op.zoom || 1;
		const [x, y]= op.pos;
		const [countX, countY]= op.range || [1,1];
		if(countX<=0)
			countX= 1;
		if(countY<=0)
			countY= 1;
		const animName= sprite.split("@");
		if(animName.length>1)
			ss.drawAnim(animName[1], ctx, x, y, tick/100, {zoom});
		else {
			const size= ss.spriteSize(sprite);
			for(let col= 0; col< countX; col++) {
				ss.draw(sprite, ctx, x+col*(size.x*zoom), y, {zoom});
			}
		}
	}

	handleKeyboard(gc, keys) {

		if(this.menu) {
			if(!keys.get("ArrowDown") && this.downLatch)
				this.downLatch= false;
			if(!keys.get("ArrowUp") && this.upLatch)
				this.upLatch= false;
	
			if(keys.get("ArrowDown") && !this.downLatch) {
				this.itemSelected= (this.itemSelected+1) % this.menu.items.length;
				this.downLatch= true;
			}
			if(keys.get("ArrowUp") && !this.upLatch) {
				this.itemSelected--;
				if(this.itemSelected<0)
					this.itemSelected= this.menu.items.length;
				this.upLatch= true;
			}

			if(gc.keys.get("Enter")) {
				gc.coppola.run(this.menu.items[this.itemSelected].scene);
			}
	
		}

	}

	renderMenu(gc, op) {
		op.items.forEach((item, idx)=> {
			this.renderText(gc, {color: idx==this.itemSelected?"red":"white", ...item});
		});
	}

	render(gc) {

		this.time+= (gc.dt*1000)|0;
		if(!(this.time%500|0))
			this.blinkFlag= !this.blinkFlag;

		this.handleKeyboard(gc, gc.keys);	

		// if(gc.keys.get("d")) {
		// 	gc.coppola.run("debug");
		// }
		// if(gc.mouse.down) {
		// 	gc.coppola.run(0);
		// }

		this.layout.forEach(op => {
			switch(op.type) {
				case "text":
					this.renderText(gc, op);
					break;
				case "sprite":
					this.renderSprite(gc, op);
					break;
				case "menu":
					this.renderMenu(gc, op);
					break;
				default:
					throw new Error("Unkown operation "+op.type);
			}
			
		});

	}
}