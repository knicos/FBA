var glpk = require('../lib/glpk.min.js');

let translator = require('./generate_lp.js');

function runFBA(model, obj, cb, options) {
	let t = translator(model, obj);

	console.log("LP SOURCE=======");
	console.log(t);
	console.log("================");

	let l = [];

	function doLog(value) { l.push(value); };

	glpk.glp_set_print_func(doLog);

	let lp = glpk.glp_create_prob();
	glpk.glp_read_lp_from_string(lp, null, t);
	glpk.glp_scale_prob(lp, glpk.GLP_SF_AUTO);
	let smcp = new glpk.SMCP({presolve: glpk.GLP_ON});
	glpk.glp_simplex(lp, smcp);

	let objective = 0.0;
	let result = {};

	console.log(glpk);

	/*if (mip) {
		glp_intopt(lp);
		objective = glp_mip_obj_val(lp);
		for(var i = 1; i <= glp_get_num_cols(lp); i++){
			result[glp_get_col_name(lp, i)] = glp_mip_col_val(lp, i);
		}
	} else {*/
		objective = glpk.glp_get_obj_val(lp);
		for(var i = 1; i <= glpk.glp_get_num_cols(lp); i++){
			result[glpk.glp_get_col_name(lp, i)] = glpk.glp_get_col_prim(lp, i);
		}
	//}

	console.log("LOG", l);

	if (cb) cb(objective, result);
	else return {objective: objective, fluxes: result};
}

exports.run = runFBA;

