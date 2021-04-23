import Scene from "./Scene.js";
import BackgroundLayer from "../layers/background.layer.js";
import DashboardLayer from "../layers/dashboard.layer.js";
import EntitiesLayer from "../layers/entities.layer.js";
import EditorLayer from "../layers/editor.layer.js";

export default class EditorScene extends Scene {

	constructor(gc, name, {background, template}) {
		super(gc, name);

		const bkgndLayer= new BackgroundLayer(gc, background);
		this.addLayer(bkgndLayer);

		const entities= [];
		this.addLayer(new EntitiesLayer(gc, entities));
		this.addLayer(new DashboardLayer(gc));
		this.receiver= new EditorLayer(gc, entities, template, bkgndLayer);
		this.addLayer(this.receiver);

	}

}
