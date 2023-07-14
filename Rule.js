export default class Rule {
	constructor(before, after) {
		this.before = before;
		this.after = after;
	}

	toString() {
		let str = this.before.length > 0 ? this.before : "∅";
		str += " → ";
		str += this.after.length > 0 ? this.after : "∅";
		return str;
	}

	Apply(str) { // Apply this rule to str, return null if not applicable
		if(this.before.length == 0) {
			return this.after + str;
		}
		const i = str.indexOf(this.before);
		
		if(i != -1) {
			return str.substring(0, i) + this.after + str.substring(i + this.before.length);
		}
		return null;
	}

	ReverseApply(str) {
		/* This is more problematic. There can be a number of ways to get to str
		 * by applying one rule, so this function returns an array of all possible preimages
		 */
		const preimages = [];
		if(this.after.length == 0) { // this.before can go anywhere
			for(let i = 0; i <= str.length; i++) {
				preimages.push(str.substring(0, i) + this.before + str.substring(i));
			}
		}
		else {
			for(let i = str.indexOf(this.after); i != -1; i = str.indexOf(this.after, i+1)) {
				// console.log(i);
				const preimage = str.substring(0, i) + this.before + str.substring(i + this.after.length);
				// console.log(preimage);
				if(preimage.indexOf(this.before) < i) {
					/* Tricky situation, e.g. str == "AB", rule == "AA -> B".
					 * preimage == "AAA", but note that we CANNOT attain "AB" from preimage!
					 * Solution: check if we can match rule in preimage earlier than the index,
					 * if so, discard
					 */
					continue;
				}
				preimages.push(preimage);
			}
		}
		return preimages;
	}
}