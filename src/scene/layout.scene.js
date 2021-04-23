import Scene from "./Scene.js";
import BackgroundLayer from "../layers/background.layer.js";
import DisplayLayer from "../layers/display.layer.js";

export default class LayoutScene extends Scene {

	constructor(gc, name, {background, layout, ui}) {
		super(gc, name);

		this.addLayer(new BackgroundLayer(gc, background));
		this.receiver= new DisplayLayer(gc, layout, ui);
		this.addLayer(this.receiver);

	}

}
