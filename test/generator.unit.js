const assert = require('assert');
const gen = require('../js/generate_lp.js');

describe("Model to LP Generator", function() {
	it("generates from an empty model", function() {
		let dummy = {
			reactions: [],
			metabolites: []
		};
		assert.equal("Maximize\n\nSubject To\n\nBounds\n", gen(dummy, null));
	});

	it("generates from single reaction", function() {
		let dummy = {
			reactions: [
				{id: "R1", inputs: {"M1": 1}, outputs: {"M2": 1}, lower: 0, upper: 1000}
			],
			metabolites: [
				{id: "M1", reactions: []},
				{id: "M2", reactions: []}
			]
		};
		dummy.metabolites[0].reactions.push(dummy.reactions[0]);
		dummy.metabolites[1].reactions.push(dummy.reactions[0]);

		assert.equal("Maximize\n\nSubject To\nM1: + 1 R1 = 0\nM2: - 1 R1 = 0\n\nBounds\n0 <= R1 <= 1000\n", gen(dummy, null));
	});

	it("generates an objective function", function() {
		let dummy = {
			reactions: [],
			metabolites: []
		};
		let dummyobj = {
			inputs: {"M1": 2},
			outputs: {"M2": 1}
		}

		assert.equal("Maximize\nobj: + 2 M1 - 1 M2\n\nSubject To\n\nBounds\n", gen(dummy, dummyobj));
	});
});

