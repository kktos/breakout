import EventBuffer from "../events/EventBuffer.js";

function generateID() {
	let letters= [];
	for(let idx= 0; idx <5; idx++)
		letters.push(65 + Math.random()*26);
	return String.fromCharCode(...letters);
}
export default class Entity {

	constructor(resourceMgr, x, y, sheetFilename= null) {
		this.id= generateID();

		const m= String(this.constructor).match(/class ([a-zA-Z0-9_]+)/);
		this.class= m[1];

		this.pos= {x, y};
		this.size= {x: 0, y: 0};
		this.vel= {x: 0, y: 0};
		this.speed= 0;
		this.mass= 1;
		this.isSolid= true;
		this.previousVel= this.vel;
		this.previousMass= this.mass;

		// a ghost won't interact with the world - only with the paddle/player
		this.ghost= false;

		// how much killing it will be added to/substracted from the player score
		this.points= 0;

		this.lifetime= 0;
		this.anim= null;
		this.traits= new Map();
		this.events= new EventBuffer();

		this.currSprite= null;
		if(sheetFilename) {
			this.spritesheet= resourceMgr.get("sprite", sheetFilename);
		} else
			this.spritesheet= null;
	}

	get left() { return this.pos.x;	}
	get right() { return this.pos.x + this.size.x; }
	get top() { return this.pos.y; }
	get bottom() { return this.pos.y + this.size.y; }

	pause() {
		this.previousVel= this.vel;
		this.previousMass= this.mass;
		this.vel= {x: 0, y: 0};
		this.mass= 0;
	}

	go() {
		this.vel= this.previousVel;
		this.mass= this.previousMass;
	}

	addTrait(trait) {
        this.traits.set(trait.constructor, trait);
    }

	emit(name, ...args) {
		this.events.emit(name, ...args);
	}

	setSprite(name) {
		if(!this.spritesheet || !this.spritesheet.has(name))
			throw new Error(`no sprite ${name}`);

		this.currSprite= name;
		this.size= this.spritesheet.spriteSize(name);
	}

	setAnim(name) {
		if(!this.spritesheet || !this.spritesheet.hasAnim(name))
			throw new Error(`no animation ${name}`);

		this.currSprite= name;
		const frame= this.spritesheet.animations.get(name).frame(0);
		this.size= this.spritesheet.spriteSize(frame);
	}

    collides(gc, side, target) {

		if(!gc.entities)
			gc.entities= {};
		let debug= gc.entities[this.id];
		if(!debug) {
			gc.entities[this.id]= {};
			debug= gc.entities[this.id];
		}
		debug.collideID= generateID();

        this.traits.forEach(trait => trait.collides(gc, side, this, target));
    }

	update(gc) {
		if(!gc.entities)
			gc.entities= {};
		let debug= gc.entities[this.id];
		if(!debug) {
			gc.entities[this.id]= {};
			debug= gc.entities[this.id];
		}
		debug.updateID= generateID();

		this.traits.forEach(trait => trait.update(this, gc));
		this.lifetime+= gc.dt;
	}

    finalize() {
        this.traits.forEach(trait => trait.finalize(this));
        this.events.clear();
    }

	render(gc) {
	}
}