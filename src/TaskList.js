
export default class TaskList {

	constructor() {
		this.tasks= [];
		this.taskHandlers= new Map();
	}

	addTask(name, ...args) {
		this.tasks.push({name, args});
	}

	onTask(name, handler) {
		this.taskHandlers.set(name, handler);
	}

	processTasks() {
		if(!this.tasks.length)
			return;
		this.tasks.forEach(({name, args}) => {
			const handler= this.taskHandlers.get(name);
			if(handler)
				handler(...args);
			else
				console.log("----- TASK: no handler for", name.toString());
		});
		this.tasks.length= 0;
	}	 


}