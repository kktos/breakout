
export function intersectRect(r1, r2) {
	return !(r2.left > r1.right || 
			r2.right < r1.left || 
			r2.top > r1.bottom ||
			r2.bottom < r1.top);
}

export const COLLISION = {
	NONE: Symbol("none"),
	LEFT: Symbol("left"),
	RIGHT: Symbol("right"),
	TOP: Symbol("top"),
	BOTTOM: Symbol("bottom"),
};

export function collideRect(r1, r2){
	const dx= (r1.pos.x + r1.size.x/2)-(r2.pos.x + r2.size.x/2);
	const dy= (r1.pos.y + r1.size.y/2)-(r2.pos.y + r2.size.y/2);
	const width= (r1.size.x + r2.size.x)/2;
	const height= (r1.size.y + r2.size.y)/2;
	const crossWidth= width * dy;
	const crossHeight= height * dx;
	let collision= COLLISION.NONE;

	if(Math.abs(dx)<=width && Math.abs(dy)<=height){
		if(crossWidth>crossHeight){
			collision= (crossWidth>(-crossHeight)) ? COLLISION.BOTTOM : COLLISION.LEFT;
		}else{
			collision= (crossWidth>-(crossHeight)) ? COLLISION.RIGHT : COLLISION.TOP;
		}
	}
	return(collision);
}

export function ptInRect(x, y, r) {
	return 	r.left <= x && x <= r.right &&
			r.top <= y && y <= r.bottom;
}