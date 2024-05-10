import Scene from "../scene/Scene.js";
import Layer from "./layer.js";

export default class UILayer extends Layer {
	
	constructor(gc, layout) {
		super(gc);

		this.gc= gc;
		this.ui= document.getElementById("ui");
		if(layout) {
			this.ui.className= layout.pos === "top" ? "top":"bottom";

			if(layout.background)
				this.ui.style.backgroundColor= layout.background;

			this.ui.innerHTML= `
				<div class="grid-column header">
					<div id="btnBack" class="btn light-shadow icn icn-left-arrow"></div>
				</div>
				<div class="grid-column content">
				</div>
			`;
			this.bindEvents( document.querySelector("#ui > .header"), this );
		}
		else
			this.ui.className= "";
	}	
	
	setContent(html, handler= null) {
		const contentElm= document.querySelector("#ui > .content");
		contentElm.innerHTML= html;
		this.bindEvents(contentElm, handler ?? this);
	}

	bindEvents(elm, handler) {
		const btnList= elm.querySelectorAll(".btn");
		for (let idx = 0; idx < btnList.length; idx++) {
			btnList[idx].addEventListener("click", evt => evt.isTrusted && handler.onClickUIBtn(btnList[idx].id))	
		}

		const inputList= elm.querySelectorAll("INPUT,SELECT");
		for (let idx = 0; idx < inputList.length; idx++) {
			inputList[idx].addEventListener("change", evt => evt.isTrusted && handler.onChangeUI(evt.target));			
		}
	}

	goBack() {
		this.destroy();
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

	destroy() {}
	render(dt) {}
}