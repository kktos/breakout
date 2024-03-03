import { tokens } from "../lexer.js";

export function repeatRules(parser) {
	const  $ = parser;

    $.RULE("layoutRepeat", (options, isMenuItem) => {
		$.CONSUME(tokens.Repeat);

		let result= { type: "repeat", step:{pos:[]} }

		const parms= $.SUBRULE(parser.layoutRepeatParms, { ARGS: [options, isMenuItem] });

		$.ACTION(() => {
			if(parms.count === undefined || parms.step === undefined)
				throw new TypeError(`Missing required parm (count, step) for Repeat : ${ JSON.stringify(parms)}`);
		});

		result= {...result, ...parms};

		$.CONSUME(tokens.OpenCurly);

		result.items= $.SUBRULE(parser.layoutRepeatItems, { ARGS: [options, isMenuItem] });

		$.CONSUME(tokens.CloseCurly);

		return result;
    });

	$.RULE("layoutRepeatParms", () => {
		const parms= {};
		$.AT_LEAST_ONE(() => {
			const parm= $.SUBRULE(parser.layoutRepeatParm);
			if(parms[parm[0]])
				throw new TypeError(`Duplicate parm for Repeat : ${parm[0]}`);
			parms[parm[0]]= parm[1];
		});
		return parms;
    });

	$.RULE("layoutRepeatParm", () => {
		let value;

		const name= $.OR([
			{ ALT: () => $.CONSUME(tokens.Identifier) },
			{ ALT: () => $.CONSUME(tokens.Step) },
		]).image?.toLowerCase();

		$.CONSUME(tokens.Colon);

		switch(name) {
			case "count":
				value= $.SUBRULE(parser.number);
				break;
			case "var":
				value= $.CONSUME(tokens.Identifier).image;
				break;
			case "step":
				value= $.SUBRULE(parser.layoutRepeatParmStep);
				break;

			default:
				$.ACTION(() => { throw new TypeError(`Invalid parm for Repeat : ${name}`); });
		}

		return [ name , value ];
    });

	$.RULE("layoutRepeatParmStep", () => {
		$.CONSUME(tokens.OpenCurly);
		const result = $.SUBRULE(parser.parm_at);
		$.CONSUME(tokens.CloseCurly);
		return { pos : result };
    });


	$.RULE("layoutRepeatItems", (options, isMenuItem) => {
		const items= [];
		$.AT_LEAST_ONE(() => {
			const item= $.OR([
				{ ALT: () => $.SUBRULE(parser.layoutText, { ARGS: [options, isMenuItem] }) },
				{ ALT: () => $.SUBRULE(parser.layoutMenuItem, { ARGS: [options] }) },
			])
			items.push( item );
		});
		return items;
    });
}

/*

	repeat count:12 var:idx step:{ at:40,0 } {

		text "%points.$idx%" at:60,10

		// item action:{ selectBrick("$idx") } {
		// 	text "%points.$idx%" at:60,10
		// 	sprite "%BrickEntity.SPRITES.$idx%" at:60,26
		// }
	}

*/