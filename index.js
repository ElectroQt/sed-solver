import minimist from "minimist";
import Solver from "./Solver.js";

async function Main() {
	const argv = minimist(process.argv.slice(2));

	if(!argv._[0]) {
		console.error("Please provide sed-puzzle.com link or puzzle ID");
		return;
	}
	
	let maxLength = argv.maxLength;
	if(argv.l) maxLength = argv.l;
	if(!maxLength) {
		console.error("--maxLength or -l must be provided!");
		return;
	}
	Solver.maxLength = maxLength;

	let maxSteps = argv.maxSteps;
	if(argv.s) maxSteps = argv.s;
	Solver.maxSteps = maxSteps ?? 100;

	let algorithm = argv.algorithm;
	if(argv.alg) algorithm = argv.alg;
	if(argv.a) algorithm = argv.a;

	await Solver.SolveLink(argv._[0], algorithm ?? "BFS");
}

await Main();