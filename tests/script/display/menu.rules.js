import { tokens } from "../lexer.js";

export function menuRules(parser) {
	const  $ = parser;

    $.RULE("layoutMenu", (options) => {
		const result= { type: "menu", items: [] };

		$.CONSUME(tokens.Menu);

		$.CONSUME(tokens.OpenCurly);

		$.OPTION(() => {
			result.selection= $.SUBRULE(parser.layoutMenuSelection);
		});

		result.items= $.SUBRULE(parser.layoutMenuItems, { ARGS: [options] });

		$.CONSUME(tokens.CloseCurly);

		return result;
    });

	$.RULE("layoutMenuItems", (options) => {
		$.CONSUME(tokens.Items);
		$.CONSUME(tokens.OpenCurly);

		const items= [];
		$.AT_LEAST_ONE(() => {
			$.OR([
				{ ALT: () => { items.push( $.SUBRULE(parser.layoutFor, { ARGS: [options, true] }) ); } },
				{ ALT: () => { items.push( $.SUBRULE(parser.layoutRepeat, { ARGS: [options, true] }) ); } },
				{ ALT: () => { items.push( $.SUBRULE(parser.layoutText, { ARGS: [options, true] }) ); } },
				{ ALT: () => { items.push( $.SUBRULE(parser.layoutMenuItem, { ARGS: [options] }) ); } },
			]);
		});

		$.CONSUME(tokens.CloseCurly);

		return items;
    });

	$.RULE("layoutMenuItem", (options) => {
		$.CONSUME(tokens.Item);

		const result= {
			type: "group",
			action: $.SUBRULE(parser.layoutAction),
			items: []
		};

		$.CONSUME(tokens.OpenCurly);

		$.AT_LEAST_ONE(() => {
			const item= $.OR([
				{ ALT: () => $.SUBRULE(parser.layoutText, { ARGS: [options] }) },
				{ ALT: () => $.SUBRULE(parser.layoutSprite, { ARGS: [options] }) },
			]);
			result.items.push( item );
		});

		$.CONSUME(tokens.CloseCurly);

		return result;
	});

	$.RULE("layoutMenuSelection", () => {
		$.CONSUME(tokens.Selection);
		$.CONSUME(tokens.OpenCurly);

		const selection= {};

		$.AT_LEAST_ONE(() => {
			const {name,value}= $.OR([
				{ ALT: () => $.SUBRULE(parser.layoutMenuSelectionSprite) },
				{ ALT: () => $.SUBRULE(parser.background) },
				{ ALT: () => $.SUBRULE(parser.layoutMenuSelectionColor) },
			]);
			selection[name]= value;
		});

		$.CONSUME(tokens.CloseCurly);

		return selection;
    });

	$.RULE("layoutMenuSelectionColor", () => {
		$.CONSUME(tokens.Color);
		return {name: "color", value: $.SUBRULE(parser.htmlColor)};
	});

	$.RULE("layoutMenuSelectionSprite", () => {
		const name= $.OR([
			{ ALT : () => $.CONSUME(tokens.Left).image },
			{ ALT : () => $.CONSUME(tokens.Right).image	}
		]);
		const value= $.CONSUME(tokens.StringLiteral).payload;
		return {name, value};
	});

}