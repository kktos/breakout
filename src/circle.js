
/*

const circle = {
  x: 200,
  y: 200,
  size: 30,
  dx: 5,
  dy: 4
};

function drawCircle() {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);
  ctx.fillStyle = 'purple';
  ctx.fill();
}

let lastTime= 0;
let acc= 0;
let tick= 0;
let inc= 1/90;
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

function update(elapsedTime) {
	// change position
	circle.x += circle.dx;
	circle.y += circle.dy;

	// Detect side walls
	if (circle.x + circle.size > canvas.width || circle.x - circle.size < 0) {
		circle.dx *= -1;
	}

	// Detect top and bottom walls
	if (circle.y + circle.size > canvas.height || circle.y - circle.size < 0) {
		circle.dy *= -1;
	}
}

function render(elapsedTime) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawCircle();

	ctx.fillStyle= "white";
	ctx.font = '12px sans-serif';
	// ctx.fillText(`${((1000/elapsedTime)|0).toString().padStart(3, '0')} FPS`, 5, 10);	
	ctx.fillText(`${1/elapsedTime} FPS`, 5, 12);	
}

gameLoop(0);
*/