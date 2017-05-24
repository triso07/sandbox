(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', 'classes'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('classes'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.classes);
		global.data = mod.exports;
	}
})(this, function (exports, _classes) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.removeDataItem = exports.addDataItem = exports.addDataBudget = undefined;


	// ---------- DATA CONTROLLER ---------- //


	// +++++ VARIABLES +++++ //
	let budget = {};

	// +++++ ADD DATA BUDGET +++++ //
	// !!!!!!!!!!!!!!!!!!!! IMPORTS !!!!!!!!!!!!!!!!!!!! //
	function addDataBudget(types) {
		// create new budget object and pass types taken from select dropdown
		budget = new _classes.Budget(types);
	}

	// +++++ ADD DATA ITEM +++++ //
	function addDataItem(itemType, domValues, cbDisplayChanges) {
		// store new item in data map
		budget[itemType].items.set(domValues.id, new _classes.BudgetItem(domValues.desc, domValues.val));
		// calculate totals and percentages
		doCalculataions(itemType);
		// return to UI with data
		cbDisplayChanges(budget);
	}

	// +++++ REMOVE DATA ITEM +++++ //
	function removeDataItem(itemType, id, cbDisplayChanges) {
		// delete item from data map
		budget[itemType].items.delete(id);
		// calculate totals and percentages
		doCalculataions(itemType);
		// return to UI with data
		cbDisplayChanges(budget);
	}

	// +++++ DO CALCULATIONS +++++ //
	function doCalculataions(itemType) {
		budget[itemType].calculateTotal();
		budget[itemType].calculateItemPercentage();
		budget.calculateTotals();
	}

	// !!!!!!!!!!!!!!!!!!!! EXPORTS !!!!!!!!!!!!!!!!!!!! //
	exports.addDataBudget = addDataBudget;
	exports.addDataItem = addDataItem;
	exports.removeDataItem = removeDataItem;
});