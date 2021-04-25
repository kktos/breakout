
export default class LocalDB {

	static levels(theme) {
		let keys= [];
		for(let idx= 0; idx < localStorage.length; idx++)
			keys.push(localStorage.key(idx));
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

}
