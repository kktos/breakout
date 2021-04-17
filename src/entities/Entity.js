import EventBuffer from "../EventBuffer.js";

export default class Entity {

	constructor(resourceMgr, x, y, sheetFilename= null) {
		this.pos= {x, y};
		this.size= {x: 0, y: 0};
		this.vel= {x: 0, y: 0};
		this.speed= 0;
		this.previousVel= {x: 0, y: 0};

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
		this.vel= {x: 0, y: 0};
	}

	go() {
		this.vel= this.previousVel;
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

    collides(gameContext, side, target) {
        this.traits.forEach(trait => trait.collides(gameContext, side, this, target));
    }

	update(gameContext) {
		this.traits.forEach(trait => trait.update(this, gameContext));
		this.lifetime+= gameContext.dt;
	}

    finalize() {
        this.traits.forEach(trait => trait.finalize(this));
        this.events.clear();
    }

	render(gameContext) {
	}
}