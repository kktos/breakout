import { tokens } from "../lexer.js";
import { forRules } from "./for.rules.js";
import { menuRules } from "./menu.rules.js";
import { rectRules } from "./rect.rules.js";
import { repeatRules } from "./repeat.rules.js";
import { setRules } from "./set.rules.js";
import { spriteRules } from "./sprite.rules.js";
import { textRules } from "./text.rules.js";
import { viewRules } from "./view.rules.js";

const NUMBER= 1;
const ALIGN= 2;
const COLOR= 3;

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
		let propType= 0;
		const name= $.OR([
			{ ALT: () => { propType= ALIGN; return $.CONSUME(tokens.Align); } },
			{ ALT: () => { propType= NUMBER; return $.CONSUME(tokens.Size); } },
			{ ALT: () => { propType= NUMBER; return $.CONSUME(tokens.Zoom); } },
			{ ALT: () => { propType= COLOR; return $.CONSUME(tokens.Color); } },
		]).image;

		let isParm= false;
		$.OPTION(() => {
			$.CONSUME(tokens.Colon);
			isParm= true;
		});

		let valueType= 0;
		let value;
		$.OR2([
			{ ALT: () => { valueType= NUMBER; value= $.SUBRULE(parser.number); } },
			{ ALT: () => { valueType= COLOR; value= $.SUBRULE(parser.htmlColor); } },
			{ ALT: () => { valueType= ALIGN; $.CONSUME(tokens.Left); value= 1; } },
			{ ALT: () => { valueType= ALIGN; $.CONSUME(tokens.Right); value= 3; } },
			{ ALT: () => { valueType= ALIGN; $.CONSUME(tokens.Center); value= 2; } }
		])

		$.ACTION(() => {
			switch(propType) {
				case ALIGN:
					if(valueType!==NUMBER && valueType !== ALIGN)
						throw new TypeError(`Invalid value ${value} for ${name}`);
					break;
				case COLOR:
					if(valueType!==COLOR)
						throw new TypeError(`Invalid value ${value} for ${name}`);
					break;
				case NUMBER:
					if(valueType!==NUMBER)
						throw new TypeError(`Invalid value ${value} for ${name}`);
					break;
			}
		});

		return { name, value, isParm };
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