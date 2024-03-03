
// https://gist.github.com/Ely-S/4191458
export function clone(original, duplicata= {} ) {
	for(const i in original)
		duplicata[i]= (original[i] && typeof original[i] === "object") ?
					clone(original[i], original[i].constructor())
					:
					original[i];
	return duplicata;
}