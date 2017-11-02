
function generate(model, objective) {
	var res = "Maximize\n";
	if (objective) {
		res += "obj:";
		for (var x in objective.inputs) {
			res += " + " + objective.inputs[x] + " " + x;
		}

		for (var x in objective.outputs) {
			res += " - " + objective.outputs[x] + " " + x;
		}

		res += "\n";
	}

	res += "\nSubject To\n";
	for (var i=0; i<model.metabolites.length; i++) {
		let m = model.metabolites[i];
		if (m.reactions.length == 0) continue;
		res += m.id + ":";
		
		for (var j=0; j<m.reactions.length; j++) {
			let r = m.reactions[j];
			if (r.inputs[m.id] !== undefined) {
				if (r.outputs[m.id] !== undefined) {
					var d = r.inputs[m.id] - r.outputs[m.id];
					if (d < 0) {
						res += " - " + Math.abs(d) + " " + r.id;
					} else {
						res += " + " + d + " " + r.id;
					}
				} else {
					res += " + " + r.inputs[m.id] + " " + r.id;
				}
			} else {
				res += " - " + r.outputs[m.id] + " " + r.id;
			}
		}

		res += " = 0\n";
	}

	res += "\nBounds\n";
	for (var i=0; i<model.reactions.length; i++) {
		let r = model.reactions[i];
		res += r.lower + " <= " + r.id + " <= " + r.upper + "\n";
	}
	return res;
}

module.exports = generate;

