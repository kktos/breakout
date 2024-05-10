import { System } from "./System.view.js";
import { BrickView } from "./bricks.view.js";
import { DebugView } from "./debug.view.js";
import { SpriteEditorView } from "./sprite-editor/spriteeditor.view.js";

export const SYSTEM= Symbol("System");

export const views= {
	[SYSTEM] : null,

	BrickView : BrickView,
	DebugView : DebugView,
	SpriteEditorView : SpriteEditorView,
};

export function initViews(ctx) {
	views[SYSTEM]= new System(ctx);
}