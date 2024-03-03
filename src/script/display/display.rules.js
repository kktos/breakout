import { tokens } from "../lexer.js";
import { layoutRules } from "./layout.rules.js";
import { uiRules } from "./ui.rules.js";

export function displayRules(parser) {
	const  $ = parser;

	$.RULE("displaySheet", () => {
		const sheet= { type: "display" };

		$.CONSUME(tokens.Display);

		sheet.name= $.CONSUME(tokens.StringLiteral).payload;

		$.CONSUME(tokens.OpenCurly);

		$.MANY(() => {
			const {name,value}= $.SUBRULE(parser.displayProps);
			sheet[name] = value;
		});

		$.CONSUME(tokens.CloseCurly);

		return sheet;
    });

    $.RULE("displayProps", () => {
		return $.OR([
			{ ALT:() => $.SUBRULE(parser.background) },
			{ ALT:() => $.SUBRULE(parser.showCursor) },
			{ ALT:() => $.SUBRULE(parser.font) },
			{ ALT:() => $.SUBRULE(parser.layout) },
			{ ALT:() => $.SUBRULE(parser.displayUI) },
			{ ALT:() => $.SUBRULE(parser.displayLayers) }
		]);
    });

    $.RULE("displayLayers", () => {
		$.CONSUME(tokens.Layers);

		$.CONSUME(tokens.OpenCurly);

		const result= { name:"layers", value: []};

		$.AT_LEAST_ONE(() => {
			result.value.push( $.CONSUME(tokens.Identifier).image );
		});

		$.CONSUME(tokens.CloseCurly);

		return result;
    });	

	layoutRules(parser);
	uiRules(parser);

}