
export default class EnterTextUI {

	static run(prompt, callback) {
		const alertDiv= document.createElement("div");
		alertDiv.className= "overlay";
		alertDiv.innerHTML= `
								<div class="alert">
									${prompt}
									<input id="name" type="text" autofocus style="text-align:left"/>
									<div class="grid-column">
										<div id="no" class="btn black-shadow hvcenter">CANCEL</div>
										<div id="yes" class="btn black-shadow hvcenter">OK</div>
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