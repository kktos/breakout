import Scene from "../scene/Scene.js";
import Layer from "./layer.js";

export default class UILayer extends Layer {
	
	constructor(gc, layout) {
		super(gc);

		this.gc= gc;
		this.ui= document.getElementById("ui");
		if(layout) {
			this.ui.className= layout.pos === "top" ? "top":"bottom";
			this.ui.className+= layout.transparent ? " transparent":"";
			this.ui.innerHTML= `
				<div class="grid-column vcenter">
					<div id="btnBack" class="btn light-shadow icn icn-left-arrow"></div>
				</div>
			`;
			const btnList= this.ui.querySelectorAll(".btn");
			for (let idx = 0; idx < btnList.length; idx++) {
				btnList[idx].addEventListener("click", evt => evt.isTrusted && this.onClickUIBtn(btn.id))
				
			}
				// .forEach((btn) => btn.addEventListener("click", evt => evt.isTrusted && this.onClickUIBtn(btn.id)));		
		}
		else
			this.ui.className= "";
	}	
	
	goBack() {
		this.ui.innerHTML= "";
		this.gc.scene.events.emit(Scene.EVENT_COMPLETE, "menu");
	}

	onClickUIBtn(id) {
		switch(id) {
			case "btnBack":
				this.goBack();
				break;
		}
	}

	render(dt) {}
}