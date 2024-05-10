import { ptInRect } from "../../../math.js";
import { createViewport } from "../../../utils/canvas.utils.js";
import { SourceWindow } from "./source-window/source.window.js";
// import { SpriteSheetWindow } from "./spritesheet.windows.js";
import { window_init, window_set_title } from "./window-manager.js";

export class SpriteEditorView {

	constructor(ctx) {
		this.gc= ctx.gc;

		this.gc.wannaPauseOnBlur= false;

		this.vars= ctx.vars;
		this.width= ctx.canvas.width;
		this.height= ctx.canvas.height;
		// this.ctx= ctx.canvas.getContext('2d',{ alpha: false });
		this.ctx= ctx.canvas.getContext('2d');
		this.canvas= ctx.canvas;
		this.rezMgr= this.gc.resourceManager;

		this.spriteSourceImage= null;

		this.spriteSheetImage= null;

		this.scale= 1;
		this.ctx.scale(this.scale, this.scale);

		this.isDrawing= false;
		this.isMoving= false;
		this.isResizing= false;
		this.movePos= null;

		this.ctrlPressed= false;
		this.shiftPressed= false;
		
		this.currentRect= null;
		this.selectedRects= [];
		this.spriteRects= [];

		this.currentSpriteSheet= null;
		this.spriteSheets= [];

		this.batch= {
			x: 0,
			y: 0,
			w: 0,
			h: 0,
			offsetx: 0,
			offsety: 0,
			count: 0
		};

		this.buildUI(ctx.layer);

		window_init();

		this.sourceWindow= new SourceWindow((type, data) => this.onEventHandler(type, data));
		// this.spritesheetWindow= new SpriteSheetWindow((type, data) => this.onEventHandler(type, data));

	}
 
	destroy() {
		this.sourceWindow.destroy();
	}

	buildUI(layer) {
		const html= `
			<div class="vcenter hcenter">
				<div class="grid-column">
					<div id="btnLoadImage" class="btn">
						<div class="icn z50 icn-load"></div>Load Image
					</div>
					<div id="btnViewImage" class="btn">
						<div class="icn z50 icn-load"></div>View Image
					</div>
					<div id="btnGenerate" class="btn">
						Generate Sprites
					</div>
				</div>
				<div id="batchPanel" class="grid-column vcenter gap-10">
					<div>X:<input type="text" id="rectx" value="0" class="w50"/></div>
					<div>Y:<input type="text" id="recty" value="0" class="w50"/></div>
					<div>W:<input type="text" id="rectw" value="0" class="w50"/></div>
					<div>H:<input type="text" id="recth" value="0" class="w50"/></div>
					<div>OX:<input type="text" id="offsetx" value="0" class="w50"/></div>
					<div>OY:<input type="text" id="offsety" value="0" class="w50"/></div>
					<div>Count:<input type="text" id="count" value="0" class="w40"/></div>
					<div id="btnCreateBatch" class="btn">create</div>
				</div>
			</div>
		`;

		layer.setContent(html, this);
	}

	onClickUIBtn(id) {
		switch(id) {
			case "btnLoadImage":
				this.loadImage();
				break;
			case "btnViewImage":
				this.viewImage();
				break;
			case "btnCreateBatch":
				this.createBatch();
				break;
			case "btnGenerate":
				this.generateSprites();
				break;
		}
	}

	onChangeUI(el) {
		switch(el.id) {
			case "rectx": this.batch.x= parseInt(el.value); break;
			case "recty": this.batch.y= parseInt(el.value); break;
			case "rectw": this.batch.w= parseInt(el.value); break;
			case "recth": this.batch.h= parseInt(el.value); break;
			case "offsetx": this.batch.offsetx= parseInt(el.value); break;
			case "offsety": this.batch.offsety= parseInt(el.value); break;
			case "count": this.batch.count= parseInt(el.value); break;
			case "ss":
				this.setSpritesheet(el.value);
				break;
		}
	}

	onEventHandler(type, data) {
		switch(type) {
			case "addSpriteSheet":
				this.addSpriteSheet(data);
				break;
		}
	}

	updateUI(r) {
		this.batch.x= r.x;
		this.batch.y= r.y;
		this.batch.w= r.w;
		this.batch.h= r.h;

		const inputList= document.querySelectorAll("#batchPanel INPUT");
		for (let idx = 0; idx < inputList.length; idx++) {
			const el= inputList[idx];
			switch(el.id) {
				case "rectx": el.value= this.batch.x; break;
				case "recty": el.value= this.batch.y; break;
				case "rectw": el.value= this.batch.w; break;
				case "recth": el.value= this.batch.h; break;
			}			
		}
	}

	handleEvent(gc, e) {
		const x= e.pageX;
		const y= e.pageY;
		switch(e.type) {
			// case "wheel":
			// 	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
			// 	this.scale += e.deltaY * -0.0001;
			// 	this.scale = Math.min(Math.max(0.125, this.scale), 4);
			// 	this.ctx.scale(this.scale, this.scale);
			// 	console.log(e.deltaY, this.scale);
			// 	break;

			case "mousedown":
				if(this.currentSpriteSheet) {
					this.isMoving= true;
					this.movePos= {x: x-this.currentSpriteSheet.x, y: y-this.currentSpriteSheet.y};
					break;
				}
				if(this.currentRect) {

					if(this.shiftPressed) {
						const idx= this.selectedRects.findIndex(rect => rect===this.currentRect);
						if(idx>=0) {
							this.selectedRects.splice(idx, 1);
						} else {
							this.selectedRects.push(this.currentRect);
						}
						break;
					}

					if(this.selectedRects.length <=1)
						this.selectedRects= [this.currentRect];
					
					if(this.ctrlPressed) {
						this.isResizing= true;
						gc.viewport.canvas.style.cursor= "nw-resize";
						break;
					}

					this.isMoving= true;
					this.movePos= {x: x-this.currentRect.x, y: y-this.currentRect.y};
					break;
				}

				this.selectedRect= [];
				this.currentRect= {
						x: x,
						y: y,
						w: 0,
						h: 0
					}
				this.isDrawing= true;
				this.updateUI(this.currentRect);
				break;

			case "mousemove":
				if(this.isDrawing || this.isResizing) {
					this.currentRect.w= x - this.currentRect.x;
					this.currentRect.h= y - this.currentRect.y;
					this.updateUI(this.currentRect);
					break;
				}
				// if(this.isMoving) {
				// 	gc.viewport.canvas.style.cursor= "grabbing";
				// 	const deltaX= (x - this.movePos.x) - this.currentRect.x;
				// 	const deltaY= (y - this.movePos.y) - this.currentRect.y;
				// 	for (let idx = 0; idx < this.selectedRects.length; idx++) {
				// 		const selectedRect = this.selectedRects[idx];
				// 		selectedRect.x+= deltaX;
				// 		selectedRect.y+= deltaY;
				// 	}
				// 	this.updateUI(this.currentRect);
				// 	break;
				// }
				if(this.isMoving) {
					gc.viewport.canvas.style.cursor= "grabbing";
					const deltaX= (x - this.movePos.x) - this.currentSpriteSheet.x;
					const deltaY= (y - this.movePos.y) - this.currentSpriteSheet.y;
					// this.updateUI(this.currentRect);
					this.currentSpriteSheet.x+= deltaX;
					this.currentSpriteSheet.y+= deltaY;
					this.updateUI(this.currentSpriteSheet);
					break;
				}

				// this.currentRect= this.spriteRects.find(rect => {
				// 	const r= {left: rect.x, top: rect.y, right: rect.x+rect.w, bottom: rect.y+rect.h};
				// 	return ptInRect(x, y, r);
				// });
				// if(this.currentRect) {
				// 	const isOverSelected= this.selectedRects.includes(this.currentRect);
				// 	if(!isOverSelected) {
				// 		gc.viewport.canvas.style.cursor= "pointer";
				// 		break;
				// 	}
				// 	gc.viewport.canvas.style.cursor= this.ctrlPressed ? "nw-resize" : "grab";
				// 	break;
				// }

				this.currentSpriteSheet= this.spriteSheets.find(rect => {
					const r= {left: rect.x, top: rect.y, right: rect.x+rect.width, bottom: rect.y+rect.height};
					return ptInRect(x, y, r);
				});
				if(this.currentSpriteSheet) {
					gc.viewport.canvas.style.cursor= "grab";
					// gc.viewport.canvas.style.cursor= this.ctrlPressed ? "nw-resize" : "grab";
					break;
				}
				gc.viewport.canvas.style.cursor= "default";
				break;

			case "mouseup":
				if(this.isDrawing || this.isResizing) {
					if(this.currentRect.w<0) {
						this.currentRect.x+= this.currentRect.w;
						this.currentRect.w= -this.currentRect.w;
					}
					if(this.currentRect.h<0) {
						this.currentRect.y+= this.currentRect.h;
						this.currentRect.h= -this.currentRect.h;
					}
					this.updateUI(this.currentRect);
				}
				if(this.isDrawing) {
					this.spriteRects.push(this.currentRect);
					this.selectedRects= [this.currentRect];
				}
				this.currentRect= null;
				this.isDrawing= false;
				this.isMoving= false;
				this.isResizing= false;
				gc.viewport.canvas.style.cursor= "default";
				break;

			case "keyup":
				switch(e.key) {
					case "Control":
						this.ctrlPressed= false;
						break;
					case "Shift":
						this.shiftPressed= false;
						break;
					}
				break;

			case "keydown":
				switch(e.key) {
					case "Shift":
						this.shiftPressed= true;
						break;
					case "Control":
						this.ctrlPressed= true;
						break;
					case "ArrowDown":
						// this.prevAnim();
						break;
					case "ArrowUp":
						// this.nextAnim();
						break;
					case "Delete":
						this.deleteSelected();
						break;
				}
		}
	}

	deleteSelected() {
		while(this.selectedRects.length) {
			const selectedRect = this.selectedRects.pop();

			this.spriteRects.find((rect, index) => {
				if(rect===selectedRect) {
					this.spriteRects.splice(index, 1);
					return true;
				}
			});
		}
		this.currentRect= null;
	}

	createBatch() {
		const offsetx= this.batch.offsetx;
		const offsety= this.batch.offsety;
		const rectx= this.batch.x;
		const recty= this.batch.y;
		const rectw= this.batch.w;
		const recth= this.batch.h;
		this.selectedRects= [];
		for (let idx = 1; idx < this.batch.count; idx++) {
			const r= {
				x: rectx + (offsetx ? (offsetx+rectw)*idx : 0),
				y: recty + (offsety ? (offsety+recth)*idx : 0),
				w: rectw,
				h: recth
			}
			this.spriteRects.push(r);
			this.selectedRects.push(r);
		}
	}
	
	addSpriteSheet(img) {
		img.x= 10;
		img.y= 10;
		this.spriteSheets.push(img);
	}

	generateSprites() {
		if(this.selectedRects.length===0)
			return;

		const canvas= document.createElement('canvas');
		const ctx= canvas.getContext('2d');
		canvas.width= 100;
		canvas.height= 400;

		const x= 0;
		let y= 0;
		for (let idx = 0; idx < this.selectedRects.length; idx++) {
			const selectedRect = this.selectedRects[idx];

			ctx.drawImage(this.spriteSourceImage,
				selectedRect.x, selectedRect.y, selectedRect.w, selectedRect.h,
				x, y, selectedRect.w, selectedRect.h);
			
			y+= selectedRect.h;
			
		}
		this.spriteSheetImage= canvas;

	}
	
	viewImage() {
		this.sourceWindow.show();
	}

	async loadImage() {
		const {image, name}= await this.downloadImage();
		this.sourceWindow.setImage(image);
		window_set_title("srcImage", name);
		this.viewImage();
	}

	downloadImage() {
		return new Promise(resolve => {
			const f = document.createElement('input');
			f.setAttribute('type', 'file');
			f.setAttribute('accept', '.png,.bmp,.gif');
			f.addEventListener('change', (evt) => {
				const file = evt.target.files[0];
				const fr = new FileReader();
				fr.onload = (evt) => {
					const image= new Image();
					image.addEventListener('load', () => resolve({image, name: file.name}));
					image.src= evt.target.result;
				};
				fr.readAsDataURL(file);
			});
			f.click();	
		});
	}

	setSpritesheet(idx) {
		this.spritesheetName= this.spritesheetList[idx];
		this.spritesheet= this.rezMgr.get(this.spritesheetName);
		this.animations= this.spritesheet.animations;

		this.names= [...this.animations.keys()];
		this.vars.set("names", this.names);

		this.currAnim= 0;
		this.vars.set("currAnim", this.currAnim);

		this.pauseAnim= false;
		this.stepAnim= false;
		this.step= 0;		
	}

	render(gc) {
		const localGc= {...gc};
		localGc.viewport= createViewport(this.canvas);

		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.strokeStyle= "white";
		this.ctx.strokeRect(0, 0, this.width, this.height);

		if(this.spriteSheetImage) {
			const w = this.spriteSheetImage.width;
			const h = this.spriteSheetImage.height;
			this.ctx.drawImage(
				this.spriteSheetImage,
				0, 0, w, h,
				0, 0, w, h);
		}


		const ctx= gc.viewport.ctx;

		// const x = 0;
		// const y = 0;
		// if(this.spriteSourceImage) {
		// 	const w = this.spriteSourceImage.width;
		// 	const h = this.spriteSourceImage.height;
		// 	ctx.drawImage(
		// 		this.spriteSourceImage,
		// 		x, y, w, h,
		// 		0, 0, w, h);
		// }

		ctx.strokeStyle= "white";
		for (let idx = 0; idx < this.spriteRects.length; idx++) {
			const rect = this.spriteRects[idx];
			ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
		}

		if(this.currentRect) {
			ctx.strokeStyle= "blue";
			ctx.strokeRect(this.currentRect.x, this.currentRect.y, this.currentRect.w, this.currentRect.h);
		}

		ctx.strokeStyle= "yellow";
		for (let idx = 0; idx < this.selectedRects.length; idx++) {
			const rect = this.selectedRects[idx];
			ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
		}

		for (let idx = 0; idx < this.spriteSheets.length; idx++) {
			const img = this.spriteSheets[idx];
			ctx.drawImage(img,	img.x, img.y);
		}

		this.sourceWindow.render();

		// if(this.selectedRects.length) {
		// 	ctx.strokeStyle= "yellow";
		// 	ctx.strokeRect(this.selectedRect.x, this.selectedRect.y, this.selectedRect.w, this.selectedRect.h);
			
		// 	ctx.fillStyle= "white";
		// 	ctx.fillRect(527, 505-7, 595-525, 10);

		// 	ctx.fillStyle= "black";
		// 	ctx.font= "6px sans-serif";
		// 	ctx.fillText(`x:${this.selectedRect.x} y:${this.selectedRect.y} w:${this.selectedRect.w} h:${this.selectedRect.h}`, 530, 505);
		// }


	}

}