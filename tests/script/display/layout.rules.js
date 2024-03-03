import { tokens } from "../lexer.js";
import { forRules } from "./for.rules.js";
import { menuRules } from "./menu.rules.js";
import { rectRules } from "./rect.rules.js";
import { repeatRules } from "./repeat.rules.js";
import { setRules } from "./set.rules.js";
import { spriteRules } from "./sprite.rules.js";
import { textRules } from "./text.rules.js";
import { viewRules } from "./view.rules.js";

export function layoutRules(parser) {
	const  $ = parser;

    $.RULE("layout", () => {
		$.CONSUME(tokens.Layout);

		$.CONSUME(tokens.OpenCurly);

		const layout= [];
		const options= {};
		let lastStatement= null;

		$.MANY(() => {

			const optionRule= () => {
				const {name, value, isParm}= $.SUBRULE(parser.textSpriteProps);
				if(isParm) {
					if(!lastStatement)
						throw new TypeError("Invalid parm here");
					lastStatement[name]= value;
				} else {
					options[name] = value;
				}
			};

			const statementRule= () => {
				lastStatement= $.SUBRULE(parser.layoutStatement, { ARGS: [options] });
				layout.push( lastStatement );
			};

			$.OR([
				{ ALT: optionRule },
				{ ALT: statementRule },
			]);

		});

		$.CONSUME(tokens.CloseCurly);

		return { name: "layout", value: layout };
    });

    $.RULE("layoutStatement", (options) => {
		return $.OR([
			{ ALT:() => $.SUBRULE(parser.layoutText, { ARGS: [options] }) },
			{ ALT:() => $.SUBRULE(parser.layoutSprite, { ARGS: [options] }) },
			{ ALT:() => $.SUBRULE(parser.layoutMenu, { ARGS: [options] }) },
			{ ALT:() => $.SUBRULE(parser.layoutSet, { ARGS: [options] }) },
			{ ALT:() => $.SUBRULE(parser.layoutFor, { ARGS: [options] }) },
			{ ALT:() => $.SUBRULE(parser.layoutRepeat, { ARGS: [options] }) },
			{ ALT:() => $.SUBRULE(parser.layoutView, { ARGS: [options] }) },
			{ ALT:() => $.SUBRULE(parser.layoutRect, { ARGS: [options] }) },
		]);
    });

    $.RULE("textSpriteProps", () => {
		let isColor= false;
		let isParm= false;
		const name= $.OR([
			{ ALT: () => $.CONSUME(tokens.Align) },
			{ ALT: () => $.CONSUME(tokens.Size) },
			{ ALT: () => $.CONSUME(tokens.Zoom) },
			{ ALT: () => { const color= $.CONSUME(tokens.Color); isColor= true; return color; } },
		]).image;

		$.OPTION(() => {
			$.CONSUME(tokens.Colon);
			isParm= true;
		});

		return { name, value: isColor ? $.SUBRULE(parser.htmlColor) : $.SUBRULE(parser.number), isParm };
    });

	$.RULE("parm_at", () => {
		$.CONSUME(tokens.At);
		$.CONSUME(tokens.Colon);
		const x= $.SUBRULE(parser.number);
		$.CONSUME(tokens.Comma);
		const y= $.SUBRULE2(parser.number);
		return [ x, y ];
	});


	textRules(parser);
	spriteRules(parser);
	menuRules(parser);
	setRules(parser);
	forRules(parser);
	repeatRules(parser);
	viewRules(parser);
	rectRules(parser);
}