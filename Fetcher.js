import Rule from "./Rule.js";
import fetch from "node-fetch";

export default class Fetcher {
	constructor(link) {
		let result = /problems\/([\w\-]+)/.exec(link); // Assume input is a sed-puzzle.com link
		// console.log(`RESULT ${result}`);
		if(!result) { // Not a link. Is it just the ID then?
			result = /([\w\-]+)/.exec(link);
		}
		// if(!result) {
		// 	throw new Error("Unrecognized link/problem ID");
		// }
		this.problemId = result[1];
	}

	async Fetch() {
		try {
			const response = await fetch(`https://api.sed-puzzle.com/problems/${this.problemId}`);
			var data = await response.json();

			this.rules = [];
			data.task.rules.forEach(ruleSet => {
				ruleSet.forEach(rule => {
					// console.log(rule);
					this.rules.push(new Rule(rule.beforeStr, rule.afterStr));
				})
			});
			this.initial = data.task.initialStr;
		}
		catch(e) {
			throw new Error("Something is wrong with the URL you provided");
		}
		// console.log(this.rules);
		// console.log(this.initial);
	}
}