import Layer from "./Layer.js";

export default class UILayer extends Layer {
	
	constructor(gc) {
		super(gc);

		this.gc= gc;
		this.ui= document.getElementById("ui");
		this.ui.innerHTML= `
			<div class="grid-column vcenter">
				<div id="btnBack" class="btn white-shadow vcenter">BACK</div>
			</div>
		`;
		this.ui.querySelectorAll(".btn").forEach((btn) => btn.addEventListener("click", evt => evt.isTrusted && this.onClickUIBtn(btn.id)));		
	}	
	
	goBack() {
		this.ui.innerHTML= "";
		this.gc.coppola.runPrevious();
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