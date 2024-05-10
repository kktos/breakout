import { createFromSource, createImgCanvas, drawCropPixelated, drawPixelated } from "../../../../utils/canvas.utils.js";
import { window_create, window_handle_event, window_show } from "../window-manager.js";
import { handleDragEvent } from "./drag.event.js";
import { handleSelectEvent } from "./select.event.js";

export class SourceWindow {
	
	constructor(onEventHandler) {
		this.spriteSourceImage= null;
		this.spriteZoomedImage= null;

		this.currentRect= null;
		this.selectedRects= [];
		this.spriteRects= [];

		this.currentSpriteSheet= null;
		this.spriteSheets= [];
		this.selectedSpriteSheets= [];

		this.isDrawing= false;
		this.isMoving= false;
		this.isResizing= false;
		this.movePos= null;

		this.setMode("select");

		this.shiftPressed= false;
		this.ctrlPressed= false;

		this.onEventHandler= onEventHandler;

		this.buildUI();

		window_handle_event("srcImage", (e) => this.handleWindowEvent(e) );

	}

	destroy() {
		document.querySelector("body").removeChild(this.div);
	}

	buildUI() {
		const div= document.createElement("div");
		div.innerHTML= `
		<style>
			.view-window {
				background-color: #000;
				display: grid;
				grid-template-rows: 25px 25px 1fr auto;
			}
			.view-footer {
				color: white;
				align-items: center;
				font: status-bar;
				background: #585858;
			}
			.view-toolbar {
				background: white;
				display: grid;
				grid-auto-flow: column;
				grid-gap: 5px;
			}
			.view-toolbar .btn {
				font: caption;
				color: black;
			}
			.view-toolbar .btn-small {
				font: caption;
				height: 25px;
				min-width: auto;
				margin: 0;
				padding:0;
			}
			#imageSource {
				position: relative;
			}
		</style>
		<div window-title="close"></div>
		<div class="view-toolbar">
			<div id="btnSelect" class="btn btn-small">Select</div>
			<div id="btnDrag" class="btn btn-small">Move</div>
		</div>
		<div class="view-content scroll">
			<canvas id="imageSource"></canvas>
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
		div.id= "srcImage";
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

		this.canvas= div.querySelector("#imageSource");
		this.ctx= this.canvas.getContext('2d');
	}

	updateUI(obj) {
		const inputList= this.div.querySelectorAll("INPUT");
		for (let idx = 0; idx < inputList.length; idx++) {
			const el= inputList[idx];
			switch(el.id) {
				case "x": el.value= Math.floor(obj.x / 4); break;
				case "y": el.value= Math.floor(obj.y / 4); break;
				case "w": el.value= Math.floor(obj.w / 4); break;
				case "h": el.value= Math.floor(obj.h / 4); break;
			}			
		}
	}

	onChangeUI(target) {
		const hasOnlyOneRect= this.selectedRects.length === 1;
		for (let idx = 0; idx < this.selectedRects.length; idx++) {
			const rect= this.selectedRects[idx];
			switch(target.id) {
				case "x": if(hasOnlyOneRect) rect.x= Number.parseInt(target.value * 4); break;
				case "y": if(hasOnlyOneRect) rect.y= Number.parseInt(target.value * 4); break;
				case "w": rect.w= Number.parseInt(target.value * 4); break;
				case "h": rect.h= Number.parseInt(target.value * 4); break;
			}
		}

	}

	onClickUIBtn(btnID) {
		switch(btnID) {
			case "btnCreateSpriteSheet":
				this.createSpriteSheet();
				break;
			case "btnSelect":
				this.setMode("select");
				break;
			case "btnDrag":
				this.setMode("drag");
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

		const srcCanvas= createImgCanvas(this.spriteSourceImage);
		const srcCtx= srcCanvas.getContext('2d');

		const canvas= document.createElement('canvas');
		let ctx= canvas.getContext('2d');
		ctx.imageSmoothingEnabled = false;
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
			//ctx.drawImage(createFromSource(srcCtx, x, y, w, h), dx, dy);

			// drawCropPixelated(srcCanvas, ctx, 1, {x, y, w, h}, {x:dx, y:dy});

			drawPixelated(createFromSource(srcCtx, x, y, w, h), ctx, 1, dx, dy);

			dy+= h;
		}

		// this.onEventHandler("addSpriteSheet", canvas);

		const zoomed = document.createElement('canvas');
		zoomed.width  = width * 4;
		zoomed.height = height * 4;
		ctx = zoomed.getContext('2d', {alpha: false});
		ctx.imageSmoothingEnabled = false;
		drawPixelated(canvas, ctx, 4);

		this.spriteSheets.push({
			x: 10,
			y: 10,
			w: zoomed.width,
			h: zoomed.height,
			src: canvas,
			zoomed
		});

	}

	deleteSelected() {

		switch(this.mode) {
			case "select": {
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
				break;
			}

			case "drag": {
				while(this.selectedSpriteSheets.length) {
					const selectedRect = this.selectedSpriteSheets.pop();
		
					this.spriteSheets.find((rect, index) => {
						if(rect===selectedRect) {
							this.spriteSheets.splice(index, 1);
							return true;
						}
					});
				}
				this.currentSpriteSheet= null;
				break;
			}
		}

	}

	show() {
		window_show("srcImage");
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

	setMode(mode) {
		this.mode= mode;
		switch(mode) {
			case "select":
				this.modeEventHandler= handleSelectEvent.bind(this);
				break;
			case "drag":
				this.modeEventHandler= handleDragEvent.bind(this);
				break;
		}
	}
	
	handleWindowEvent(e) {
		this.modeEventHandler?.(e);
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

		for (let idx = 0; idx < this.spriteSheets.length; idx++) {
			const ss = this.spriteSheets[idx];
			this.ctx.drawImage(ss.zoomed, ss.x, ss.y);
			if(this.mode === "drag") {
				this.ctx.strokeStyle= "white";
				this.ctx.strokeRect(ss.x, ss.y, ss.w, ss.h);
			}
		}

		switch(this.mode) {
			case "drag": {
				this.ctx.lineWidth= 2;

				if(this.currentSpriteSheet) {
					this.ctx.strokeStyle= "blue";
					this.ctx.strokeRect(this.currentSpriteSheet.x, this.currentSpriteSheet.y, this.currentSpriteSheet.w, this.currentSpriteSheet.h);
				}

				this.ctx.strokeStyle= "yellow";
				for (let idx = 0; idx < this.selectedSpriteSheets.length; idx++) {
					const rect = this.selectedSpriteSheets[idx];
					this.ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
				}
								
				break;
			}

			case "select": {
				this.ctx.strokeStyle= "white";
				for (let idx = 0; idx < this.spriteRects.length; idx++) {
					const rect = this.spriteRects[idx];
					this.ctx.strokeRect(rect.x-1, rect.y-1, rect.w+2, rect.h+2);
				}

				this.ctx.lineWidth= 2;
		
				if(this.currentRect) {
					this.ctx.strokeStyle= "blue";
					this.ctx.strokeRect(this.currentRect.x, this.currentRect.y, this.currentRect.w, this.currentRect.h);
				}
		
				this.ctx.strokeStyle= "yellow";
				for (let idx = 0; idx < this.selectedRects.length; idx++) {
					const rect = this.selectedRects[idx];
					this.ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
				}
				break;
			}

		}

	}
}