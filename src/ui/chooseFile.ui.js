
export default class ChooseFileUI {


	static runDialog(files, callback) {
		const div= document.createElement("div");
		div.className= "overlay";
		div.innerHTML= `<div class="alert choose">
							<div class="list">
								${files.map(file=>`<div key="${file}" class="list-item">${file.replace(/^level:/,'')}</div>`).join("")}
							</div>
							<div class="grid-column">
								<div id="no" class="btn btn-white black-shadow hvcenter">CANCEL</div>
								<div id="yes" class="btn black-shadow hvcenter">CHOOSE</div>
							</div>
						</div>`;
		document.querySelector("BODY").appendChild(div);

		let selected= null;
		const items= div.querySelectorAll(".list-item");
		const buttons= div.querySelectorAll(".btn");

		const btnEventsHandler= (evt) => {
			if(!evt.isTrusted)
				return;

			if(evt.target.id == "yes" && !selected)
				return;

			buttons.forEach((btn) => btn.removeEventListener("click", btnEventsHandler));
			items.forEach((item) => item.removeEventListener("click", itemsEventsHandler));

			document.querySelector("BODY").removeChild(div);
			if(evt.target.id=="yes")
				callback(selected.attributes.getNamedItem("key").value);
		}
		buttons.forEach((btn) => btn.addEventListener("click", btnEventsHandler));
		
		const itemsEventsHandler= (evt) => {
			if(!evt.isTrusted)
				return;

			if(selected)
				selected.className= "list-item";
			selected= evt.target;
			selected.className= "list-item selected";
		}
		items.forEach((item) => item.addEventListener("click", itemsEventsHandler));
	}

	static choose(callback) {
		let keys= [];
		for(let idx= 0; idx < localStorage.length; idx++)
			keys.push(localStorage.key(idx));

		keys= keys.filter(key => key.match(/^level/)).sort();
		
		ChooseFileUI.runDialog(keys, callback);
	}


	// static ask(text, yes, no, callback) {
	// 	const alertDiv= document.createElement("div");
	// 	alertDiv.className= "overlay";
	// 	alertDiv.innerHTML= `
	// 							<div class="alert">
	// 								${text}
	// 								<div class="grid-column">
	// 									<div id="no" class="btn btn-white black-shadow hvcenter">${no}</div>
	// 									<div id="yes" class="btn black-shadow hvcenter">${yes}</div>
	// 								</div>
	// 							</div>`;
	// 	document.querySelector("BODY").appendChild(alertDiv);

	// 	const buttons= alertDiv.querySelectorAll(".btn");

	// 	const eventsHandler= (evt) => {
	// 		if(!evt.isTrusted)
	// 			return;
	// 		if(!["yes", "no"].includes(evt.target.id))
	// 			return;
	// 		buttons.forEach((btn) => btn.removeEventListener("click", eventsHandler));
	// 		document.querySelector("BODY").removeChild(alertDiv);
	// 		if(evt.target.id=="yes")
	// 			callback();
	// 	}

	// 	buttons.forEach((btn) => btn.addEventListener("click", eventsHandler));
	// }

}