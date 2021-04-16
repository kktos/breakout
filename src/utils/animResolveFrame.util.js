
export default function animResolveFrame(anim, time) {
	if(anim.isStopped || !anim.loop)
		return anim.frames[0];

	const frameIdx= Math.floor(time / anim.len) % anim.frames.length;
	if(anim.lastFrameIdx != frameIdx) {
		if(frameIdx == anim.frameIdx)
			anim.loop--;
		if(anim.frameIdx<0)
			anim.frameIdx= frameIdx;
	}
	
	anim.lastFrameIdx= frameIdx;
	return anim.frames[frameIdx];
}
