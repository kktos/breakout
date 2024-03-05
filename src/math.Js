
export function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

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

/*

URGENT -> READ THIS TO FIX COLLISION
https://ailef.tech/2022/11/12/creating-a-2d-physics-engine-from-scratch-in-javascript/

*/
function collideRect1(r1, r2){
	const dx= (r1.left + r1.size.x/2)-(r2.left + r2.size.x/2);
	const dy= (r1.top + r1.size.y/2)-(r2.top + r2.size.y/2);
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

export function contains(r1, r2) {
  return (r1.left < r2.left && r1.top < r2.top && r2.bottom < r1.bottom && r2.right < r1.right);
}


function collideRect2(r1, r2){
	return intersectSide(intersect(r1, r2));
}

export const collideRect= collideRect1;

// window.TOGGLE= () => {
// 	if(collideRect == collideRect2) {
// 		collideRect= collideRect1;
// 		console.log("collideRect1");
// 	} else {
// 		collideRect= collideRect2;
// 		console.log("collideRect2");
// 	}
// };

export function ptInRect(x, y, r) {
	return 	r.left <= x && x <= r.right &&
			r.top <= y && y <= r.bottom;
}

function boundingRect(r1, r2) {
	const bbox= {
		left: Math.min(r1.left, r2.left),
		top: Math.min(r1.top, r2.top),
		right: Math.max(r1.right, r2.right),
		bottom: Math.max(r1.bottom, r2.bottom),
		width: 0,
		height: 0
	};
	bbox.width= bbox.right - bbox.left;
	bbox.height= bbox.bottom - bbox.top;
	return bbox;
}

export function growRect(bbox, x, y) {
	const left= bbox.left - x;
	const top= bbox.top - y;
	const right= bbox.right + x;
	const bottom= bbox.bottom + y;
	return {x: left, y: top, width: right-left, height: bottom-top};
}

function intersectSide(intersection) {
	if(!intersection) {
		return COLLISION.NONE;
	}
	if(intersection) {
		if (Math.abs(intersection.x) > Math.abs(intersection.y)) {
			if (intersection.x < 0) {
				return COLLISION.RIGHT;
			}
			return COLLISION.LEFT;
		} 

    if (intersection.y < 0) {
      return COLLISION.BOTTOM;
    }

    return COLLISION.TOP;
		
	}
	return COLLISION.NONE;
}

function intersect(r1, r2) {
    const totalBoundingBox = boundingRect(r1, r2);

    // If the total bounding box is less than or equal the sum of the 2 bounds then there is collision
    if (
      totalBoundingBox.width < r1.width + r2.width &&
      totalBoundingBox.height < r1.height + r2.height &&
	  !(totalBoundingBox.width === r1.width && totalBoundingBox.height === r1.height) &&
	  !(totalBoundingBox.width === r2.width && totalBoundingBox.height === r2.height)
    ) {
      // collision
      let overlapX = 0;
      // right edge is between the other's left and right edge
      /**
       *     +-this-+
       *     |      |
       *     |    +-other-+
       *     +----|-+     |
       *          |       |
       *          +-------+
       *         <---
       *          ^ overlap
       */
      if (r1.right >= r2.left && r1.right <= r2.right) {
        overlapX = r2.left - r1.right;
        // right edge is past the r2's right edge
        /**
         *     +-r2-+
         *     |       |
         *     |    +-r1-+
         *     +----|--+   |
         *          |      |
         *          +------+
         *          --->
         *          ^ overlap
         */
      } else {
        overlapX = r2.right - r1.left;
      }

      let overlapY = 0;
      // top edge is between the other's top and bottom edge
      /**
       *     +-other-+
       *     |       |
       *     |    +-this-+   | <- overlap
       *     +----|--+   |   |
       *          |      |  \ /
       *          +------+   '
       */
      if (r1.top <= r2.bottom && r1.top >= r2.top) {
        overlapY = r2.bottom - r1.top;
        // top edge is above the r2 top edge
        /**
         *     +-r1-+         .
         *     |      |        / \
         *     |    +-r2-+   | <- overlap
         *     +----|-+     |   |
         *          |       |
         *          +-------+
         */
      } else {
        overlapY = r2.top - r1.bottom;
      }

      if (Math.abs(overlapX) < Math.abs(overlapY)) {
        return {x: overlapX, y:0};
      } else {
        return {x: 0, y: overlapY};
      }
      // Case of total containment of one bounding box by another
    }
	else
	if(
		(totalBoundingBox.width == r1.width && totalBoundingBox.height == r1.height)
		||
		(totalBoundingBox.width == r2.width && totalBoundingBox.height == r2.height)) {
      let overlapX = 0;
      // this is wider than the other
      if (r1.width - r2.width >= 0) {
        // r1 right edge is closest to the r2s right edge
        if (r1.right - r2.right <= r2.left - r1.left) {
          overlapX = r2.left - r1.right;
          // r1 left edge is closest to the r2s left edge
        } else {
          overlapX = r2.right - r1.left;
        }
        // r2 is wider than r1
      } else {
        // r1 right edge is closest to the r2s right edge
        if (r2.right - r1.right <= r1.left - r2.left) {
          overlapX = r1.left - r2.right;
          // r1 left edge is closest to the r2s left edge
        } else {
          overlapX = r1.right - r2.left;
        }
      }

      let overlapY = 0;
      // this is taller than other
      if (r1.height - r2.height >= 0) {
        // The bottom edge is closest to the r2s bottom edge
        if (r1.bottom - r2.bottom <= r2.top - r1.top) {
          overlapY = r2.top - r1.bottom;
        } else {
          overlapY = r2.bottom - r1.top;
        }
        // r2 is taller than r1
      } else {
        // The bottom edge is closest to the r2s bottom edge
        if (r2.bottom - r1.bottom <= r1.top - r2.top) {
          overlapY = r1.top - r2.bottom;
        } else {
          overlapY = r1.bottom - r2.top;
        }
      }

      if (Math.abs(overlapX) < Math.abs(overlapY)) {
        return {x: overlapX, y:0};
      } else {
        return {x: 0, y: overlapY};
      }
    } else {
      return null;
    }
  }