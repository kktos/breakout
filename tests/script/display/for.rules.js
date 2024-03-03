import { tokens } from "../lexer.js";

export function forRules(parser) {
	const  $ = parser;

    $.RULE("layoutFor", (options, isMenuItem) => {
		$.CONSUME(tokens.For);

		const result= { type: "repeat", step:{pos:[]} }

		$.OPTION(() => {
			result.var= $.CONSUME(tokens.StringLiteral).payload;
		});

		const range= $.SUBRULE(parser.layoutForTwoNumber);
		result.count= range[1];

		$.CONSUME(tokens.OpenCurly);

		$.CONSUME(tokens.Step);
		result.step.pos= $.SUBRULE2(parser.layoutForTwoNumber);

		result.items= $.SUBRULE(parser.layoutForItems, { ARGS: [options, isMenuItem] });

		$.CONSUME(tokens.CloseCurly);

		return result;
    });

	$.RULE("layoutForTwoNumber", () => {
		const a= $.SUBRULE(parser.number);
		$.CONSUME(tokens.Comma);
		const b= $.SUBRULE2(parser.number);
		return [a,b];
    });

	$.RULE("layoutForItems", (options, isMenuItem) => {
		$.CONSUME(tokens.Items);
		$.CONSUME(tokens.OpenCurly);

		const items= [];
		$.AT_LEAST_ONE(() => {
			items.push( $.SUBRULE(parser.layoutText, { ARGS: [options, isMenuItem] }) );
		});

		$.CONSUME(tokens.CloseCurly);

		return items;
    });
}

/*

	for "idx" 0,10 {
		step 0,40
		items {
			text "%positions.$idx%" at:90,190
			text "%highscores.$idx.score%" at:250,190
			text "%highscores.$idx.round%" at:450,190
			text "%highscores.$idx.name%" at:580,190
		}
	}

*/