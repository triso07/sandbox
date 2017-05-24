(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports);
		global.classes = mod.exports;
	}
})(this, function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// ---------- CLASSES ---------- //


	// +++++ BUDGET +++++ //
	class Budget {
		constructor(types) {
			this.types = types;
			this.addTypes();
			this.availBudget = 0;
		}
		addTypes() {
			// use map function to loop through array and create new type objects based on select option values
			this.types.map(type => this[type] = new BudgetType());
		}
		calculateBudget() {
			this.availBudget = this.inc.total - this.exp.total;
		}
		calculateTotals() {
			this.calculateBudget();
			let total = 0,
			    props = [];
			for (let prop in this) {
				this.types.map((type, index) => {
					if (type === prop) {
						total += this[prop].total;
						props.push(prop);
					}
				});
			}
			props.map(prop => this[prop].percentage = calculatePercentage(this[prop].total, total));
		}
	}

	// +++++ BUDGET TYPE +++++ //
	class BudgetType {
		constructor() {
			this.items = new Map();
			this.total = 0;
			this.percentage = 0;
		}
		calculateTotal() {
			this.total = 0;
			this.items.forEach((item, key) => {
				this.total += item.val;
			});
		}
		calculateItemPercentage() {
			this.items.forEach((item, key) => {
				item.percentage = calculatePercentage(item.val, this.total);
			});
		}
	}

	// +++++ BUDGET ITEM +++++ //
	class BudgetItem {
		constructor(desc, val) {
			this.desc = desc;
			this.val = val;
			this.percentage = 0;
		}
	}

	// +++++ CALCULATE PERCENTAGE +++++ //
	function calculatePercentage(x, y) {
		const formula = Math.round(x / y * 100);
		return isNaN(formula) ? 0 : formula;
	}

	// !!!!!!!!!!!!!!!!!!!! EXPORTS !!!!!!!!!!!!!!!!!!!! //
	exports.Budget = Budget;
	exports.BudgetItem = BudgetItem;
});