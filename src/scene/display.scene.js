import BackgroundLayer from "../layers/background.layer.js";
import DisplayLayer from "../layers/display.layer.js";
import { layers } from "../layers/layers.js";
import Scene from "./Scene.js";

export default class DisplayScene extends Scene {

	constructor(gc, name, sheet) {
		super(gc, name);

		this.addLayer(new BackgroundLayer(gc, sheet.background));
		if(sheet.layers) {
			for (let idx = 0; idx < sheet.layers.length; idx++) {
				const layerName = sheet.layers[idx];
				if(!layers[layerName])
					throw new TypeError(`Unknown Layer ${layerName}`);

				this.addLayer( new layers[layerName](gc) );
			}
		}
		this.receiver= new DisplayLayer(gc, sheet);
		this.addLayer(this.receiver);

	}

}
