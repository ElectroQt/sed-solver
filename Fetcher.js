import Rule from "./Rule.js";
import fetch from "node-fetch";
import { readFile } from "fs/promises";

export default class Fetcher {
	constructor(isLocal, path) {
		if(isLocal) { // Is local file path
			this.filePath = path;
			return;
		}
		// Is a link
		let result = /problems\/([\w\-]+)/.exec(path); // Assume input is a sed-puzzle.com link
		if(!result) { // Not a link. Is it just the ID then?
			result = /([\w\-]+)/.exec(path);
		}
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

	async Read() {
		try {
			var data = await readFile(this.filePath, { encoding: "utf-8" });
			// console.log(data);
		}
		catch(e) {
			throw new Error(`Cannot read file at ${this.filePath}`);
		}

		try {
			this.rules = [];
			var rules = data.split(/\r?\n/);
			this.initial = rules[0];
			rules.splice(0, 1);
			rules = rules.filter(elem => elem.length > 0);
			// console.log(rules);
			rules.forEach(rule => {
				const arrowAt = rule.indexOf("->");
				if(arrowAt == -1) { // No arrow found
					throw new Error();
				}
				const beforeStr = rule.substring(0, arrowAt).trim();
				const afterStr = rule.substring(arrowAt + 2).trim();
				this.rules.push(new Rule(beforeStr, afterStr));
			})
		}
		catch(e) {
			console.error(e);
			throw new Error("Unexpected file formatting. See https://github.com/ElectroQt/sed-solver");
		}
	}
}