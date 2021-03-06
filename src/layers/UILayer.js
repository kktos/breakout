import Layer from "./layer.js";
import Scene from "../scene/scene.js";

export default class UILayer extends Layer {
	
	constructor(gc, layout) {
		super(gc);

		this.gc= gc;
		this.ui= document.getElementById("ui");
		if(layout) {
			this.ui.className= layout.pos == "top" ? "top":"bottom";
			this.ui.className+= layout.transparent ? " transparent":"";
			this.ui.innerHTML= `
				<div class="grid-column vcenter">
					<div id="btnBack" class="btn light-shadow icn icn-left-arrow"></div>
				</div>
			`;
			this.ui.querySelectorAll(".btn")
				.forEach((btn) => btn.addEventListener("click", evt => evt.isTrusted && this.onClickUIBtn(btn.id)));		
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