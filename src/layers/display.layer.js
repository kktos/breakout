import UILayer from "./UILayer.js";
import Scene from "../scene/Scene.js";
import { ptInRect } from "../math.js";
import LocalDB from "../utils/storage.util.js";
export default class DisplayLayer extends UILayer {

	constructor(gc, layout, ui) {
		super(gc, ui);

		const rezMgr= gc.resourceManager;

		this.width= gc.screen.canvas.width;
		this.font= rezMgr.get("font","font.png");

		this.layout= layout;
		this.time= 0;
		this.blinkFlag= false;

		this.itemSelected= 0;

		const menus= layout.filter(op => op.type=="menu");
		if(menus.length>1)
			throw new Error("Only one menu is allowed per screen");
		
		this.menu= menus.length>0 ? menus[0] : null;

	}

	findMenuByPoint(x,y) {
		return this.menu.items.findIndex(item => {
			if(item.align)
				this.font.align= item.align;
			if(item.size)
				this.font.size= item.size;
			const r= this.font.textRect(item.text, item.pos[0], item.pos[1]);
			const textRect= {left:r[0],top:r[1],right:r[2],bottom:r[3]};
			return ptInRect(x, y, textRect);
		});
	}

	handleEvent(gc, e) {
		switch(e.type) {
			case "click":
				if(this.menu) {
					const menuIdx= this.findMenuByPoint(e.x, e.y);
					if(menuIdx>=0)
						this.goto(gc, menuIdx);
				}
				break;

			case "mousemove":
				if(this.menu) {
					const menuIdx= this.findMenuByPoint(e.x, e.y);
					if(menuIdx>=0)
						this.itemSelected= menuIdx;
					gc.screen.canvas.style.cursor= menuIdx>=0 ? "pointer" : "default";
				}
				break;

			case "keydown":
				switch(e.key) {
					case "ArrowDown":
						if(this.menu)
							this.itemSelected= (this.itemSelected+1) % this.menu.items.length;
						break;
					case "ArrowUp":
						if(this.menu) {
							this.itemSelected--;
							if(this.itemSelected<0)
								this.itemSelected= this.menu.items.length-1;
						}
						break;

					case "Enter":
						this.goto(gc);
						break;
				}
				break;
		}
	}

	goto(gc, idx= null) {
		if(!this.menu)
			return;
		const selected= idx==null ? this.itemSelected : idx;
		gc.scene.events.emit(Scene.EVENT_COMPLETE, String(this.menu.items[selected].scene));
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

	renderMenu(gc, op) {
		op.items.forEach((item, idx)=> {
			this.renderText(gc, {color: idx==this.itemSelected?"red":"white", ...item});
		});
	}

	evalVar(variable, idx) {
		const parts= variable.replace(/\$idx/, idx).split(":");
		switch(parts[0]) {
			case "highscores": {
				const highscores= LocalDB.highscores();
				const row= highscores[parts[1]];
				return row ? row[parts[2]] : null;
			}
		}
		return null;
	}

	renderRepeat(gc, op) {
		const items= op.items.map(it => {
			const item= {...it};
			item.pos= [...it.pos];
			return item;
		});

		for(let idx=0; idx<op.count; idx++) {
			items.forEach(item => {
				if(Array.isArray(item.texts))
					item.text= item.texts[idx];
				if(item.var) {
					item.text= this.evalVar(item.var, idx);
				}
				if(item.text)
					this.renderText(gc, item);
				item.pos[0]+= op.step.pos[0];
				item.pos[1]+= op.step.pos[1];
			});
		}
	}

	render(gc) {
		this.time+= (gc.dt*1000)|0;
		if(!(this.time%500|0))
			this.blinkFlag= !this.blinkFlag;

		this.layout.forEach(op => {
			switch(op.type) {
				case "text":
					this.renderText(gc, op);
					break;
				case "repeat":
					this.renderRepeat(gc, op);
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