const fba = require('../');
const assert = require('assert');
const sbml = require('sbml');

describe("Test simulation", function() {
	it("loads Synechocystis model and does FBA correctly", function(done) {
		sbml.fromFile('test/data/iSynCJ816-mmc12.xml', function(model) {
			var res = fba.run(model, model.getReactionById("R_Ec_biomass_SynAuto"));

			console.log(res);
			done();
		});
	});
});

