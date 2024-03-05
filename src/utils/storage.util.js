import ENV from "../env.js";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export  default class LocalDB {

	static keys() {
		const keys= [];
		for(let idx= 0; idx < localStorage.length; idx++)
			keys.push(localStorage.key(idx));
		return keys;
	}

	static levels(theme) {
		let keys= LocalDB.keys();
		const re= new RegExp(`^\./levels/${theme}/`);
		keys= keys.filter(key => key.match(re)).sort();
		return keys.map(key => ({key, name: key.replace(/^\.\/levels\//,'')}));
	}

	static saveLevel(theme, name, data) {
		localStorage.setItem(`./levels/${theme}/${name}`, JSON.stringify(data));
	}

	static loadResource(name) {
		return JSON.parse(localStorage.getItem(name));
	}

	static currentPlayer() {
		return {
			score: localStorage.getItem("player:score")|0,
			lives: localStorage.getItem("player:lives")|0,
			name: localStorage.getItem("player:name"),
			round: localStorage.getItem("player:round")|0,
			highscore: LocalDB.highscore() //localStorage.getItem("player:highscore")|0
		}
	}

	static newPlayer(name) {
		localStorage.setItem("player:score", 0);
		localStorage.setItem("player:lives", 3);
		localStorage.setItem("player:name", name);
		localStorage.setItem("player:round", -1);
	}

	static updateName(name) {
		localStorage.setItem("player:name", name);
	}
	static updateLives(lives) {
		localStorage.setItem("player:lives", lives|0);
	}
	static updateScore(score) {
		localStorage.setItem("player:score", score|0);
	}
	static updateRound(round) {
		localStorage.setItem("player:round", round|0);
	}

	static highscores() {
		return JSON.parse(localStorage.getItem("player:highscores")) || [];
	}

	static highscore() {
		const scores= LocalDB.highscores();
		scores?.sort((a,b) => a.score < b.score ? 1:-1);
		return scores?.[0].score ?? 0;
	}

	static isPlayerScoreGoodEnough() {
		const lastGame= LocalDB.currentPlayer();
		const highscores= LocalDB.highscores();
		return !highscores.length || highscores.length<ENV.HIGHSCORES_COUNT || highscores.some(i => i.score<lastGame.score);
	}

	static updateHighscores() {
		const lastGame= LocalDB.currentPlayer();
		let highscores= LocalDB.highscores();
		highscores.push({name:lastGame.name, round:lastGame.round, score:lastGame.score});
		highscores.sort((a,b) => a.score < b.score ? 1:-1);
		highscores= highscores.slice(0, ENV.HIGHSCORES_COUNT);
		localStorage.setItem("player:highscore", highscores[highscores.length-1].score);
		localStorage.setItem("player:highscores", JSON.stringify(highscores));
	}
}
