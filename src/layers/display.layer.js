import UILayer from "./UILayer.js";
import Scene from "../scene/Scene.js";
import { ptInRect } from "../math.js";
import LocalDB from "../utils/storage.util.js";
import ENV from "../env.js";
import {clone} from "../utils/object.util.js";

export default class DisplayLayer extends UILayer {

	constructor(gc, layout, ui) {
		super(gc, ui);

		const rezMgr= gc.resourceManager;
		this.paddleSprites= rezMgr.get("sprite", "paddles");

		this.width= gc.screen.canvas.width;
		this.font= rezMgr.get("font", ENV.MAIN_FONT);

		this.layout= layout;
		this.time= 0;
		this.blinkFlag= false;
		this.isMouseEnabled= true;

		this.itemSelected= 0;

		this.initVars();

		const menus= layout.filter(op => op.type=="menu");
		if(menus.length>1)
			throw new Error("Only one menu is allowed per screen");
		
		this.menu= menus.length>0 ? menus[0] : null;

		this.prepareRendering();
	}

	initVars() {
		this.vars= new Map();
		this.vars.set("highscores", LocalDB.highscores());
		this.vars.set("player", LocalDB.currentPlayer());
	}

	prepareMenu(op) {
		const menuItems= [];
		for(let idx= 0; idx<op.items.length; idx++) {
			const item= op.items[idx];
			switch(item.type) {
				default:
				case "text":
					menuItems.push(item);
					break;
				case "repeat":
					this.repeat(item, (menuitem)=>menuItems.push(menuitem));
					break;
			}
		}
		op.items= menuItems;
	}

	repeat(op, callback) {
		for(let idx=0; idx<op.count; idx++) {
			if(op.var)
				this.vars.set(op.var, idx);
			op.items.forEach(itemSource => {
				const item= clone(itemSource);
				if(Array.isArray(item.texts)) {
					item.text= item.texts[idx];
					delete item.texts;
				}
				item.pos[0]+= idx*op.step.pos[0];
				item.pos[1]+= idx*op.step.pos[1];
				callback(item);
			});
		}
	}

	prepareRendering() {
		for(let idx= this.layout.length-1; idx>=0; idx--) {
			const op= this.layout[idx];
			switch(op.type) {
				case "repeat":
					this.repeat(op, (item)=> {
						this.layout.push(item);
						if(item.text)
							item.text= this.eval(item.text);
					});
					this.layout.splice(idx, 1);
					break;
				case "menu":
					this.prepareMenu(op);
					break;
			}
		}
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
				if(this.isMouseEnabled && this.menu) {
					const menuIdx= this.findMenuByPoint(e.x, e.y);
					if(menuIdx>=0)
						this.exec(gc, menuIdx);
				}
				break;

			case "mousemove":
				if(this.isMouseEnabled && this.menu) {
					const menuIdx= this.findMenuByPoint(e.x, e.y);
					if(menuIdx>=0)
						this.itemSelected= menuIdx;
					gc.screen.canvas.style.cursor= menuIdx>=0 ? "pointer" : "default";
				}
				break;

			case "keydown":
				switch(e.key) {
					case "ArrowDown":
					case "ArrowRight":
						if(this.menu)
							this.itemSelected= (this.itemSelected+1) % this.menu.items.length;
						break;
					case "ArrowUp":
					case "ArrowLeft":
						if(this.menu) {
							this.itemSelected--;
							if(this.itemSelected<0)
								this.itemSelected= this.menu.items.length-1;
						}
						break;
					case "Enter":
						this.exec(gc);
						break;
				}
				break;
		}
	}

	exec(gc, idx= null) {
		if(!this.menu)
			return;
		const selected= idx==null ? this.itemSelected : idx;
		const menuItem= this.menu.items[selected];

		if(menuItem.action) {
			const [action, ...parms]= menuItem.action.split(":");
			switch(action) {
				case "updateHighscores": {
					let name= this.vars.has(parms[0]) ? this.vars.get(parms[0]) : null;
					if(name) {
						LocalDB.updateName(name);
						LocalDB.updateHighscores();
					}
					break;
				}
				case "concat": {
					let value= this.vars.has(parms[0]) ? this.vars.get(parms[0]) : "";
					if(parms[1]) {
						if(value.length>=parms[1])
							value= "";
						value += menuItem.text;
						value= value.substr(0, parms[1]);
					}
					else
						value+= menuItem.text
					this.vars.set(parms[0], value);
					break;
				}
				default:
					console.error("unknown action !", menuItem);
			}
		}

		if(menuItem.scene) {
			gc.scene.events.emit(Scene.EVENT_COMPLETE, String(menuItem.scene));
			return;
		}

	}

	eval(text) {
		return text.replace(/%(.+?)%/, (m, varname) => {
			const [name, ...parms]= varname.split(".");
			if(!this.vars.has(name))
				return "";

			let value= this.vars.get(name);
			if(value == undefined)
				return "";

			if(parms.length) {
				if(parms[0].match(/^\$/))
					parms[0]= this.vars.get(parms[0].substr(1));
				value= value[parms[0]];
				if(value == undefined)
					return "";
				if(parms.length>1)
					value= value[parms[1]];
			}
			return value != undefined ? value : "";
		});
	}

	renderText({screen:{ctx}}, op) {
		if(op.blink && this.blinkFlag)
			return;
		if(op.align)
			this.font.align= op.align;
		if(op.size)
			this.font.size= op.size;
		const text= this.eval(op.text);
		return this.font.print(ctx, text==""? " ": text, op.pos[0], op.pos[1], op.color);
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

	renderMenuText(gc, item, idx) {
		const textRect= this.renderText(gc, {
			color: idx==this.itemSelected?ENV.COLORS.DEFAULT_TEXT:ENV.COLORS.SELECTED_TEXT,
			...item
		});
		if(idx==this.itemSelected) {
			const ctx= gc.screen.ctx;
			ctx.strokeStyle= ENV.COLORS.SELECT_RECT;
			ctx.beginPath();
			ctx.moveTo(textRect[0]-2, textRect[1]-5);
			ctx.lineTo(textRect[2]+4, textRect[1]-5);
			ctx.moveTo(textRect[0]-2, textRect[3]+2);
			ctx.lineTo(textRect[2]+4, textRect[3]+2);
			ctx.stroke();
			this.paddleSprites.drawAnim("selectionL", ctx, textRect[0]-25, textRect[1]-2, gc.tick/100);
			this.paddleSprites.drawAnim("selectionR", ctx, textRect[2]+4, textRect[1]-2, gc.tick/100);
		}
	}

	renderMenu(gc, op) {
		for(let idx= 0; idx<op.items.length; idx++)
			this.renderMenuText(gc, op.items[idx], idx);
	}

	render(gc) {
		this.time+= (gc.dt*1000)|0;
		if(!(this.time%500|0))
			this.blinkFlag= !this.blinkFlag;

		for(let idx= 0; idx<this.layout.length; idx++) {
			const op= this.layout[idx];
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
		}

	}
}