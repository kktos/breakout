import Scene from "./Scene.js";
import BackgroundLayer from "../layers/background.layer.js";
import DebuggerLayer from "../layers/debugger.layer.js";

export default class DebugScene extends Scene {

	constructor(gc, name, {background, ui}) {
		super(gc, name);

		this.addLayer(new BackgroundLayer(gc, background));
		this.receiver= new DebuggerLayer(gc, ui);
		this.addLayer(this.receiver);

	}

}
