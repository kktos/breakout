import { System } from "./System.view.js";
import { BrickView } from "./bricks.view.js";
import { DebugView } from "./debug.view.js";

export const SYSTEM= Symbol("System");

export const views= {
	[SYSTEM] : null,

	BrickView : BrickView,
	DebugView : DebugView,
};

export function initViews(gc) {
	views[SYSTEM]= new System(gc);
}