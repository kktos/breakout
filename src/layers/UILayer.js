import Layer from "./Layer.js";
import Scene from "../scene/Scene.js";

export default class UILayer extends Layer {
	
	constructor(gc, layout) {
		super(gc);

		this.gc= gc;
		this.ui= document.getElementById("ui");
		if(layout) {
			this.ui.innerHTML= `
				<div class="grid-column vcenter">
					<img id="btnBack" class="btn light-shadow" src="/assets/images/left-arrow.png"/>
				</div>
			`;
			this.ui.querySelectorAll(".btn")
				.forEach((btn) => btn.addEventListener("click", evt => evt.isTrusted && this.onClickUIBtn(btn.id)));		
		}
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