import convertXtoYbitarray from "convert-x-to-y-bit-array";
import { getData, enableCors } from '../../main.js';

// `/api/tcgdeckshare/decode
export default function fetchUser(req, res) {
	if (!enableCors(req, res)) return;
	if (req.query.code === undefined) return;

	let code = decodeURIComponent(req.query.code.replaceAll(' ', '+'));

	let output = decode(code);

	return res.json({ deckcode: code, cardshareids: output });
}

function decode(str) {
	const byteArray = Array.from(atob(str), c => c.codePointAt(0));
	const lastByte = byteArray.pop();

	const reordered = [
		...Array.from({ length: 25 }).fill(0).map((_, i) => byteArray[2 * i] - lastByte),
		...Array.from({ length: 25 }).fill(0).map((_, i) => byteArray[2 * i + 1] - lastByte),
		0,
	];

	const output = convertXtoYbitarray(8, 12, reordered);
	output.pop();

	return output;
}