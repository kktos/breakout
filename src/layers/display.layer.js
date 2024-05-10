import ENV from "../env.js";
import { growRect, ptInRect } from "../math.js";
import {clone} from "../utils/object.util.js";
import LocalDB from "../utils/storage.util.js";
import UILayer from "./UILayer.js";
import { SYSTEM, initViews, views } from "./views/views.js";

const loadSprite= ({resourceManager}, name) => {
	const [sheet, sprite]= name.split(":");
	const ss= resourceManager.get("sprite", sheet);
	return { ss,sprite };
}

export default class DisplayLayer extends UILayer {

	constructor(gc, sheet) {
		super(gc, sheet.ui);

		const rezMgr= gc.resourceManager;
		this.font= rezMgr.get("font", sheet.font ?? ENV.MAIN_FONT);

		this.layout= sheet.layout;
		this.time= 0;
		this.blinkFlag= false;
		this.isMouseEnabled= true;
		this.wannaDisplayHitzones= false;
		this.lastJoyTime= 0;

		this.itemSelected= 0;

		this.initVars();

		const menus= this.layout.filter(op => op.type==="menu");
		if(menus.length>1)
			throw new Error("Only one menu is allowed per viewport");
		
		this.menu= menus.length>0 ? menus[0] : null;

		this.views= this.layout.filter(op => op.type==="view");
		initViews({gc, vars: this.vars, layer: this});

		this.prepareRendering(gc);

	}

	destroy() {
		for(let idx= 0; idx<this.views.length; idx++) {
			const view= this.views[idx];
			view.component.destroy();
		}
	}

	initVars() {
		this.vars= new Map();
		this.vars.set("highscores", LocalDB.highscores());
		this.vars.set("player", LocalDB.currentPlayer());
		this.vars.set("itemIdxSelected", this.itemSelected);
		this.vars.set("itemSelected", "");
	}

	selectMenuItem(idx) {
		this.itemSelected= (idx<0 ? this.menu.items.length-1 : idx) % this.menu.items.length;
		this.vars.set("itemIdxSelected", this.itemSelected);
		this.vars.set("itemSelected", this.menu?.items[this.itemSelected]);
	}

	prepareMenu(gc, op) {
		const menuItems= [];
		for(let idx= 0; idx<op.items.length; idx++) {
			const item= op.items[idx];
			switch(item.type) {
				case "repeat":
					this.repeat(item, (menuitem)=> menuItems.push(menuitem));
					break;
				// case "text":
				default:
					menuItems.push(item);
					break;
			}
		}

		const computeBBox= (items, isGroup= false) => {
			let bbox= null;
			for(let idx= 0; idx<items.length; idx++) {
				const item= items[idx];
				switch(item.type) {
					case "text": {
						if(item.align)
							this.font.align= item.align;
						if(item.size)
							this.font.size= item.size;
						const r= this.font.textRect(item.text, item.pos[0], item.pos[1]);
						item.bbox= {left:r[0], top:r[1], right:r[2], bottom:r[3]};
						break;
					}
					case "sprite": {
						const {ss, sprite}= loadSprite(gc, item.sprite);
						const size= ss.spriteSize(sprite);
						item.bbox= {left:item.pos[0], top:item.pos[1], right:item.pos[0]+size.x, bottom:+item.pos[1]+size.y};
						break;
					}
					case "group": {
						item.bbox= computeBBox(item.items, true);
						break;
					}
				}
				if(isGroup) {
					if(bbox === null) {
						bbox = {...item.bbox};
						continue;
					}
					if(item.bbox.left < bbox.left) {
						bbox.left= item.bbox.left;
					}
					if(item.bbox.top < bbox.top) {
						bbox.top= item.bbox.top;
					}
					if(item.bbox.right > bbox.right) {
						bbox.right= item.bbox.right;
					}
					if(item.bbox.bottom > bbox.bottom) {
						bbox.bottom= item.bbox.bottom;
					}
				}
			}
			return bbox;
		}

		computeBBox(menuItems);

		op.items= menuItems;

		op.selectionSprites= null;
		if(op.selection) {
			op.selectionSprites= {};
			if(op.selection.left) {
				op.selectionSprites.left= loadSprite(gc, op.selection.left);
			}
			if(op.selection.right) {
				op.selectionSprites.right= loadSprite(gc, op.selection.right);
			}
		}
	}

	repeat(op, callback) {

		const interpolate= (item) => {
			switch(item.type) {
				case "sprite":
					item.sprite= this.eval(item.sprite);
					break;
				case "text":
					item.text= this.eval(item.text);
					break;
			}			
		};

		for(let idx=0; idx<op.count; idx++) {
			if(op.var) {
				this.vars.set(op.var, idx);
			}

			for(let itemIdx=0; itemIdx<op.items.length; itemIdx++) {
				const item= clone(op.items[itemIdx]);

				if(item.type === "group") {
					for (let groupIdx = 0; groupIdx < item.items.length; groupIdx++) {
						const groupItem= item.items[groupIdx];
						interpolate(groupItem);
						groupItem.pos[0]+= idx*op.step.pos[0];
						groupItem.pos[1]+= idx*op.step.pos[1];
					}
				} else {
					interpolate(item);
					item.pos[0]+= idx*op.step.pos[0];
					item.pos[1]+= idx*op.step.pos[1];
				}

				callback(item);

			}
		}
	}

	repeatFor(op, callback) {
		for(let idx=0; idx<op.count; idx++) {
			if(op.var) {
				this.vars.set(op.var, idx);
			}

			for(let itemIdx=0; itemIdx<op.items.length; itemIdx++) {
				const item= clone(op.items[itemIdx]);
				item.pos[0]+= idx*op.step.pos[0];
				item.pos[1]+= idx*op.step.pos[1];
				callback(item);				
			}
		}
	}

	prepareRendering(gc) {
		this.prepareViews(gc);

		for(let idx= 0; idx<this.layout.length; idx++) {
			const op= this.layout[idx];
			switch(op.type) {
				case "set":
					this.vars.set(op.name, op.value);
					break;
				case "repeat":
					this.repeat(op, (item)=> this.layout.push(item));
					break;
			}
		}

		if(this.menu)
			this.prepareMenu(gc, this.menu);
	}

	prepareViews(gc) {
		const viewList= this.layout.filter(op => op.type==="view");

		for(let idx= 0; idx<viewList.length; idx++) {
			const viewDesc= viewList[idx];

			if(!views[viewDesc.view])
				throw new TypeError(`Unknown View Type ${viewDesc.view}`);

			const canvas= document.createElement('canvas');
			canvas.width= viewDesc.width;
			canvas.height= viewDesc.height;
			// canvas.style.left= `${viewDesc.pos[0]}px`;
			// canvas.style.top= `${viewDesc.pos[1]}px`;
			// canvas.style.right= `${viewDesc.pos[0]+viewDesc.width}px`;
			// canvas.style.bottom= `${viewDesc.pos[1]+viewDesc.height}px`;
			const ctx= {canvas, gc, vars: this.vars, layer: this};
			viewDesc.component= new views[viewDesc.view](ctx);
			viewDesc.canvas= canvas;
			viewDesc.bbox= {
				left: viewDesc.pos[0],
				top: viewDesc.pos[1],
				right: viewDesc.width + viewDesc.pos[0],
				bottom: viewDesc.height + viewDesc.pos[1]
			};
			this.vars.set(viewDesc.name, viewDesc.component);
			// const elm= document.body.appendChild(canvas);
		}

	}

	findMenuByPoint(x,y) {
		return this.menu.items.findIndex(item => ptInRect(x, y, item.bbox));
	}

	menuMoveUp() {
		if(this.menu) {
			this.selectMenuItem(this.itemSelected-1);
		}
	}

	menuMoveDown() {
		if(this.menu)
			this.selectMenuItem(this.itemSelected+1);
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

			// case "joyaxismove":
			// 	if(e.timestamp - this.lastJoyTime < 200)
			// 		return;
			// 	this.lastJoyTime= e.timestamp;
			// 	if(e.vertical < -0.1)
			// 		return this.menuMoveUp();
			// 	if(e.vertical > 0.1)
			// 		return this.menuMoveDown();

			case "joybuttondown":
				if(e.X || e.TRIGGER_RIGHT)
					return this.exec(gc);
				if(e.CURSOR_UP)
					return this.menuMoveUp();
				if(e.CURSOR_DOWN)
					return this.menuMoveDown();
				break;

			case "mousemove":
				if(this.isMouseEnabled && this.menu) {
					const menuIdx= this.findMenuByPoint(e.x, e.y);
					if(menuIdx>=0)
						this.selectMenuItem(menuIdx);
					gc.viewport.canvas.style.cursor= menuIdx>=0 ? "pointer" : "default";
				}
				break;

			case "keyup":
				switch(e.key) {
					case "Control":
						this.wannaDisplayHitzones= false;
						break;
				}
				break;

			case "keydown":
				switch(e.key) {
					case "Control":
						this.wannaDisplayHitzones= true;
						break;

					case "ArrowDown":
					case "ArrowRight":
						this.menuMoveDown();
						break;
					case "ArrowUp":
					case "ArrowLeft":
						this.menuMoveUp();
						break;
					case "Enter":
						this.exec(gc);
						break;
				}
				break;
		}

		// console.log("DisplayLayer.handleEvent", e);

		for(let idx= 0; idx<this.views.length; idx++) {
			const view= this.views[idx];

			// if(["mousemove", "mouseup","mousedown", "click"].includes(e.type)) {
			// 	if(!ptInRect(e.x, e.y, view.bbox)) {
			// 		continue;
			// 	}
			// }

			const localEvent= {...e, pageX: e.x, pageY: e.y, x: e.x-view.pos[0], y: e.y-view.pos[1]};
			view.component.handleEvent(gc, localEvent);
		}
	}

	exec(gc, idx= null) {
		if(!this.menu)
			return;

		const selected= idx==null ? this.itemSelected : idx;
		const menuItem= this.menu.items[selected];

		if(!menuItem.action) {
			console.error("no action associated !?!", menuItem);
			return;
		}

		for (let idx = 0; idx < menuItem.action.length; idx++) {
			const fnCall = menuItem.action[idx];
			const args= [];

			for (let argsIdx = 0; argsIdx <fnCall.args.length; argsIdx++) {
				const arg= fnCall.args[argsIdx]; 
				if(typeof arg === "number") {
					args.push(arg);
					continue;
				}
				const strMatches = arg.match(/^"(.*)"$/);
				if(strMatches) {
					args.push(strMatches[1]);
					continue;
				}

				const varMatches = arg.match(/^\$(.*)$/);
				if(varMatches) {
					const varname= varMatches[1];
					if(!this.vars.has(varname))
						throw new TypeError(`Unknown Variable "${varname}" !?!`);
					args.push( this.vars.get(varname) );
					continue;
				}

				args.push( arg );
			}

			let fn= fnCall.name.length === 1 ? views[SYSTEM] : null;
			let self= fn;
			for(let partIdx= 0; partIdx<fnCall.name.length; partIdx++) {
				const part= fnCall.name[partIdx];
				if(!self) {
					self= this.vars.get(part);
					fn= self;
				} else {
					fn= fn[part];
				}
				if(!fn) {
					console.error("unknown action !", fnCall.name.join("."), args);
					return;
				}
			}

			fn.call(self, ...args);

		}

	}

	eval(text) {
		return text.replace(/%(.+?)%/, (m, varname) => {
			const [name, ...parms]= varname.split(".");
			if(!this.vars.has(name)) {
				throw new TypeError(`unknown var "${name}"`);
			}

			let value= this.vars.get(name);
			if(value === undefined) {
				console.log(`undefined var "${name}"`, varname);
				return "";
			}

			for(let parmIdx= 0; parmIdx<parms.length; parmIdx++) {
				let parm= parms[parmIdx];

				if(parm.match(/^\$/)) {
					parm= this.vars.get(parm.substr(1));
				}

				value= value[parm];

				if(value === undefined) {
					console.log(`undefined var "${parm}"`, varname);
					return "";
				}

			}
			
			if(value === undefined) {
				console.log("undefined var", varname);
				return "";
			}
			return value;
		});
	}

	renderText({viewport:{ctx}}, op) {
		if(op.blink && this.blinkFlag)
			return;
		if(op.align)
			this.font.align= op.align;
		if(op.size)
			this.font.size= op.size;
		const text= this.eval(op.text);
		return this.font.print(ctx, text===""? " ": text, op.pos[0], op.pos[1], op.color);
	}

	renderSprite({resourceManager, tick, viewport:{ctx}}, op) {
		// const [sheet, sprite]= op.sprite.split(":");
		// const ss= resourceManager.get("sprite", sheet);
		const {ss, sprite}= loadSprite({resourceManager}, op.sprite);
		const zoom= op.zoom || 1;
		const [x, y]= op.pos;
		let [countX, countY]= op.range || [1,1];
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

	renderMenu(gc, menu) {
		for(let idx= 0; idx<menu.items.length; idx++) {
			const item= menu.items[idx];

			if(idx===this.itemSelected) {
				const ctx= gc.viewport.ctx;

				if(menu.selection?.background) {
					const selectRect= growRect(item.bbox, 2, 5);
					ctx.fillStyle = menu.selection?.background;
					ctx.fillRect(selectRect.x, selectRect.y, selectRect.width, selectRect.height);
				} else {
					ctx.strokeStyle= menu.selection?.color ?? ENV.COLORS.SELECT_RECT;
					ctx.beginPath();
					ctx.moveTo(item.bbox.left-2, item.bbox.top-5);
					ctx.lineTo(item.bbox.right+4, item.bbox.top-5);
					ctx.moveTo(item.bbox.left-2, item.bbox.bottom+2);
					ctx.lineTo(item.bbox.right+4, item.bbox.bottom+2);
					ctx.stroke();
				}

				if(menu.selectionSprites?.left) {
					const {ss, sprite}= menu.selectionSprites.left;
					ss.drawAnim(sprite, ctx, item.bbox.left-25, item.bbox.top-2, gc.tick/100);
				}
				if(menu.selectionSprites?.right) {
					const {ss, sprite}= menu.selectionSprites.right;
					ss.drawAnim(sprite, ctx, item.bbox.right+4, item.bbox.top-2, gc.tick/100);
				}				
			}

			switch(item.type) {
				case "text": {
					const selectedColor= menu.selection?.color ?? ENV.COLORS.SELECTED_TEXT;
					this.renderText(gc, {
						...item,
						color: idx===this.itemSelected ? selectedColor : item.color,
					});
					break;
				}
				case "sprite":
					this.renderSprite(gc, item);
					break;
				case "group":
					this.renderMenu(gc, item);
					break;
			}

		}
			
	}

	renderRect({viewport:{ctx}}, op) {
		ctx.fillStyle= op.color;
		ctx.fillRect(op.pos[0], op.pos[1], op.width, op.height);
		// ctx.strokeStyle= op.color;
		// ctx.strokeRect(op.pos[0], op.pos[1], op.width, op.height);
	}

	renderView(gc, op) {
		op.component.render(gc);
		// gc.viewport.ctx.imageSmoothingEnabled = false;
		// gc.viewport.ctx.globalAlpha= 1;
		// gc.viewport.ctx.globalCompositeOperation = "source-over";
		gc.viewport.ctx.drawImage(op.canvas, op.pos[0], op.pos[1]);
	}

	render(gc) {
		const ctx= gc.viewport.ctx;

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
				case "rect":
					this.renderRect(gc, op);
					break;
				case "view":
					this.renderView(gc, op);
					break;
				// default:
				// 	throw new Error(`Unkown operation ${op.type}`);
			}
		}

		if(this.wannaDisplayHitzones && this.menu) {
			const items= this.menu.items;
			for (let idx = 0; idx < items.length; idx++) {
				const item = items[idx];
				ctx.strokeStyle= "red";
				ctx.strokeRect(item.bbox.left, item.bbox.top, item.bbox.right-item.bbox.left, item.bbox.bottom-item.bbox.top);
				ctx.fillStyle="red";
				ctx.fillText(`${item.type}`, item.bbox.left, item.bbox.bottom+10);

				ctx.fillStyle="white";
				ctx.fillText(`Selected: ${this.itemSelected} X: ${this.gc.mouse.x} Y: ${this.gc.mouse.y}`,480,590);				
			}		
		}

	}
}