
export default class AlertUI {

	static ask(text, yes, no, callback) {
		const alertDiv= document.createElement("div");
		alertDiv.className= "overlay";
		alertDiv.innerHTML= `
								<div class="alert">
									${text}
									<div class="grid-column">
										<div id="no" class="btn btn-white black-shadow hvcenter">${no}</div>
										<div id="yes" class="btn black-shadow hvcenter">${yes}</div>
									</div>
								</div>`;
		document.querySelector("BODY").appendChild(alertDiv);

		const buttons= alertDiv.querySelectorAll(".btn");

		const eventsHandler= (evt) => {
			if(!evt.isTrusted)
				return;
			if(!["yes", "no"].includes(evt.target.id))
				return;
			buttons.forEach((btn) => btn.removeEventListener("click", eventsHandler));
			document.querySelector("BODY").removeChild(alertDiv);
			if(evt.target.id=="yes")
				callback();
		}

		buttons.forEach((btn) => btn.addEventListener("click", eventsHandler));
	}

}