import Ball from "./ball.js";
import Paddle from "./paddle.js";
import Wall from "./wall.js";
import Brick from "./brick.js";
import  {intersectRect, collideRect, COLLISION} from "./math.js"

const canvas= document.getElementById("game");
canvas.width= 600;
canvas.height= 600;
const ctx= canvas.getContext("2d");

let entities= [];
let collisions= [];
let paddleX;
// let mouseX, screenX;

function clear() {
	ctx.fillStyle= "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function collisionSides(target, r2) {
	// what is the position of r2 compare to target ?
	let onLeft= ((target.left >= r2.left) && (target.left <= r2.right) | 0);
	let onRight= ((target.right >= r2.left) && (target.right <= r2.right) | 0) * 2;
	let onTop= ((target.top >= r2.top) && (target.top <= r2.bottom) | 0) * 4;
	let onBottom= ((target.bottom >= r2.top) && (target.bottom <= r2.bottom) | 0) * 8;

	let fullLeft= false;
	let fullRight= false;
	let fullTop= false;
	let fullBottom= false;
	let maxvalues= [];

	if(onLeft) {
		fullLeft= (target.top>r2.top) && (target.bottom<r2.bottom);
		maxvalues.push({k:onLeft, v:r2.right - target.left});
	}
	if(onRight) {
		fullRight= (target.top>r2.top) && (target.bottom<r2.bottom);
		maxvalues.push({k:onRight, v:target.right - r2.left});
	}
	if(onTop) {
		fullTop= (target.left>r2.left) && (target.right<r2.right);
		maxvalues.push({k:onTop, v:r2.bottom - target.top});
	}
	if(onBottom) {
		fullBottom= (target.left>r2.left) && (target.right<r2.right);
		maxvalues.push({k:onBottom, v:target.bottom - r2.top});
	}
	const {k,v}= maxvalues.reduce((curr, acc)=> curr.v>acc.v ? curr : acc, []);

	if(fullLeft || fullRight || fullTop || fullBottom ) {
		const rez= (fullLeft&&onLeft)|0 
					| (fullRight&&onRight)|0 
					| (fullTop&&onTop)|0 
					| (fullBottom&&onBottom)|0 ;
		return rez;
	}

	if(onLeft && target.vel.x<0){
		return onLeft;
	}
	if(onRight && target.vel.x>0){
		return onRight;
	}
	if(onTop && target.vel.y<0){
		return onTop;
	}
	if(onBottom && target.vel.y>0){
		return onBottom;
	}

	return onLeft | onRight | onTop | onBottom;
/*
	let fullLeft= false;
	let fullRight= false;
	let fullTop= false;
	let fullBottom= false;
	let maxvalues= [];

	if(left) {
		fullLeft= (r1.top>r2.top) && (r1.bottom<r2.bottom);
		maxvalues.push({k:left, v:r2.right - r1.left});
	}
	if(right) {
		fullRight= (r1.top>r2.top) && (r1.bottom<r2.bottom);
		maxvalues.push({k:right, v:r1.right - r2.left});
	}
	if(top) {
		fullTop= (r1.left>r2.left) && (r1.right<r2.right);
		maxvalues.push({k:top, v:r2.bottom - r1.top});
	}
	if(bottom) {
		fullBottom= (r1.left>r2.left) && (r1.right<r2.right);
		maxvalues.push({k:bottom, v:r1.bottom - r2.top});
	}

	if(fullLeft | fullRight | fullTop | fullBottom == 0) {
		const {k,v}= maxvalues.reduce((curr, acc)=> curr.v>acc.v ? curr : acc, []);
		return k;
	}

	return fullLeft&&left | fullRight&&right | fullTop&&top | fullBottom&&bottom;
*/	
	// return left | right | top | bottom;
}

function collides(target) {
	const removed= [];
	entities.forEach(entity => {
		// if((target!=entity) && intersectRect(target, entity)) {
		if(target == entity)
			return;

		const side= collideRect(entity, target);
		if(side != COLLISION.NONE) {

			// const colSide= collisionSides(target, entity);

			// const side= collideRect(entity, target);

			// collisions.push({
			// 	x: target.pos.x,
			// 	y: target.pos.y,
			// 	dx: target.size.x,
			// 	dy: target.size.y,
			// 	side: colSide
			// });
			target.collides(side, entity);

			if(entity.collides(side, target))
				removed.push(entity);
		}
	});

	removed.forEach(entity => {
		const idx= entities.indexOf(entity);
		entities.splice(idx, 1)
	});
}

function update(dt) {
	ball.update(dt);
	collides(ball);

	paddle.update(dt);
	collides(paddle);
}

function render(dt) {
	clear();
	ball.render(ctx);

	entities.forEach(entity => entity.render(ctx));
	collisions.forEach(rect => {
		ctx.strokeStyle= "#ff0000";
		ctx.strokeRect(rect.x, rect.y, rect.dx, rect.dy);
	});

	ctx.fillStyle= "#ffffff";
	ctx.font = '12px sans-serif';
	ctx.fillText(`${((1/dt)|0).toString().padStart(3, '0')} FPS`, 10, 15);	

	// ctx.font = '10px sans-serif';
	// ctx.fillText(`paddleX: ${paddleX|0} MOUSE=${mouseX|0} SCREEN=${screenX|0}`, 10, 600-15);	
}

// const MS_PER_UPDATE= 10;
// let lastTime;
// let lag= 0;

// function gameLoop(dt) {
// 	if(lastTime == undefined)
// 		lastTime= dt;
// 	const elapsed = dt - lastTime;
// 	lastTime= dt;
// 	lag += elapsed;
  
// 	while(lag >= MS_PER_UPDATE)
// 	{
// 	  update(dt/1000);
// 	  lag -= MS_PER_UPDATE;
// 	}

// 	render(elapsed);

// 	requestAnimationFrame(gameLoop);
// }

let lastTime= 0;
let acc= 0;
let tick= 0;
let inc= 1/120;
function gameLoop(dt) {
	acc = acc + (dt - lastTime) / 1000;
	while (acc > inc) {
		update(inc, tick);
		tick = tick + 1;
		acc = acc - inc;
	}

	// const elapsedTime= dt - lastTime;
	lastTime= dt;

	render(inc);
	requestAnimationFrame(gameLoop);
}

const ball= new Ball(200, 200, 0, 0, canvas.width, canvas.height);
const paddle= new Paddle(300, 550);

for(let idx= 0; idx<9*3; idx++) {
	const line= 1 + ((idx/9)|0);
	const col= 20 + (idx % 9)*64;
	const brick= new Brick(idx, col, 35 * line, Math.random()*10);
	entities.push(brick);
}

entities.push(paddle);


gameLoop(0);

document.addEventListener("mousemove", (e) => {
	// mouseX= e.offsetX;
	// screenX=document.body.offsetWidth;
	paddleX= canvas.width*e.clientX/document.body.offsetWidth;
	paddle.move(paddleX);
});

// document.addEventListener("mouseleave", () => {
// 	paddle.pos.x= 300 - paddle.size.x / 2;
// });