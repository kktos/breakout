import Ball from "./ball.js";
import Paddle from "./paddle.js";
import Wall from "./wall.js";
import Brick from "./brick.js";
import  {collideRect, COLLISION} from "./math.js"

const canvas= document.getElementById("game");
canvas.width= 600;
canvas.height= 600;
const ctx= canvas.getContext("2d");

let entities= [];
let collisions= [];
let paddleX;

function clear() {
	ctx.fillStyle= "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function collides(target) {
	const removed= [];
	entities.forEach(entity => {
		if(target == entity)
			return;

		const side= collideRect(entity, target);
		if(side != COLLISION.NONE) {
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
	paddleX= canvas.width*e.clientX/document.body.offsetWidth;
	paddle.move(paddleX);
});
