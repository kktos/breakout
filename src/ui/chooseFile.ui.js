import LocalDB from "../utils/storage.util.js";
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export  default class ChooseFileUI {


	static runDialog(files, callback) {
		const div= document.createElement("div");
		div.className= "overlay";
		div.innerHTML= `<div class="alert choose">
							<div class="list">
								${files.map(file=>`<div key="${file.key}" class="list-item">${file.name}</div>`).join("")}
							</div>
							<div class="grid-column">
								<div id="no" class="btn btn-white black-shadow hvcenter">CANCEL</div>
								<div id="yes" class="btn btn-blue black-shadow hvcenter">CHOOSE</div>
							</div>
						</div>`;
		document.querySelector("BODY").appendChild(div);

		let selected= null;
		const items= div.querySelectorAll(".list-item");
		const buttons= div.querySelectorAll(".btn");

		const closeDialog= (withBtn) => {
			document.querySelector("BODY").removeChild(div);
			if(withBtn==="yes")
				callback(selected.attributes.getNamedItem("key").value);
		}

		const btnEventsHandler= (evt) => {
			if(!evt.isTrusted)
				return;
			if(evt.target.id === "yes" && !selected)
				return;
			closeDialog(evt.target.id);
		}
		// buttons.forEach((btn) => btn.addEventListener("click", btnEventsHandler));
		for (let idx = 0; idx < buttons.length; idx++) {
			buttons[idx].addEventListener("click", btnEventsHandler);
		}
		
		const selectItemHandler= (evt) => {
			if(!evt.isTrusted)
				return;

			if(selected)
				selected.className= "list-item";
			selected= evt.target;
			selected.className= "list-item selected";
		}
		const chooseItemHandler= (evt) => {
			if(!evt.isTrusted)
				return;
			closeDialog("yes");
		}
		// items.forEach((item) => item.addEventListener("click", selectItemHandler));
		// items.forEach((item) => item.addEventListener("dblclick", chooseItemHandler));
		for (let idx = 0; idx < items.length; idx++) {
			const item = items[idx];
			item.addEventListener("click", selectItemHandler);
			item.addEventListener("dblclick", chooseItemHandler);
		}
	}

	static choose(theme, callback) {
		ChooseFileUI.runDialog(LocalDB.levels(theme), callback);
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