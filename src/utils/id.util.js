export function generateID() {
	let letters= [];
	for(let idx= 0; idx <5; idx++)
		letters.push(65 + Math.random()*26);
	return String.fromCharCode(...letters);
}