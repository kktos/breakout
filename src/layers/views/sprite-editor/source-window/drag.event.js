import { ptInRect } from "../../../../math.js";

export function handleDragEvent(e) {
	const x= e.offsetX;
	const y= e.offsetY;
	switch(e.type) {
		case "mousedown":
			if(e.target.id !== "imageSource")
				return;

			if(!this.currentSpriteSheet)
				return;

			if(this.shiftPressed) {
				const idx= this.selectedSpriteSheets.findIndex(rect => rect===this.currentSpriteSheet);
				if(idx>=0) {
					this.selectedSpriteSheets.splice(idx, 1);
				} else {
					this.selectedSpriteSheets.push(this.currentSpriteSheet);
				}
				break;
			}

			if(this.selectedSpriteSheets.length <=1)
				this.selectedSpriteSheets= [this.currentSpriteSheet];
				
			this.updateUI(this.currentSpriteSheet);

			this.isMoving= true;
			this.movePos= {x: x-this.currentSpriteSheet.x, y: y-this.currentSpriteSheet.y};

			break;

		case "mousemove":
			if(e.target.id !== "imageSource")
				return;

			if(this.isMoving) {
				this.canvas.style.cursor= "grabbing";
				const deltaX= (x - this.movePos.x) - this.currentSpriteSheet.x;
				const deltaY= (y - this.movePos.y) - this.currentSpriteSheet.y;
				for (let idx = 0; idx < this.selectedSpriteSheets.length; idx++) {
					const selectedRect = this.selectedSpriteSheets[idx];
					selectedRect.x+= deltaX;
					selectedRect.y+= deltaY;
				}
				this.updateUI(this.currentSpriteSheet);
				break;
			}

			this.currentSpriteSheet= this.spriteSheets.find(rect => {
				const r= {left: rect.x, top: rect.y, right: rect.x+rect.w, bottom: rect.y+rect.h};
				return ptInRect(x, y, r);
			});
			if(this.currentSpriteSheet) {
				const isOverSelected= this.selectedSpriteSheets.includes(this.currentSpriteSheet);
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

			if(this.currentSpriteSheet) {
				this.updateUI(this.currentSpriteSheet);
				this.currentSpriteSheet= null;
			}

			this.isMoving= false;
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
