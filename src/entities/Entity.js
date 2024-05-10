import EventBuffer from "../events/EventBuffer.js";
import {generateID} from "../utils/id.util.js";

export default class Entity {

	constructor(resourceMgr, x, y, sheetFilename= null) {
		const m= String(this.constructor).match(/class ([a-zA-Z0-9_]+)/);
		this.class= m[1];
		this.id= generateID();

		this._pos= {x, y};
		this.size= {x: 0, y: 0};
		this.vel= {x: 0, y: 0};
		this.speed= 0;
		this.mass= 1;
		this.isFixed= true;
		this.isSolid= true;
		this.previousVel= this.vel;
		this.previousMass= this.mass;
		this.previousBbox= {left:x, top:y, right: 0, bottom: 0};

		// a ghost won't interact with the world - only with the paddle/player
		this.ghost= false;

		// how much killing it will be added to/substracted from the player score
		this.points= 0;

		this.lifetime= 0;
		this.anim= null;
		this.events= new EventBuffer();
		this.traits= new Map();
		this.collidesTraits= [];
		this.updateTraits= [];

		this.currSprite= null;
		if(sheetFilename) {
			this.spritesheet= resourceMgr.get("sprite", sheetFilename);
		} else
			this.spritesheet= null;
	}

	get left() { return this._pos.x;	}
	get right() { return this._pos.x + this.size.x; }
	get top() { return this._pos.y; }
	get bottom() { return this._pos.y + this.size.y; }
	get width() { return this.size.x; }
	get height() { return this.size.y; }

	set left(x) { this.previousBbox.left= this._pos.x; this._pos.x= x; }
	set top(y) { this.previousBbox.top= this._pos.y; this._pos.y= y; }
	set right(x) { this.previousBbox.left= this._pos.x; this._pos.x= x - this.size.x; }
	set bottom(y) { this.previousBbox.top= this._pos.y; this._pos.y= y - this.size.y; }

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
		if(trait.collides)	
			this.collidesTraits.push(trait);
		if(trait.update)	
			this.updateTraits.push(trait);
    }

	emit(name, ...args) {
		this.events.emit(name, ...args);
	}

	setSprite(name) {
		if(!this.spritesheet || !this.spritesheet.has(name)) {
			throw new Error(`no sprite ${name}`);
		}

		this.currSprite= name;
		this.size= this.spritesheet.spriteSize(name);
	}

	setAnim(name, opt= { paused: false }) {
		if(!this.spritesheet || !this.spritesheet.hasAnim(name))
			throw new Error(`no animation ${name}`);

		this.currSprite= name;
		const anim= this.spritesheet.animations.get(name);
		const frame= anim.frame(0);
		this.size= this.spritesheet.spriteSize(frame);
		if(opt?.paused===true)
			anim.pause();
		return anim;
	}

    collides(gc, side, target) {

		// if(!gc.entities)
		// 	gc.entities= {};
		// let debug= gc.entities[this.id];
		// if(!debug) {
		// 	gc.entities[this.id]= {};
		// 	debug= gc.entities[this.id];
		// }
		// debug.collideID= generateID();

		const traits= this.collidesTraits;
		for(let idx= 0; idx<traits.length; idx++)
			traits[idx].collides(gc, side, this, target);

        // this.traits.forEach(trait => trait.collides(gc, side, this, target));
    }

	update(gc) {
		// if(!gc.entities)
		// 	gc.entities= {};
		// let debug= gc.entities[this.id];
		// if(!debug) {
		// 	gc.entities[this.id]= {};
		// 	debug= gc.entities[this.id];
		// }
		// debug.updateID= generateID();

		const traits= this.updateTraits;
		for(let idx= 0; idx<traits.length; idx++)
			traits[idx].update(this, gc);

		// this.traits.forEach(trait => trait.update(this, gc));

		this.lifetime+= gc.dt;
	}

    finalize() {
		// biome-ignore lint/complexity/noForEach: it's a Map; can't access with map[idx]
		this.traits.forEach(trait=>trait.finalize(this));
        this.events.clear();
    }

	render(gc) {
		const ctx= gc.viewport.ctx;
		ctx.strokeColor = "gray";
		ctx.strokeRect(this.left, this.top, this.size.x, this.size.y);
		ctx.beginPath();
		ctx.moveTo(this.left, this.top);
		ctx.lineTo(this.right, this.bottom);
		ctx.moveTo(this.right, this.top);
		ctx.lineTo(this.left, this.bottom);
		ctx.stroke();
	}
}