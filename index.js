import minimist from "minimist";
import Solver from "./Solver.js";

async function Main() {
	const argv = minimist(process.argv.slice(2));
	
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

	let saveCopyPath = argv.saveCopy;
	if(argv.c) saveCopyPath = argv.c;

	let path = argv.file;
	if(argv.f) path = argv.f;
	if(path) { // Solve local file
		await Solver.SolveFile(path, algorithm ?? "BFS");
	}
	else { // Solve link
		const link = argv._[0];
		if(!link) {
			console.error("Please provide sed-puzzle.com link or puzzle ID");
			return;
		}
		await Solver.SolveLink(link, algorithm ?? "BFS", saveCopyPath);
	}
}

await Main();