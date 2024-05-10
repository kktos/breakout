import { ptInRect } from "../../../../math.js";

export function handleSelectEvent(e) {
	const x= e.offsetX;
	const y= e.offsetY;
	switch(e.type) {
		case "mousedown":
			if(e.target.id !== "imageSource")
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
					
				this.updateUI(this.currentRect);

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
			this.updateUI(this.currentRect);
			break;

		case "mousemove":
			if(e.target.id !== "imageSource")
				return;

			if(this.isDrawing || this.isResizing) {
				this.currentRect.w= x - this.currentRect.x;
				this.currentRect.h= y - this.currentRect.y;
				this.updateUI(this.currentRect);
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
				this.updateUI(this.currentRect);
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
			if(e.target.id !== "imageSource")
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
			this.updateUI(this.currentRect);
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
