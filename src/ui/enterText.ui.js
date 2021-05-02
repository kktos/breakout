
export default class EnterLevelInfoUI {

	static run(prompt, callback) {
		const alertDiv= document.createElement("div");
		alertDiv.className= "overlay";
		alertDiv.innerHTML= `
								<div class="alert">
									<div class="grid-column">
										<div class="grid-row">
											ROUND
											<input id="round" type="number" autofocus/>
										</div>
										<div class="grid-row">
											LEFT
											<input name="side" type="radio" checked/>
										</div>
										<div class="grid-row">
											RIGHT
											<input name="side" type="radio"/>
										</div>
									</div>
									<div class="grid-column">
										<div id="no" class="btn black-shadow hvcenter">CANCEL</div>
										<div id="yes" class="btn btn-blue black-shadow hvcenter">SAVE</div>
									</div>
								</div>`;
		document.querySelector("BODY").appendChild(alertDiv);

		const buttons= alertDiv.querySelectorAll(".btn");

		const clickHandler= (evt) => {
			if(!evt.isTrusted)
				return;
			buttons.forEach((btn) => btn.removeEventListener("click", clickHandler));
			document.querySelector("BODY").removeChild(alertDiv);
			if(evt.target.id=="yes")
				callback(alertDiv.querySelector("INPUT").value);
		}

		buttons.forEach((btn) => btn.addEventListener("click", clickHandler));
	}

}