import { ptInRect } from "../../../math.js";
import { drawPixelated } from "../../../utils/canvas.utils.js";
import { window_create, window_handle_event, window_set_title, window_show } from "./window-manager.js";

export class SpriteSheetWindow {
	
	constructor(onEventHandler) {
		this.spriteSourceImage= null;
		this.spriteZoomedImage= null;

		this.currentRect= null;
		this.selectedRects= [];

		this.spriteRects= [];
		this.isDrawing= false;
		this.isMoving= false;
		this.isResizing= false;
		this.movePos= null;

		this.shiftPressed= false;
		this.ctrlPressed= false;

		// this.onEventHandler= onEventHandler;

		this.buildUI();

		window_handle_event("spriteSheetImage", (e) => this.handleWindowEvent(e) );

	}

	buildUI() {
		const div= document.createElement("div");
		div.innerHTML= `
		<style>
			.view-window {
				background-color: #000;
				display: grid;
				grid-template-rows: 25px 1fr auto;
			}
			.view-content {
				overflow: scroll;
			}
			.view-footer {
				color: white;
				align-items: center;
				font: status-bar;
				background: #585858;
			}
			.view-footer .btn {
				font: caption;
			}
			#imageSpriteSheet {
				position: relative;
			}
		</style>
		<div window-title="close"></div>
		<div class="view-content">
			<canvas id="imageSpriteSheet"></canvas>
		</div>
		<div class="view-footer grid-column">
			<div class="grid-column">
				x<input type="text" id="x" value="0" class="w50"/>
				y<input type="text" id="y" value="0" class="w50"/>
				w<input type="text" id="w" value="0" class="w50"/>
				h<input type="text" id="h" value="0" class="w50"/>
			</div>
			<div>
				<div id="btnCreateSpriteSheet" class="btn">Create SpriteSheet</div>
			</div>
			<div></div>
		</div>
		`;
		div.id= "spriteSheetImage";
		div.className= "view-window";
		div.setAttribute("window","");
		document.querySelector("body").appendChild(div);
		this.div= div;

		window_create(div);

		const inputList= div.querySelectorAll("INPUT,SELECT");
		for (let idx = 0; idx < inputList.length; idx++) {
			inputList[idx].addEventListener("change", evt => this.onChangeUI(evt.target));			
		}
		const btnList= div.querySelectorAll(".btn");
		for (let idx = 0; idx < btnList.length; idx++) {
			btnList[idx].addEventListener("click", () => this.onClickUIBtn(btnList[idx].id))	
		}

		this.canvas= div.querySelector("#imageSpriteSheet");
		this.ctx= this.canvas.getContext('2d');
	}

	updateUI() {
		const inputList= this.div.querySelectorAll("INPUT");
		for (let idx = 0; idx < inputList.length; idx++) {
			const el= inputList[idx];
			switch(el.id) {
				case "x": el.value= Math.floor(this.currentRect.x / 4); break;
				case "y": el.value= Math.floor(this.currentRect.y / 4); break;
				case "w": el.value= Math.floor(this.currentRect.w / 4); break;
				case "h": el.value= Math.floor(this.currentRect.h / 4); break;
			}			
		}
	}

	onChangeUI(target) {
		const hasOnlyOneRect= this.selectedRects.length === 1;
		for (let idx = 0; idx < this.selectedRects.length; idx++) {
			const rect= this.selectedRects[idx];
			switch(target.id) {
				case "x": if(hasOnlyOneRect) rect.x= parseInt(target.value * 4); break;
				case "y": if(hasOnlyOneRect) rect.y= parseInt(target.value * 4); break;
				case "w": rect.w= parseInt(target.value * 4); break;
				case "h": rect.h= parseInt(target.value * 4); break;
			}
		}

	}

	onClickUIBtn(btnID) {
		switch(btnID) {
			case "btnCreateSpriteSheet":
				this.createSpriteSheet();
				break;
		}
	}
	
	createSpriteSheet() {
		if(this.selectedRects.length===0)
			return;

		let width= 0;
		let height= 0;
		for (let idx = 0; idx < this.selectedRects.length; idx++) {
			const selectedRect = this.selectedRects[idx];
			width= Math.max(width, Math.floor(selectedRect.w/4));
			height+= Math.floor(selectedRect.h/4);
		}
	
		const canvas= document.createElement('canvas');
		const ctx= canvas.getContext('2d');
		canvas.width= width;
		canvas.height= height;

		const dx= 0;
		let dy= 0;
		for (let idx = 0; idx < this.selectedRects.length; idx++) {
			const selectedRect = this.selectedRects[idx];
			const x= selectedRect.x / 4;
			const y= selectedRect.y / 4;
			const w= selectedRect.w / 4;
			const h= selectedRect.h / 4;
			ctx.drawImage(this.spriteSourceImage,
				x, y, w, h,
				dx, dy, w, h);
			
			dy+= h;
			
		}
		this.onEventHandler("addSpriteSheet", canvas);
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

	show() {
		window_show("spriteSheetImage");
	}

	setImage(image) {
		this.spriteSourceImage= image;
		this.canvas.width= this.spriteSourceImage.width * 4;
		this.canvas.height= this.spriteSourceImage.height * 4;

		const canvas = document.createElement('canvas');
		canvas.width  = this.canvas.width;
		canvas.height = this.canvas.height;
		const ctx = canvas.getContext('2d', {alpha: false});	
		drawPixelated(this.spriteSourceImage, ctx, 4);

		this.spriteZoomedImage= canvas;

	}

	handleWindowEvent(e) {
		const x= e.offsetX;
		const y= e.offsetY;
		switch(e.type) {
			case "mousedown":
				if(e.target.id !== "imageSpriteSheet")
					return;

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
						
					this.updateUI();

					if(this.ctrlPressed) {
						this.isResizing= true;
						this.canvas.style.cursor= "nw-resize";
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
				this.updateUI();
				break;

			case "mousemove":
				if(e.target.id !== "imageSpriteSheet")
					return;

				if(this.isDrawing || this.isResizing) {
					this.currentRect.w= x - this.currentRect.x;
					this.currentRect.h= y - this.currentRect.y;
					this.updateUI();
					break;
				}
				if(this.isMoving) {
					this.canvas.style.cursor= "grabbing";
					const deltaX= (x - this.movePos.x) - this.currentRect.x;
					const deltaY= (y - this.movePos.y) - this.currentRect.y;
					for (let idx = 0; idx < this.selectedRects.length; idx++) {
						const selectedRect = this.selectedRects[idx];
						selectedRect.x+= deltaX;
						selectedRect.y+= deltaY;
					}
					this.updateUI();
					break;
				}

				this.currentRect= this.spriteRects.find(rect => {
					const r= {left: rect.x, top: rect.y, right: rect.x+rect.w, bottom: rect.y+rect.h};
					return ptInRect(x, y, r);
				});
				if(this.currentRect) {
					const isOverSelected= this.selectedRects.includes(this.currentRect);
					if(!isOverSelected) {
						this.canvas.style.cursor= "pointer";
						break;
					}
					this.canvas.style.cursor= this.ctrlPressed ? "nw-resize" : "grab";
					break;
				}
				this.canvas.style.cursor= "default";
				break;

			case "mouseup":
				if(e.target.id !== "imageSpriteSheet")
					return;

				if(this.isDrawing || this.isResizing) {
					if(this.currentRect.w<0) {
						this.currentRect.x+= this.currentRect.w;
						this.currentRect.w= -this.currentRect.w;
					}
					if(this.currentRect.h<0) {
						this.currentRect.y+= this.currentRect.h;
						this.currentRect.h= -this.currentRect.h;
					}
				}
				if(this.isDrawing && this.currentRect.w>0 && this.currentRect.h>0) {
					this.spriteRects.push(this.currentRect);
					this.selectedRects= [this.currentRect];
				}
				this.updateUI();
				this.currentRect= null;
				this.isDrawing= false;
				this.isMoving= false;
				this.isResizing= false;
				this.canvas.style.cursor= "default";
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
					case "Delete":
						this.deleteSelected();
						break;
				}

		}
	}

	render() {
		this.ctx.clearRect(0, 0, this.width, this.height);

		if(this.spriteZoomedImage) {
			const w = this.spriteZoomedImage.width;
			const h = this.spriteZoomedImage.height;
			this.ctx.drawImage(
				this.spriteZoomedImage,
				0, 0, w, h,
				0, 0, w, h);			
		}

		this.ctx.strokeStyle= "white";
		for (let idx = 0; idx < this.spriteRects.length; idx++) {
			const rect = this.spriteRects[idx];
			this.ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
		}

		if(this.currentRect) {
			this.ctx.strokeStyle= "blue";
			this.ctx.lineWidth= 2;
			this.ctx.strokeRect(this.currentRect.x, this.currentRect.y, this.currentRect.w, this.currentRect.h);
		}

		this.ctx.strokeStyle= "yellow";
		this.ctx.lineWidth= 2;
		for (let idx = 0; idx < this.selectedRects.length; idx++) {
			const rect = this.selectedRects[idx];
			this.ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
		}

	}
}