import Fetcher from "./Fetcher.js";

export default class Solver {
	static maxSteps = 100;
	static maxLength = 20;

	constructor(rules, initial) {
		this.rules = rules;
		this.initial = initial;
	}

	Bfs() {
		// Simple breadth first search
		console.time("BFS");
		// Map of (key, value) = (string, index of rule applied to get here)
		const table = new Map();
		table.set(this.initial, {});
		const queue = [{str: this.initial, steps: 0}];
		outerLoop:
		while(queue.length > 0) {
			const {str, steps} = queue.shift();
			// console.log(`CURRENT: ${str}`);
			if(steps > Solver.maxSteps) { // Failed to find solution within specified amount of steps
				break;
			}
			// Try to apply every rule
			for(let i = 0; i < this.rules.length; i++) {
				const appliedStr = this.rules[i].Apply(str);
				if(appliedStr == null) { // Rule not applicable
					continue;
				}
				if(appliedStr.length > Solver.maxLength) { // Derived string too long
					continue;
				}
				if(table.has(appliedStr)) { // String has previously been derived
					continue;
				}
				// It's a new string!
				table.set(appliedStr, {ruleUsed: i, prevStr: str});
				if(appliedStr.length == 0) { // Win!
					break outerLoop;
				}
				// Next iteration
				queue.push({str: appliedStr, steps: steps+1});
			}
		}
		// Output time
		if(table.has("")) { // Puzzle has been solved
			let countSteps = 0;
			const Retrace = function(str, obj) {
				if(str == this.initial) { // We're at the beginning
					console.log("-------BEGIN-------");
					console.log(str);
					return;
				}
				else {
					Retrace(obj.prevStr, table.get(obj.prevStr));
				}
				console.log();
				console.log(`Use Rule: ${this.rules[obj.ruleUsed]}`);
				countSteps++;
				console.log(str.length > 0 ? str : "∅");
			}.bind(this);
			Retrace("", table.get(""));
			console.log();
			console.log(`TOTAL STEPS: ${countSteps}`);
			console.log("-------END-------");
		}
		else {
			console.log("Failed to solve puzzle :(");
		}
		console.timeEnd("BFS");
	}

	Bidirectional() {
		// Bidirectional BFS
		console.time("Bidirectional BFS");
		const fwTable = new Map(); // forward table
		const bwTable = new Map(); // backward table
		fwTable.set(this.initial, {});
		bwTable.set("", {});
		let fwQueue = [{str: this.initial}]; // forward queue
		let bwQueue = [{str: ""}]; // backward queue
		let midpoint = null; // Intersection point between two searches
		outerLoop:
		for(let halfSteps = 0; 2 * halfSteps <= Solver.maxSteps; halfSteps++) {
			const fwQueueNew = [];
			const bwQueueNew = [];
			while(fwQueue.length > 0) {
				const {str} = fwQueue.shift();
				// console.log(`CURRENT FORWARD: ${str}`);
				for(let i = 0; i < this.rules.length; i++) {
					const appliedStr = this.rules[i].Apply(str);
					if(appliedStr == null) { // Rule not applicable
						continue;
					}
					if(appliedStr.length > Solver.maxLength) { // Derived string too long
						continue;
					}
					if(fwTable.has(appliedStr)) { // String has previously been derived
						continue;
					}
					// It's a new string!
					fwTable.set(appliedStr, {ruleUsed: i, prevStr: str});
					if(bwTable.has(appliedStr)) { // Meets in the middle!
						midpoint = appliedStr;
						break outerLoop;
					}
					// Next iteration
					fwQueueNew.push({str: appliedStr});
				}
			}
			while(bwQueue.length > 0) {
				const {str} = bwQueue.shift();
				// console.log(`CURRENT BACKWARD: ${str}`);
				for(let i = 0; i < this.rules.length; i++) {
					const preimages = this.rules[i].ReverseApply(str);
					for(let j = 0; j < preimages.length; j++) {
						const preimage = preimages[j];
						if(preimage.length > Solver.maxLength) {
							continue;
						}
						if(bwTable.has(preimage)) {
							continue;
						}
						// It's a new string!
						bwTable.set(preimage, { ruleUsed: i, nextStr: str });
						if(fwTable.has(preimage)) { // Meets in the middle!
							midpoint = preimage;
							break outerLoop;
						}
						// Next iteration
						bwQueueNew.push({ str: preimage });
					}
				}
			}
			fwQueue = fwQueueNew;
			bwQueue = bwQueueNew;
		}
		// Output time
		if(midpoint != null) { // Puzzle has been solved
			let countSteps = 0;
			const LeftRetrace = function(str, obj) {
				if(str == this.initial) { // We're at the beginning
					console.log("-------BEGIN-------");
					console.log(str);
					return;
				}
				else {
					LeftRetrace(obj.prevStr, fwTable.get(obj.prevStr));
				}
				console.log();
				console.log(`Use Rule: ${this.rules[obj.ruleUsed]}`);
				countSteps++;
				console.log(str.length > 0 ? str : "∅");
			}.bind(this);
			LeftRetrace(midpoint, fwTable.get(midpoint));
			console.log();

			// console.log("-----------MIDDLE---------");
			// Right trace
			for(let [str, obj] = [midpoint, bwTable.get(midpoint)]; str != ""; [str, obj] = [obj.nextStr, bwTable.get(obj.nextStr)]) {
				console.log(`Use Rule: ${this.rules[obj.ruleUsed]}`);
				countSteps++;
				console.log(obj.nextStr.length > 0 ? obj.nextStr : "∅");
				console.log();
			}
			console.log(`TOTAL STEPS: ${countSteps}`);
			console.log("-------END-------");
		}
		else {
			console.log("Failed to solve puzzle :(");
		}
		console.timeEnd("Bidirectional BFS");
	}

	static async SolveFile(path, search="BFS") {
		const fetcher = new Fetcher(true, path);
		await fetcher.Read();
		const solver = new Solver(fetcher.rules, fetcher.initial);
		switch(search) {
			case "BFS":
				solver.Bfs();
				break;
			case "BIDIRECTIONAL":
				solver.Bidirectional();
				break;
			default:
				throw new Error("Unrecognized algorithm type");
		}
	}

	static async SolveLink(link, search="BFS", saveCopyPath) {
		const fetcher = new Fetcher(false, link);
		await fetcher.Fetch(saveCopyPath);
		const solver = new Solver(fetcher.rules, fetcher.initial);
		switch(search) {
			case "BFS":
				solver.Bfs();
				break;
			case "BIDIRECTIONAL":
				solver.Bidirectional();
				break;
			default:
				throw new Error("Unrecognized algorithm type");
		}
	}
}