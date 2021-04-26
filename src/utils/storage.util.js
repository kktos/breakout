
export default class LocalDB {

	static keys() {
		let keys= [];
		for(let idx= 0; idx < localStorage.length; idx++)
			keys.push(localStorage.key(idx));
		return keys;
	}

	static levels(theme) {
		let keys= LocalDB.keys();
		const re= new RegExp("^level:"+theme);
		keys= keys.filter(key => key.match(re)).sort();
		return keys.map(key => ({key, name: key.replace(/^level:/,'')}));
	}

	static saveLevel(theme, name, data) {
		localStorage.setItem(`level:${theme}/${name}`, JSON.stringify(data));
	}

	static loadLevel(theme, name) {
		const key= name ? `level:${theme}/${name}` : theme;
		return JSON.parse(localStorage.getItem(key));
	}

	static currentPlayer() {
		return {
			score: localStorage.getItem("score")|0,
			lives: localStorage.getItem("lives")|0,
			name: localStorage.getItem("name"),
			highscore: localStorage.getItem("highscore")|0
		}
	}

	static newPlayer(name) {
		localStorage.setItem("score", 0);
		localStorage.setItem("lives", 3);
		localStorage.setItem("name", name);
	}

	static updateLives(lives) {
		localStorage.setItem("lives", lives);
	}

	static updateScore(score) {
		localStorage.setItem("score", score);
	}

	static highscores() {
		return JSON.parse(localStorage.getItem("highscores")) || [];;
	}

	static updateHighscores() {
		const lastGame= LocalDB.currentPlayer();
		let highscores= LocalDB.highscores();
		highscores.push({name:lastGame.name, score:lastGame.score});
		highscores.sort((a,b) => a.score < b.score ? 1:-1);
		highscores= highscores.slice(0,10);
		localStorage.setItem("highscore", highscores[highscores.length-1].score);
		localStorage.setItem("highscores", JSON.stringify(highscores));
	}
}
