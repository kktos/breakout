import Scene from "./scene.js";
import BackgroundLayer from "../layers/background.layer.js";
import DebuggerLayer from "../layers/debugger.layer.js";

export default class DebugScene extends Scene {

	constructor(gc, name, {background, ui}) {
		super(gc, name);

		const bkgndLayer= new BackgroundLayer(gc, background);
		this.receiver= new DebuggerLayer(gc, ui, bkgndLayer);
		this.addLayer(bkgndLayer);
		this.addLayer(this.receiver);

	}

}
