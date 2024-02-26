import BackgroundLayer from "../layers/background.layer.js";
import DashboardLayer from "../layers/dashboard.layer.js";
import EditorLayer from "../layers/editor.layer.js";
import EntitiesLayer from "../layers/entities.layer.js";
import Scene from "./Scene.js";

export default class EditorScene extends Scene {

	constructor(gc, name, {background, template, ui}) {
		super(gc, name);

		this.addLayer(new BackgroundLayer(gc, background));

		const entities= [];
		this.addLayer(new EntitiesLayer(gc, entities));
		this.addLayer(new DashboardLayer(gc));
		this.receiver= new EditorLayer(gc, entities, template, ui);
		this.addLayer(this.receiver);

	}
	
}
